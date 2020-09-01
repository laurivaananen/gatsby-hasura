const path = require(`path`)

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/account/)) {
    page.matchPath = "/account/*"

    // Update the page.
    createPage(page)
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const result = await graphql(`
    query MyQuery {
      hasura {
        mod {
          description
          id
          title
          updated_at
          created_at
        }
      }
    }
  `)

  console.log(JSON.stringify(result, null, 2))

  result.data.hasura.mod.forEach(mod => {
    createPage({
      path: `mods/${mod.id}`,
      component: path.resolve(`./src/components/Mod.tsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.

        ...mod,
      },
    })
  })
}
