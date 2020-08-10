import React, {useContext, useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

export const SignInPage = () => {

  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    clearError()
  }, [error, clearError])

  const loginHandler = async () => {
    try {
      const emailPassword = { email: emailRef.current.value, password: passwordRef.current.value }
      const data = await request('/api/auth/login', 'POST', emailPassword)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {}
  }

  return (
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Авторизація</span>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Email</label>
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
            onClick={loginHandler}
            disabled={loading}
          >
            Ввійти
          </button>
          <Link  to={`/signUp`}>
            <button className="button-pasive">Зареєструватись</button>
          </Link>
        </div>
      </div>
    </div>
  )
}