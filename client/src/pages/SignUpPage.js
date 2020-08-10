import React, {useContext, useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

export const SignUpPage = () => {
  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const nameRef = useRef(null)
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    clearError()
  }, [error, clearError])

  const registerHandler = async () => {
    if (
      nameRef.current.value.length < 4 &&
      passwordRef.current.value.length < 9 &&
      emailRef.current.value.indexOf("@") &&
      emailRef.current.value.indexOf(" ")
      ) return alert("Некоректрні дані при реєстрації")
    try {
      const dataInputs = {name: nameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value}
      const data = await request('api/auth/register', 'POST', dataInputs)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {}
  }

  return (
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Реєстрація</span>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Name</label>
          <input
            placeholder="Введите имя"
            type="text"
            className="yellow-input"
            ref={nameRef}
          />
        </div>

        <div className="input-field">
          <label 
            className="auth-text" 
            htmlFor="email"
          >
            Email
          </label>
          <input
            placeholder="Введите email"
            type="text"
            name="email"
            className="yellow-input"
            ref={emailRef}
          />
        </div>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Пароль</label>
          <input
            placeholder="Введите пароль"
            type="password"
            name="password"
            className="yellow-input"
            ref={passwordRef}
          />
        </div>

        <div className="card-action">
          <button
            className="button-active"
            onClick={registerHandler}
            disabled={loading}
          >
            Реєстрація
          </button>
          <Link to={`/signIn`}>
            <button className="button-pasive" >
              Вхід
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}