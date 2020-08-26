import React from 'react'
import { Field, ErrorMessage } from 'formik'

export function TextFieldSignIn(props) {
  const {label, placeholder, type, id, name, correctForm, inputRef} = props

  return (
    <div className="input-field">
      <label className="auth-text" htmlFor="email">{label}</label>
      <Field name={name}>
        {props => {
          const { field, form, meta } = props
          return (
            <div>
              <input 
                className={!meta.touched ? "without-border-bottom" : 
                  meta.touched && meta.error ? "without-border-bottom" : "border-bottom-green"}
                placeholder={placeholder}
                type={type}
                id={id}
                {...field} 
              />
            </div>
          )
        }}
      </Field>
      <ErrorMessage name={name} render={(msg) => <div className="form-error">{msg}</div>}/>
    </div>
  )
}