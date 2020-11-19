import React, { useEffect } from 'react'
import { Formik, Form } from 'formik'
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import * as Yup from 'yup'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {postData} from '../../redux/actions/actions.js'
import {POST_LOGIN} from '../../redux/types.js'
import { useAuth } from '../../hooks/auth.hook.js'
import {SignInForm} from '../../components/SignInForm/SignInForm.jsx'
import './auth-body.sass'


export const SignInPage = () => {
  const dispatch = useDispatch()
  const dataLogined = useSelector(state => state.login)
  const { login } = useAuth()
  const initialValues = { email: '', password: '' }

  useEffect(() => {
    console.log(dataLogined)
    if (dataLogined) {
      console.log(dataLogined)
      login(dataLogined.userData, dataLogined.name, dataLogined.token, dataLogined.userId)
    }
  }, [dataLogined])

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
      await dispatch( postData(POST_LOGIN, null, formData) )

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
          >
            Ввійти
          </button>

          <Link  to={`/signUp`}>
            <button className="auth-form__button-pasive">Перейти до реєстрації</button>
          </Link>

        </Form>
      </Formik>
    </div>
  )
}

const mapDispatchToProps = {
  postData 
}

export default connect(null, mapDispatchToProps)(SignInPage)