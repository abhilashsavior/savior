const fs = require("fs")
const path = require("path")

const patches = [
  {
    target: path.join(
      __dirname,
      "..",
      "node_modules/.pnpm/@payloadcms+next@3.86.0_@ty_b4bbff7b9ac13db88c799d9e89bc75ef/node_modules/@payloadcms/next/dist/layouts/Root/index.js"
    ),
    search: '    }), /*#__PURE__*/_jsxs("body", {',
    replace: '    }), /*#__PURE__*/_jsxs("body", {\n      suppressHydrationWarning: true,',
  },
  {
    target: path.join(
      __dirname,
      "..",
      "node_modules/@payloadcms/next/dist/layouts/Root/index.js"
    ),
    search: '    }), /*#__PURE__*/_jsxs("body", {',
    replace: '    }), /*#__PURE__*/_jsxs("body", {\n      suppressHydrationWarning: true,',
  },
]

let applied = 0
for (const patch of patches) {
  try {
    if (!fs.existsSync(patch.target)) continue
    let content = fs.readFileSync(patch.target, "utf8")
    if (!content.includes("suppressHydrationWarning: true,")) {
      content = content.replace(patch.search, patch.replace)
      fs.writeFileSync(patch.target, content)
      console.log("Applied patch:", patch.target)
      applied++
    } else {
      console.log("Patch already applied:", patch.target)
    }
  } catch (e) {
    console.error("Failed to apply patch:", patch.target, e.message)
  }
}
if (applied === 0) {
  console.log("No patches needed or all patches already applied.")
}