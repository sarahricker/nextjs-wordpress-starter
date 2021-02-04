import {gql} from '@apollo/client'
import globalPostFields from '../_partials/globalPostFields'
import featuredImagePostFields from '../_partials/featuredImagePostFields'
import archivePageInfo from '../_partials/archivePageInfo'
import defaultPageData from '../_partials/defaultPageData'

// Fragment: retrieve archive team fields.
const archiveTeamFragment = gql`
  fragment ArchiveTeamFields on Team {
    ${globalPostFields}
    excerpt
    ${featuredImagePostFields}
    teamMemberProfile {
      easterEggUrl
    }
  }
`

// Query: retrieve teams archive.
const queryTeamsArchive = gql`
  query GET_TEAMS_ARCHIVE(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $orderBy: PostObjectsConnectionOrderbyEnum = DATE
    $order: OrderEnum = DESC
    $imageSize: MediaItemSizeEnum = THUMBNAIL
  ) {
    ${defaultPageData}
    teams(
      first: $first
      last: $last
      after: $after
      before: $before
      where: {orderby: {field: $orderBy, order: $order}}
    ) {
      ${archivePageInfo}
      edges {
        node {
          ...ArchiveTeamFields
        }
      }
    }
  }
  ${archiveTeamFragment}
`

export default queryTeamsArchive
