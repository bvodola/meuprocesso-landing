import React from "react"
import styled from "styled-components"

const StyledButton = styled.button`
  background-color: ${props =>
    props.variant === "outlined" ? "#fff" : props.buttonColor};
  color: ${props =>
    props.variant === "outlined" ? props.buttonColor : "#fff"};
  border: 1px solid ${props => props.buttonColor};
  border-radius: ${props => (props.variant === "outlined" ? "30px" : "4px")};
  opacity: ${props => (props.disabled ? "0.5" : "1")};
  padding: 15px 20px;
  cursor: pointer;
  box-shadow: none;
`

const Button = props => {
  let href = props.href || ""
  let onClick = null
  if (href.substr(0, 6) === "modal:") {
    href = "#"
    onClick = ev => {
      ev.preventDefault()
      props.openModal()
    }
  }
  return <StyledButton {...props} href={href} onClick={onClick} />
}

Button.defaultProps = {
  href: "",
  buttonColor: "#28a745",
}

export default Button
