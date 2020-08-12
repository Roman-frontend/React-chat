import React, {useContext, useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {AuthTextField} from '../components/AuthTextField.js'

export const SignUpPage = () => {

  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()

  const [correctForm, setCorrectForm] = useState({
    name: undefined, email: undefined, password: undefined
  })

  const nameRef = useRef(undefined)
  const emailRef = useRef(undefined);
  const passwordRef = useRef(undefined);

  const PASSWORD_MAX_LENGTH = 50
  const PASSWORD_MIN_LENGTH = 8
  const NAME_MAX_LENGTH = 15
  const NAME_MIN_LENGTH = 3

  useEffect(() => {
    clearError()
  }, [error, clearError])

  function validateName(formDataName) {

    for (let index = 0; index < formDataName.length; index++) {

      if ( !((90 >= formDataName.codePointAt(index) && 
      formDataName.codePointAt(index) >= 65) ||
      (122 >= formDataName.codePointAt(index) && 
      formDataName.codePointAt(index) >= 97)) ) {

        return "Некоректное имя"
      }
    }

    if (formDataName.length < NAME_MIN_LENGTH) {
      return "Слишком короткое имя"

    } else if (formDataName.length > NAME_MAX_LENGTH) {
      return "Слишком длинное имя"

    } else return true
  }

  function validateEmail(formDataEmail) {

    if ( (formDataEmail.indexOf("@") === -1) || 
      (formDataEmail.indexOf(" ") !== -1) ) {
      return "Некоректний емейл"

    } else return true
  }

  function validatePassword(formDataPassword) {

    if (formDataPassword.length < PASSWORD_MIN_LENGTH) {
      return "Слишком короткий пароль"

    } else if (formDataPassword.length > PASSWORD_MAX_LENGTH) {
      return "Слишком длинний пароль"

    } else return true
  }

  function validate(formDataName, formDataEmail, formDataPassword) {

    const resultValidateName = validateName(formDataName)
    const resultValidateEmail = validateEmail(formDataEmail)
    const resultValidatePassword = validatePassword(formDataPassword)
    
    return ({
      name: resultValidateName, 
      email: resultValidateEmail, 
      password: resultValidatePassword
    })
  }

  const handleSubmit = async () => {
    const validatedForms = validate(nameRef.current.value, emailRef.current.value, passwordRef.current.value)
    setCorrectForm({...validatedForms})
    try {
      const formData = {name: nameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value}
      const data = await request('api/auth/register', 'POST', formData)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {}
  }

  return ( 
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Реєстрація</span>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Name</label>
          <input
            placeholder="Введите имя"
            type="text"
            className={correctForm.name === true ? "border-bottom-green" : "none-border-bottom"}
            ref={nameRef}
          />
          <p className={correctForm.name === undefined || correctForm.name === true ? 
            "none-form-error" : "form-error" }>
            {correctForm.name}
          </p>
        </div>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Email</label>
          <input
            placeholder="Введите email"
            type="text"
            name="email"
            className={correctForm.email === true ? "border-bottom-green" : "none-border-bottom"}
            ref={emailRef}
          />
          <p className={correctForm.email === undefined || correctForm.email === true ? 
            "none-form-error" : "form-error"}>
            {correctForm.email}
          </p>
        </div>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Пароль</label>
          <input
            placeholder="Введите пароль"
            type="password"
            name="password"
            className={correctForm.password === true ? "border-bottom-green" : "none-border-bottom"}
            ref={passwordRef}
          />
          <p className={correctForm.password === undefined || correctForm.password === true ? 
            "none-form-error" : "form-error"}>
            {correctForm.password}
          </p>
        </div>

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