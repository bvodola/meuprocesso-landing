import React from "React"
import styled from "styled-components"

const StyledButton = styled.a`
  background-color: ${props =>
    props.variant === "outlined" ? "#fff" : props.buttonColor};
  color: ${props =>
    props.variant === "outlined" ? props.buttonColor : "#fff"};
  border: 1px solid ${props => props.buttonColor};
  border-radius: ${props => (props.variant === "outlined" ? "30px" : "4px")};
  padding: 15px 20px;
  cursor: pointer;
  box-shadow: none;
`

const Button = props => {
  let href = props.href
  let onClick = () => {}
  if (href.substr(0, 6) === "modal:") {
    href = "#"
    onClick = props.openModal
  }
  return <StyledButton {...props} href={href} onClick={onClick} />
}

export default Button
