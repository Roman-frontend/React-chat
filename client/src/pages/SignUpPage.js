import React, {useContext, useEffect, useState, useRef} from 'react'
import {useFormik} from 'formik'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useValidate} from '../hooks/validate.hook.js'
import {AuthContext} from '../context/AuthContext'
import {TextField} from '../components/TextField.js'

export const SignUpPage = () => {

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: ''
    }
  })

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

  console.log('form values ', formik.values)

  return ( 
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Реєстрація</span>

        <TextField 
          label="Name" 
          placeholder="Введите имя" 
          id="name"
          name="name" 
          correctForm={correctForm.name} 
          type="name" 
          inputRef={nameRef} 
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <TextField 
          label="Email" 
          placeholder="Введите email" 
          id="email"
          name="email" 
          correctForm={correctForm.email} 
          type="email" 
          inputRef={emailRef}
          value={formik.values.email} 
          onChange={formik.handleChange}
        />
        <TextField 
          label="Password" 
          placeholder="Введите пароль" 
          id="password"
          name="password" 
          correctForm={correctForm.password} 
          type="password" 
          inputRef={passwordRef} 
          value={formik.values.password}
          onChange={formik.handleChange}
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