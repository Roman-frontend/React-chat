import React, {useContext, useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'

export const AuthTextField = (props) => {
  const {correctForm, handleSubmit, nameRef, emailRef, passwordRef} = props
  const {loading} = useHttp()

  return (
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Реєстрація</span>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Name</label>
          <input
            placeholder="Введите имя"
            type="text"
            className={correctForm.name === true ? "border-bottom-green" : "none-border-bottom"}
            ref={nameRef}
          />
          <p className={correctForm.name === undefined || correctForm.name === true ? 
            "none-form-error" : "form-error" }>
            {correctForm.name}
          </p>
        </div>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Email</label>
          <input
            placeholder="Введите email"
            type="text"
            name="email"
            className={correctForm.email === true ? "border-bottom-green" : "none-border-bottom"}
            ref={emailRef}
          />
          <p className={correctForm.email === undefined || correctForm.email === true ? 
            "none-form-error" : "form-error"}>
            {correctForm.email}
          </p>
        </div>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Пароль</label>
          <input
            placeholder="Введите пароль"
            type="password"
            name="password"
            className={correctForm.password === true ? "border-bottom-green" : "none-border-bottom"}
            ref={passwordRef}
          />
          <p className={correctForm.password === undefined || correctForm.password === true ? 
            "none-form-error" : "form-error"}>
            {correctForm.password}
          </p>
        </div>

        <div className="card-action">
          <button className="button-active" onClick={handleSubmit} disabled={loading}>
            Реєстрація
          </button>
          <Link to={`/signIn`}>
            <button className="button-pasive">Вхід</button>
          </Link>
        </div>
      </div>
    </div>
  )
}