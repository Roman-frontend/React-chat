import React, {useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {postData} from '../../redux/actions/actions.js'
import {POST_REGISTER} from '../../redux/types.js'
import {useValidate} from '../../hooks/validate.hook.js'
import {useAuth} from '../../hooks/auth.hook.js'
import {validateName, validateEmail, validatePassword} from '../../components/Helpers/validateMethods.jsx'
import {SignUpForm} from '../../components/SignUpForm/SignUpForm.jsx'

export const SignUpPage = () => {
  const dispatch = useDispatch()
  const dataRegistered = useSelector(state => state.registered)
  const { login } = useAuth()
  const {errors, validate} = useValidate({
    name: validateName,
    email: validateEmail,
    password: validatePassword
  })
  
  const ref = {
    name: useRef(undefined),
    email: useRef(undefined),
    password: useRef(undefined)
  }

  useEffect(() => {
    if(dataRegistered) {
      login(dataRegistered.userData, dataRegistered.name, dataRegistered.token, dataRegistered.userId)
    }
  }, [dataRegistered])


  const handleSubmit = async () => {
    const formData = {
      name: ref.name.current.value, 
      email: ref.email.current.value,
      password: ref.password.current.value
    }

    validate(formData)

    try {
      await dispatch(postData(POST_REGISTER, null, formData))
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

const mapDispatchToProps = {
  postData 
}

export default connect(null, mapDispatchToProps)(SignUpPage)