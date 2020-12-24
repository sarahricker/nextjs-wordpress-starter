import {gql} from '@apollo/client'
import {isValidPostType, postTypes, isHierarchicalPostType} from './postTypes'
import {initializeApollo} from '../connector'

/**
 * Retrieve static paths by post type.
 *
 * @author WebDevStudios
 * @param  {string} postType WP post type.
 * @return {Object}          Post type paths.
 */
export default async function getPostTypeStaticPaths(postType) {
  if (!postType || !isValidPostType(postType)) {
    return null
  }

  // Retrieve post type plural name.
  const pluralName = postTypes[postType]

  // Check if post type is hierarchical.
  const isHierarchical = isHierarchicalPostType(postType)

  // Determine path field based on hierarchy.
  const pathField = isHierarchical ? 'uri' : 'slug'

  // Construct query based on post type.
  const query = gql`
    query GET_SLUGS {
      ${pluralName}(first: 10000) {
        nodes {
          ${pathField}
        }
      }
    }
  `

  // Get/create Apollo instance.
  const apolloClient = initializeApollo()

  // Execute query.
  const posts = await apolloClient.query({query})

  // Process paths.
  const paths = !posts?.data?.[pluralName]?.nodes
    ? []
    : posts.data[pluralName].nodes.map((post) => {
        // Use path field as-is for non-hierarchical post types.
        // Trim leading and trailing slashes then split into array on inner slashes for hierarchical post types.
        const slug = !isHierarchical
          ? post[pathField]
          : post[pathField].replace(/^\/|\/$/g, '').split('/')

        return {
          params: {
            slug
          }
        }
      })

  return {
    paths,
    fallback: false
  }
}