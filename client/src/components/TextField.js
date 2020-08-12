import React from 'react'
import {Link} from 'react-router-dom'
import {useServer} from '../hooks/Server'

export function TextField(props) {
  const {labelText, placeholder, correctForm} = props

  return (
    <div className="input-field">
      <label className="auth-text" htmlFor="email">{labelText}</label>
      <input
        placeholder={placeholder}
        type="text"
        className={correctForm.name === true ? "border-bottom-green" : "none-border-bottom"}
        ref={nameRef}
      />
      <p className={correctForm.name === undefined || correctForm.name === true ? 
        "none-form-error" : "form-error" }>
        {correctForm.name}
      </p>
    </div>
  )
}