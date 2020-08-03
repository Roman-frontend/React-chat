import React, {useContext, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'

export const SignUpPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    name: '', email: '', password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async () => {
    try {
      const data = await request('api/auth/register', 'POST', {...form})
      message(data.message)
    } catch (e) {}
  }

  return (
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Регистрация</span>

        <div className="input-field">
          <label 
            className="auth-text" 
            htmlFor="email"
            >
            Name
          </label>
          <input
            placeholder="Введите имя"
            id="name"
            type="text"
            name="name"
            className="yellow-input"
            value={form.name}
            onChange={changeHandler}
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
            id="email"
            type="text"
            name="email"
            className="yellow-input"
            value={form.email}
            onChange={changeHandler}
          />
        </div>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Пароль</label>
          <input
            placeholder="Введите пароль"
            id="password"
            type="password"
            name="password"
            className="yellow-input"
            value={form.password}
            onChange={changeHandler}
          />
        </div>

        <div className="card-action">
          <button
            className="button-active"
            onClick={registerHandler}
            disabled={loading}
          >
            Регистрация
          </button>
          <Link 
            to={`/signIn`}
          >
            <button className="button-pasive" >
              Войти
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}