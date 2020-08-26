import React from 'react'

export function TextFieldSignUp(props) {
  const {label, placeholder, type, id, name, fieldError, inputRef} = props

  return (
    <div className="input-field">
      <label className="auth-text" htmlFor="email">{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
        className={fieldError === true ? "border-bottom-green" : "without-border-bottom"}
        ref={inputRef}
      />
      <p className={fieldError === undefined || fieldError === true ? null : "form-error" }>
        {fieldError}
      </p>
    </div>
  )
}