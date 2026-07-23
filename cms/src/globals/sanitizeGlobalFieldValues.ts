/** Flatten legacy locale-keyed text values stored on non-localized fields. */
export const sanitizeTextFieldValue = (value: unknown): string | null | undefined => {
  if (value == null || value === '') {
    return typeof value === 'string' ? value : null
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    const localized = record.en ?? record.de

    if (typeof localized === 'string') {
      return localized
    }

    const firstString = Object.values(record).find((entry) => typeof entry === 'string')
    return typeof firstString === 'string' ? firstString : null
  }

  return null
}

/** Ensure upload/relationship fields receive IDs, not populated documents. */
export const sanitizeRelationshipId = (value: unknown): string | null | undefined => {
  if (value == null || value === '') {
    return typeof value === 'string' ? value : null
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return id == null ? null : String(id)
  }

  return null
}

export const sanitizeHeaderGlobalData = <
  T extends {
    logo?: unknown
    phone?: unknown
    clientLoginLink?: unknown
    cta?: { link?: unknown } | null
    links?: Array<{
      enableDropdown?: boolean | null
      dropdown?: {
        services?: Array<{ link?: unknown }>
        testimonial?: { authorImage?: unknown }
        backgroundImage?: unknown
      } | null
    }> | null
  },
>(
  data: T,
): T => {
  const result = { ...data } as T

  if (result.logo !== undefined) {
    result.logo = sanitizeRelationshipId(result.logo) as T['logo']
  }

  if (result.phone !== undefined) {
    result.phone = sanitizeTextFieldValue(result.phone) as T['phone']
  }

  if (result.clientLoginLink !== undefined) {
    result.clientLoginLink = sanitizeTextFieldValue(result.clientLoginLink) as T['clientLoginLink']
  }

  if (result.cta?.link !== undefined) {
    result.cta = {
      ...result.cta,
      link: sanitizeRelationshipId(result.cta.link),
    }
  }

  if (result.links) {
    result.links = result.links.map((link) => {
      if (!link.dropdown) return link
      const cleanedLink = { ...link, dropdown: { ...link.dropdown } }
      if (cleanedLink.dropdown.services) {
        cleanedLink.dropdown.services = cleanedLink.dropdown.services.map((s) => ({
          ...s,
          link: s.link !== undefined ? sanitizeRelationshipId(s.link) : s.link,
        }))
      }
      if (cleanedLink.dropdown.testimonial?.authorImage !== undefined) {
        cleanedLink.dropdown.testimonial = {
          ...cleanedLink.dropdown.testimonial,
          authorImage: sanitizeRelationshipId(cleanedLink.dropdown.testimonial.authorImage),
        }
      }
      if (cleanedLink.dropdown.backgroundImage !== undefined) {
        cleanedLink.dropdown.backgroundImage = sanitizeRelationshipId(
          cleanedLink.dropdown.backgroundImage,
        )
      }
      return cleanedLink
    })
  }

  return result
}
