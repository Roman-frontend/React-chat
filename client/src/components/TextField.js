import React from 'react'

export function TextField(props) {
  const {label, placeholder, correctForm, inputRef} = props

  return (
    <div className="input-field">
      <label className="auth-text" htmlFor="email">{label}</label>
      <input
        placeholder={placeholder}
        type="text"
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