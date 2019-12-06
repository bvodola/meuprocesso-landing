import React from "react"
import Section from "../components/Section"
import styled from "styled-components"
import Nav from "../components/Nav/Nav"

const Layout = styled.div`
  margin: 0 20px;
  padding-top: 59px;

  * {
    box-sizing: border-box;
    font-family: Montserrat;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
  }
  ul {
    margin-left: 1.75rem;
  }
  li {
    margin-bottom: 0;
  }
`

export default props => {
  let { sections } = props.data.markdownRemark.frontmatter

  // Manipulate sectios in order to respect rows and columns
  sections &&
    sections.forEach((section, i) => {
      // If we are starting a grid section
      if (section.type === "grid") {
        // Set the grid nested sections array
        section.gridSections = []

        // Nest the next sections to the grid
        for (let j = 0; j < section.gridSize; j++) {
          section.gridSections =
            typeof sections[i + j + 1] !== "undefined"
              ? [...section.gridSections, sections[i + j + 1]]
              : [...section.gridSections, { type: "empty" }]
        }

        // Remove the nested sections from the main sections array
        sections.splice(i + 1, section.gridSize)
      }
    })

  console.log(sections)

  return (
    <Layout>
      <Nav
        logo={"/img/meu-processo-logo.png"}
        phone={"(11) 99469-5279"}
        whatsapp={"11994695279"}
      />
      {sections &&
        sections.map((section, i) => (
          <Section
            key={Math.random()
              .toString(36)
              .substring(7)}
            {...section}
          />
        ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query LandingPageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        sections {
          customCSS
          buttonText
          buttonColor
          buttonLink
          desktopImage
          header
          mobileImage
          description
          type
          imageHeight
          bgColor
          gridSize
          textContent
          lgPadding
          mdPadding
          features {
            image
            title
            description
          }
          numberedFeatures
          formFields {
            id
            name
            type
            placeholder
            options {
              value
            }
          }
        }
      }
    }
  }
`
