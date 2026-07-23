import { Resend } from 'resend'
import type { Endpoint } from 'payload'

export const contactEndpoint: Endpoint = {
  path: '/contact',
  method: 'post',
  handler: async (req) => {
    try {
      if (!req.json) {
        return new Response(
          JSON.stringify({ error: 'Invalid request' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
      const body = await req.json()
      const { name, email, message, phone } = body as Record<string, unknown>

      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: 'name, email, and message are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (typeof email !== 'string' || !emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email address' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'contact@savior.im',
        to: 'bharat@savior.im',
        subject: `New contact form submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? 'N/A'}\n\nMessage:\n${message}`,
      })

      if (process.env.CONTACT_WEBHOOK_URL) {
        await fetch(process.env.CONTACT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, phone }),
        }).catch((err) => {
          console.error('Webhook error:', err)
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('Contact form error:', err)
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
}
