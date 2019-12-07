import React from "react"
import PropTypes from "prop-types"

const Form = props => {
  const { form, setFormValue, header, fields } = props
  console.log("form", form)
  return (
    <form>
      <h1>{header}</h1>
      {fields.map(field => (
        <div key={field.id}>
          <input
            id={field.id}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            onChange={ev => setFormValue(field.name, ev.target.value)}
            value={form[field.name]}
          />
        </div>
      ))}
    </form>
  )
}

Form.propTypes = {
  fields: PropTypes.array,
}

Form.defaultProps = {
  fields: [],
}

export default Form
