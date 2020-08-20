import React, {useContext, useEffect, useState, useRef} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import * as Yup from 'yup'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {TextField} from '../components/TextField.js'

export const SignInPage = () => {
  const auth = useContext(AuthContext)
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
    password: Yup.string().required('Required')
  })

  const onSubmit = async values => {
    try {
      const formData = { email: values.email, password: values.password }
      const data = await request('/api/auth/login', 'POST', formData)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {console.error(e)}
  }

  return (
    <Formik 
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <div className="auth-body">
        <Form className="auth-field">
          <span className="card-title">Авторизація</span>

          <TextField label="Email" placeholder="Введите email" id="email" name="email" type="email" />
          <ErrorMessage name='email' />

          <TextField label="Password" placeholder="Введите password" id="password" name="password" type="password" />
          <ErrorMessage name='password' />

          <div className="card-action">
            <button className="button-active" type="submit" disabled={loading}>Ввійти</button>
            <Link  to={`/signUp`}>
              <button className="button-pasive">Зареєструватись</button>
            </Link>
          </div>
        </Form>
      </div>
    </Formik>
  )
}