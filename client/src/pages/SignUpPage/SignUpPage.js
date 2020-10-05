import React, {useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../../hooks/http.hook.js'
import {useValidate} from '../../hooks/validate.hook.js'
import {useAuthContext} from '../../context/AuthContext.js'
import {validateName, validateEmail, validatePassword} from '../../components/Helpers/validateMethods.jsx'
import {SignUpForm} from '../../components/SignUpForm/SignUpForm.jsx'

export const SignUpPage = () => {
  const {errors, validate} = useValidate({
    name: validateName,
    email: validateEmail,
    password: validatePassword
  })

  const {login} = useAuthContext()
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

    try {
      const data = await request('api/auth/register', 'POST', formData)
      login(data.userData, data.name, data.token, data.userId)
    } catch (e) {}
  }

  return ( 
    <div className="auth-body">
      <div className="auth-form">
        <span className="auth-form__title">Реєстрація</span>

        <SignUpForm 
          label="Name" 
          placeholder="Введите имя" 
          id="name"
          name="name" 
          fieldError={errors.name} 
          type="name" 
          inputRef={ref.name}
        />
        <SignUpForm 
          label="Email" 
          placeholder="Введите email" 
          id="email"
          name="email" 
          fieldError={errors.email} 
          type="email" 
          inputRef={ref.email}
        />
        <SignUpForm 
          label="Password" 
          placeholder="Введите пароль" 
          id="password"
          name="password" 
          fieldError={errors.password} 
          type="password" 
          inputRef={ref.password} 
        />

        <button 
          className="auth-form__button-active" 
          onClick={handleSubmit} 
          disabled={loading}
        >
          Реєстрація
        </button>

        <Link to={`/signIn`}>
          <button className="auth-form__button-pasive">Вхід</button>
        </Link>
      </div>
    </div>
  )
}