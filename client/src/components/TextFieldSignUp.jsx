import React from 'react'

export function TextFieldSignUp(props) {
  const {label, placeholder, type, id, name, fieldError, inputRef} = props

  return (
    <div>
      <label className="auth-form__form" htmlFor="email">{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
        className={fieldError === true ? "auth-form__input-border-bottom-green " : "auth-form__input-border-bottom"}
        ref={inputRef}
      />
      <p className={fieldError === undefined || fieldError === true ? null : "auth-form__error" }>
        {fieldError}
      </p>
    </div>
  )
}