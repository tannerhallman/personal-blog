module.exports = {
  siteMetadata: {
    // edit below
    title: `Code Happier`,
    author: `Tanner`,
    description: `A personal blog built to share what I've learned and things that interest me.`,
    siteUrl: `https://codehappier.com/`,
    social: {
      twitter: `hallmanitor`,
    },
  },
  plugins: [
    `gatsby-plugin-netlify-cms`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "blog",
        engine: "flexsearch",
        engineOptions: {
          encode: "icase",
          tokenize: "forward",
          async: false,
        },
        query: `
          {
            allMdx {
              nodes {
                id
                fields { slug }
                excerpt
                rawBody
                frontmatter {
                  title
                  description
                  date(formatString: "MMMM DD, YYYY")
                }
              }
            }
          }
        `,
        ref: "id",
        index: ["title", "rawBody"],
        store: ["id", "slug", "date", "title", "excerpt", "description"],
        normalizer: ({ data }) =>
          data.allMdx.nodes.map((node) => ({
            id: node.id,
            slug: node.fields.slug,
            rawBody: node.rawBody,
            excerpt: node.excerpt,
            title: node.frontmatter.title,
            description: node.frontmatter.description,
            date: node.frontmatter.date,
          })),
      },
    },
    `gatsby-plugin-feed-mdx`,
    `gatsby-plugin-root-import`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".mdx", ".md"],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-vscode`,
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
          },
          {
            resolve: `gatsby-remark-smartypants`,
          },
        ],
        plugins: [`gatsby-remark-images`],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // edit below
        trackingId: `G-97SM49SRRC`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Tanners Blog`,
        short_name: `TBlog`,
        start_url: `/`,
        background_color: `#FFFFFF`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        // edit below
        icon: `content/assets/tanner.jpeg`,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
