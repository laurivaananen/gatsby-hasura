// const path = require(`path`)

// exports.onCreatePage = async ({ page, actions }) => {
//   const { createPage } = actions
//   // Only update the `/app` page.
//   if (page.path.match(/^\/mods/)) {
//     // page.matchPath is a special key that's used for matching pages
//     // with corresponding routes only on the client.
//     page.matchPath = "/mods/*"
//     // Update the page.
//     createPage(page)
//   }
// }

// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions
//   const result = await graphql(`
//     query MyQuery {
//       hasura {
//         mod {
//           description
//           id
//           title
//           updated_at
//           created_at
//           user {
//             id
//             username
//           }
//         }
//       }
//     }
//   `)

//   console.log(JSON.stringify(result, null, 2))

//   result.data.hasura.mod.forEach(mod => {
//     createPage({
//       path: `mods/${mod.id}`,
//       component: path.resolve(`./src/components/staticMod.tsx`),
//       context: {
//         ...mod,
//       },
//     })
//   })
// }
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    /*
     * During the build step, `auth0-js` will break because it relies on
     * browser-specific APIs. Fortunately, we don’t need it during the build.
     * Using Webpack’s null loader, we’re able to effectively ignore `auth0-js`
     * during the build. (See `src/utils/auth.js` to see how we prevent this
     * from breaking the app.)
     */
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /auth0-js/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
