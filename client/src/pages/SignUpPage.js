import React, {useContext, useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useValidate} from '../hooks/validate.hook.js'
import {AuthContext} from '../context/AuthContext'
import {TextField} from '../components/TextField.js'

export const SignUpPage = () => {

  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const {validateName, validateEmail, validatePassword} = useValidate()
  
  const nameRef = useRef(undefined)
  const emailRef = useRef(undefined);
  const passwordRef = useRef(undefined);
  const [correctForm, setCorrectForm] = useState({
    name: undefined, email: undefined, password: undefined
  })

  useEffect(() => {
    clearError()
  }, [error, clearError])


  const handleSubmit = async () => {
    const formNameRef = nameRef.current.value
    const formEmailRef = emailRef.current.value
    const formPasswordRef = passwordRef.current.value

    setCorrectForm({
      name: validateName(formNameRef), 
      email: validateEmail(formEmailRef), 
      password: validatePassword(formPasswordRef)
    })

    try {
      const formData = {
        name: formNameRef, 
        email: formEmailRef, 
        password: formPasswordRef
      }
      const data = await request('api/auth/register', 'POST', formData)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {}
  }

  return ( 
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Реєстрація</span>

        <TextField 
          label="Name" 
          placeholder="Введите имя" 
          name="name" 
          correctForm={correctForm.name} 
          type="text" 
          inputRef={nameRef} 
        />
        <TextField 
          label="Email" 
          placeholder="Введите email" 
          name="email" 
          correctForm={correctForm.email} 
          type="email" 
          inputRef={emailRef} 
        />
        <TextField 
          label="Password" 
          placeholder="Введите пароль" 
          name="password" 
          correctForm={correctForm.password} 
          type="password" 
          inputRef={passwordRef} 
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