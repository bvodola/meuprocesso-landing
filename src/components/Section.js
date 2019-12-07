import React from "react"
import styled from "styled-components"
import Markdown from "react-markdown"
import { Remarkable } from "remarkable"

import Jumbotron, { JumbotronContent } from "./Jumbotron/Jumbotron"
import Button from "./Button/Button"
import Modal from "./Modal/Modal"
import Form from "./Form/Form"

const MobileImage = styled.img`
  width: 200px;
  @media (min-width: 700px) {
    display: none;
  }
`

const Text = styled.div`
  margin: 20px;
  ${props => props.customCSS}
`

const FeaturesWrapper = styled.div`
  background-color: ${props => props.bgColor || "#fff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 -20px;
  margin-top: 30px;
  padding: 40px 20px;
}

  h3 {
    text-align: center;
    font-weight: 500;
    margin-bottom: 0;
  }

  .description {
    margin-top: 10px;
    text-align: center;
    line-height: initial;
  }
`

const Features = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 30px;

  @media (min-width: 700px) {
    flex-direction: row;
    padding: 0 ${props => 15 / props.numberOfFeatures}%;
    > * {
      width: ${props => `calc( ${100 / props.numberOfFeatures}% - 40px )`};
    }
  }

  @media (min-width: 1200px) {
    padding: 0 ${props => 60 / props.numberOfFeatures}%;
  }
`

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
  text-align: center;

  img {
    height: ${props => props.imageHeight || "100px"};
    margin: 10px;
  }

  h2 {
    margin: 0;
    font-weight: 500;
  }

  p {
    margin-top: 10px;
    line-height: initial;
  }
`

const Counter = styled.div`
  border: 1px solid #999;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Grid = styled.div`
  margin: 0 -20px;
  padding: 20px;
  background-color: ${props => props.bgColor};
  @media (min-width: 700px) {
    display: flex;
    flex-direction: row;
    padding: ${props => props.mdPadding};
    > * {
      width: ${props => `calc( ${100 / props.gridSize}% )`};
    }
  }
  @media (min-width: 1200px) {
    padding: ${props => props.lgPadding};
  }
`

const Section = props => {
  const { type } = props

  if (type === "jumbotron") {
    // =========
    // Jumbotron
    // =========
    return (
      <Jumbotron
        customCSS={props.customCSS}
        backgroundImage={props.desktopImage}
        className="jumbotron"
      >
        <JumbotronContent className="jumbotron-content">
          <Markdown source={props.header} />
          <Button
            href={props.buttonLink}
            buttonColor={props.buttonColor}
            openModal={() => props.setModalState(true)}
          >
            {props.buttonText}
          </Button>
        </JumbotronContent>
      </Jumbotron>
    )
  } else if (type === "features") {
    // ========
    // Features
    // ========
    return (
      <FeaturesWrapper bgColor={props.bgColor}>
        <h3>{props.header}</h3>
        <p className="description">{props.description}</p>
        <Features numberOfFeatures={props.features.length}>
          {props.features.map((feature, i) => (
            <Feature key={i} imageHeight={props.imageHeight}>
              {props.numberedFeatures && <Counter>{String(i + 1)}</Counter>}
              <img src={feature.image} alt="" />
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </Feature>
          ))}
        </Features>

        {props.buttonText && (
          <Button
            variant={"outlined"}
            href={props.buttonLink}
            openModal={() => props.setModalState(true)}
          >
            {props.buttonText}
          </Button>
        )}
      </FeaturesWrapper>
    )
  } else if (type === "grid") {
    // ====
    // GRID
    // ====
    return (
      <Grid
        gridSize={props.gridSize}
        lgPadding={props.lgPadding}
        mdPadding={props.mdPadding}
        bgColor={props.bgColor}
      >
        {props.gridSections.map(section => (
          <Section
            key={Math.random()
              .toString(36)
              .substring(7)}
            {...section}
          />
        ))}
      </Grid>
    )
  } else if (type === "textEditor") {
    // ====
    // TEXT
    // ====
    const md = new Remarkable()
    const createMarkup = markdown => ({
      __html: md.render(markdown),
    })
    return (
      <Text
        customCSS={props.customCSS}
        dangerouslySetInnerHTML={createMarkup(props.textContent)}
      />
    )
  } else if (type === "formModal") {
    // ==========
    // FORM MODAL
    // ==========
    console.log("props.form", props.form)
    return (
      <Modal
        isModalOpened={props.isModalOpened}
        closeModal={() => props.setModalState(false)}
      >
        <div onClick={() => props.setModalState(false)}>Close</div>
        <Form
          form={props.form}
          setFormValue={props.setFormValue}
          header={props.header}
          fields={props.formFields}
        />
      </Modal>
    )
  } else {
    // ================
    // No section found
    // ================
    return <div>Section type not found</div>
  }
}

export default Section
