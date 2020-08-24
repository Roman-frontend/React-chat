import React, {useContext, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMethodsValidations, useValidate} from '../hooks/validate.hook.js'
import {AuthContext} from '../context/AuthContext'
import {TextFieldSignUp} from '../components/TextFieldSignUp.js'

export const SignUpPage = () => {
  const {validateName, validateEmail, validatePassword} = useMethodsValidations()
  const {errors, validate} = useValidate({
    name: validateName,
    email: validateEmail,
    password: validatePassword
  })

  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  
  const ref = {
    name: useRef(undefined),
    email: useRef(undefined),
    password: useRef(undefined)
  }

  useEffect(() => {
    clearError()
  }, [error, clearError])


  const handleSubmit = async () => {
    const formData = {
      name: ref.name.current.value, 
      email: ref.email.current.value,
      password: ref.password.current.value
    }

    validate(formData)
    console.log(errors)

    try {
      const data = await request('api/auth/register', 'POST', formData)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {}
  }

  return ( 
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Реєстрація</span>

        <TextFieldSignUp 
          label="Name" 
          placeholder="Введите имя" 
          id="name"
          name="name" 
          correctForm={errors.name} 
          type="name" 
          inputRef={ref.name}
        />
        <TextFieldSignUp 
          label="Email" 
          placeholder="Введите email" 
          id="email"
          name="email" 
          correctForm={errors.email} 
          type="email" 
          inputRef={ref.email}
        />
        <TextFieldSignUp 
          label="Password" 
          placeholder="Введите пароль" 
          id="password"
          name="password" 
          correctForm={errors.password} 
          type="password" 
          inputRef={ref.password} 
        />

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