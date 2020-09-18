import React from 'react'
import { Field, ErrorMessage } from 'formik'
import './auth-form.sass'

export function SignInForm(props) {
  const {label, placeholder, type, id, name} = props

  return (
    <div>
      <label className="auth-form__form" htmlFor="email">{label}</label>
      <Field name={name}>
        {props => {
          const { field, meta } = props
          return (
            <>
              <input 
                className={!meta.touched ? "auth-form__input-border-bottom" : 
                  meta.touched && meta.error ? "auth-form__input-border-bottom" : "auth-form__input-border-bottom-green"}
                placeholder={placeholder}
                type={type}
                id={id}
                {...field} 
              />
            </>
          )
        }}
      </Field>
      <ErrorMessage name={name} render={(msg) => <div className="auth-form__error">{msg}</div>}/>
    </div>
  )
}