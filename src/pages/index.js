import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"

class IndexPage extends React.Component {
  render() {
    const siteTitle = "Code Happier"

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Home"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <img style={{ margin: 0 }} src="./developer1.jpg" alt="Gatsby Scene" />
        <h1>
          Hey there.
          <span role="img" aria-label="wave emoji">
            👋
          </span>
        </h1>
        <p>
          In this blog, I share tidbits from my development experience and my
          entrepreneurial journey building my own SaaS product.
        </p>
        <p>
          I am a co-founder of <a href="https://coworksapp.com/">Coworks</a>, a
          flexible office space management platform, and I'm passionate about
          learning, improving my skills, and sharing that knowledge.
        </p>
        <p>
          I cover everything from my experience with new libraries, ways I've
          grown as a engineer, and how I've applied my knowledge to build
          Coworks!
        </p>
        <p>
          I code in ReactJS, Kotlin/Java for Android, Rails on the backend, and
          React Native daily and I hope to provide something useful to you.
        </p>
        <Link to="/blog/">
          <Button marginTop="35px">Let's do this</Button>
        </Link>
      </Layout>
    )
  }
}

export default IndexPage
