import React, {useContext, useEffect, useState, useRef, useCallback} from 'react'
import { Formik, Form, ErrorMessage} from 'formik'
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import * as Yup from 'yup'
import {Link} from 'react-router-dom'
import {useHttp} from '../../hooks/http.hook.js'
import {useAuthContext} from '../../context/AuthContext.js'
import {SignInForm} from '../../components/SignInForm/SignInForm.jsx'
import './auth-body.sass'

export const SignInPage = () => {
  const auth = useAuthContext()
  const {loading, request, error, clearError} = useHttp()

  useEffect(() => {
    clearError()
  }, [error, clearError])


  const initialValues = {
    email: '',
    password: ''
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: Yup.string()
      .min(2, 'Too Short!')
      .max(15, 'Too Long')
      .required('Required')
  })

  const onSubmit = async values => {
    try {
      const formData = { email: values.email, password: values.password }
      const data = await request('/api/auth/login', 'POST', formData)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {console.error(e)}
  }

  return (
    <div className="auth-body">
      <Formik 
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="auth-form">
          <span className="auth-form__title">Авторизація</span>

          <SignInForm label="Email" placeholder="Введите email" id="email" name="email" type="email" />
          <SignInForm label="Password" placeholder="Введите password" id="password" name="password" type="password" />

          <button 
            className="auth-form__button-active" 
            type="submit" 
            disabled={loading}
          >
            Ввійти
          </button>

          <Link  to={`/signUp`}>
            <button className="auth-form__button-pasive">Зареєструватись</button>
          </Link>

        </Form>
      </Formik>
    </div>
  )
}