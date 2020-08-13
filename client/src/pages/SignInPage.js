import React, {useContext, useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {TextField} from '../components/TextField.js'
import {useValidate} from '../hooks/validate.hook.js'

export const SignInPage = () => {

  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const {validateEmail, validatePassword} = useValidate()
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [correctForm, setCorrectForm] = useState({
    email: undefined, password: undefined
  })

  useEffect(() => {
    clearError()
  }, [error, clearError])

  const handleSubmit = async () => {
    const validatedEmail = validateEmail(emailRef.current.value)
    const validatedPassword = validatePassword(passwordRef.current.value)
    setCorrectForm({email: validatedEmail, password: validatedPassword})
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

        <TextField label="Email" placeholder="Введите email" correctForm={correctForm.email} type="email" inputRef={emailRef} />
        <TextField label="Password" placeholder="Введите password" correctForm={correctForm.password} type="password" inputRef={passwordRef} />

        <div className="card-action">
          <button
            className="button-active"
            onClick={handleSubmit}
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