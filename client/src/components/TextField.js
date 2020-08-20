import React from 'react'
import { Field } from 'formik'

export function TextField(props) {
  const {label, placeholder, type, id, name, correctForm, inputRef, value, onChange, onBlur} = props

  return (
    <div className="input-field">
      <label className="auth-text" htmlFor="email">{label}</label>
      <Field
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
        className={correctForm === true ? "border-bottom-green" : "none-border-bottom"}
        ref={inputRef}
      />
      <p className={correctForm === undefined || correctForm === true ? 
        "none-form-error" : "form-error" }>
        {correctForm}
      </p>
    </div>
  )
}