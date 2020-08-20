import React from 'react'

export function TextField(props) {
  const {label, placeholder, type, id, name, correctForm, inputRef, value, onChange, onBlur} = props

  return (
    <div className="input-field">
      <label className="auth-text" htmlFor="email">{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
        className={correctForm === true ? "border-bottom-green" : "none-border-bottom"}
        ref={inputRef}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <p className={correctForm === undefined || correctForm === true ? 
        "none-form-error" : "form-error" }>
        {correctForm}
      </p>
    </div>
  )
}