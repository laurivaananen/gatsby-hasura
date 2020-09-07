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
