import React, {useContext, useEffect, useState, useRef} from 'react'
import {useFormik} from 'formik'
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import * as Yup from 'yup'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {TextField} from '../components/TextField.js'
import {useValidate} from '../hooks/validate.hook.js'

export const SignInPage = () => {

  const initialValues = {
    email: '',
    password: ''
  }

  const onSubmit = values => {
    console.log('Form data ', values)
  }

  const validate = values => {
    let errors = {}

    if (!values.email) {
      errors.email = 'Required'
    } else if (
      !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
    ) { errors.email = `Invalide email format`}

    if (!values.password) {
      errors.password = 'Required'
    }

    return errors
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: Yup.string().required('Required')
  })

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema
  })

  console.log('form touched ', formik.touched)

  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const {errors, validateEmail, validatePassword} = useValidate()
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [correctForm, setCorrectForm] = useState({
    email: undefined, password: undefined
  })

  useEffect(() => {
    clearError()
  }, [error, clearError])

  const handleSubmit = async () => {
/*    const validatedEmail = validateEmail(emailRef.current.value)
    console.log('errors -', errors.email)
    setCorrectForm({email: errors.email})*/
    try {
      const emailPassword = { email: emailRef.current.value, password: passwordRef.current.value }
      const data = await request('/api/auth/login', 'POST', emailPassword)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {}
  }

  return (
    <div className="auth-body">
      <form className="auth-field" onSubmit={formik.handleSubmit}>
        <span className="card-title">Авторизація</span>

        <TextField 
          label="Email" 
          placeholder="Введите email" 
          id="email"
          name="email" 
          correctForm={correctForm.email} 
          type="email" 
          inputRef={emailRef} 
          onChange={formik.handleChange}
          value={formik.values.email}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? <div className='errors'>{formik.errors.email}</div> : null}

        <TextField 
          label="Password" 
          placeholder="Введите password" 
          id="password"
          name="password" 
          correctForm={correctForm.password} 
          type="password" 
          inputRef={passwordRef} 
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? <div className='errors'>{formik.errors.password}</div> : null}

        <div className="card-action">
          <button
            className="button-active"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            Ввійти
          </button>
          <Link  to={`/signUp`}>
            <button className="button-pasive">Зареєструватись</button>
          </Link>
        </div>
      </form>
    </div>
  )
}