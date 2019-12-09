import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Button from "../Button/Button"

const StyledForm = styled.form`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const H1 = styled.h1`
  text-align: center;
`

const Input = styled.input`
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;
`

const FormButton = styled(Button)`
  margin-top: 8px;
  width: 100%;
  text-align: center;
`

const Form = props => {
  const {
    form,
    setFormValue,
    header,
    formFields,
    handleFormSubmit,
    emails_to_send,
    submit_text,
    form_id,
    redirect_after_submit,
  } = props

  const dataToSubmit = {
    ...form,
    to: emails_to_send,
  }

  const handleSubmit = async ev => {
    ev.preventDefault()
    await handleFormSubmit(ev, dataToSubmit)
    if (redirect_after_submit) {
      window.location.href = redirect_after_submit
    }
  }

  return (
    <StyledForm id={form_id} onSubmit={handleSubmit}>
      <H1>{header}</H1>
      {formFields.map(field => (
        <Input
          id={field.id}
          key={field.id}
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          onChange={ev => setFormValue(field.name, ev.target.value)}
          value={form[field.name]}
        />
      ))}
      <FormButton>{submit_text}</FormButton>
    </StyledForm>
  )
}

Form.propTypes = {
  fields: PropTypes.array,
}

Form.defaultProps = {
  fields: [],
}

export default Form
