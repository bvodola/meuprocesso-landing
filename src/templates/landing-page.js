import React from "react"
import axios from "axios"
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

class LandingPage extends React.Component {
  constructor(props) {
    super(props)

    let { sections } = props.data.markdownRemark.frontmatter
    this.sections = this.generateSectionsGrid(sections)

    this.state = {
      form: {},
      isModalOpened: false,
    }

    this.setFormValue = this.setFormValue.bind(this)
    this.setModalState = this.setModalState.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  generateSectionsGrid(oldSections) {
    const sections = JSON.parse(JSON.stringify(oldSections))

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

    return sections
  }

  setFormValue(key, val) {
    this.setState(state => {
      return {
        form: {
          ...state.form,
          [key]: val,
        },
      }
    })
  }

  setModalState(isModalOpened) {
    this.setState({ isModalOpened })
  }

  async handleFormSubmit(ev, formData) {
    ev.preventDefault()
    const BACKEND_URL = "https://www.leadmaster.com.br"
    await axios.post(BACKEND_URL + "/api/mail/send/", {
      from: "leads@meuprocesso.com.br",
      to: formData.to,
      subject: "Lead Divórcio",
      text: `Nome: ${formData.name}, Telefone: ${formData.phone}`,
    })

    // Empty form state
    this.setState(state => {
      let emptyForm = {}
      Object.keys(this.state.form).map(key => {
        emptyForm[key] = ""
      })
      state.form = emptyForm
      return state
    })
  }

  render() {
    return (
      <Layout>
        {/* *** */}
        {/* Nav */}
        {/* *** */}
        <Nav
          logo={"/img/meu-processo-logo.png"}
          phone={"(11) 99469-5279"}
          whatsapp={"11994695279"}
        />

        {/* ******** */}
        {/* Sections */}
        {/* ******** */}
        {this.sections &&
          this.sections.map((section, i) => (
            <Section
              {...section}
              form={this.state.form}
              setFormValue={this.setFormValue}
              isModalOpened={this.state.isModalOpened}
              setModalState={this.setModalState}
              handleFormSubmit={this.handleFormSubmit}
            />
          ))}
      </Layout>
    )
  }
}

export default LandingPage

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
          form_id
          submit_text
          emails_to_send
          post_endpoint
          post_endpoint_auth_header
          redirect_after_submit
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
