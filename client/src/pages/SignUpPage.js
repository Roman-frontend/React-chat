import React, {useContext, useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

export const SignUpPage = () => {
  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  const nameRef = useRef(undefined)
  const emailRef = useRef(undefined);
  const passwordRef = useRef(undefined);
  const PASSWORD_MAX_LENGTH = 50
  const PASSWORD_MIN_LENGTH = 8
  const NAME_MAX_LENGTH = 15
  const NAME_MIN_LENGTH = 3
  const errors = {}
  const [fullForm, setFullForm] = useState({
    nameForm: undefined, emailForm: undefined, passwordForm: undefined
  })
  errors.password = "aaa"
  console.log(errors.password)

  let formBorderBottom = {}
  formBorderBottom.name = fullForm.nameForm === undefined ? "border-bottom-white" : fullForm.nameForm ? "border-bottom-green" : "border-bottom-red";
  formBorderBottom.email = fullForm.emailForm === undefined ? "border-bottom-white" : fullForm.emailForm ? "border-bottom-green" : "border-bottom-red";
  formBorderBottom.password = fullForm.passwordForm === undefined ? "border-bottom-white" : fullForm.passwordForm ? "border-bottom-green" : "border-bottom-red";

  useEffect(() => {
    clearError()
  }, [error, clearError])

  function validateName(formDataName) {

    for (let index = 0; index < formDataName.length; index++) {

      if ( !((90 >= formDataName.codePointAt(index) && 
      formDataName.codePointAt(index) >= 65) ||

      (122 >= formDataName.codePointAt(index) && 
      formDataName.codePointAt(index) >= 97)) ) {

        errors.name = "Имя имеет некоректние символи"
        return false
      }
    }

    if (formDataName.length < NAME_MIN_LENGTH) {
      errors.name = "Слишком короткое имя"
      return false

    } else if (formDataName.length > NAME_MAX_LENGTH) {
      errors.name = "Слишком длинное имя"
      return false

    } else return true
  }

  function validateEmail(formDataEmail) {
    if ( (formDataEmail.indexOf("@") === -1) || 
      (formDataEmail.indexOf(" ") !== -1) ) {
      console.log(formDataEmail.indexOf("@"), formDataEmail.indexOf(" "))
      errors.email = "Некорректний формат email"
      return false
    } else return true
  }

  function validatePassword(formDataPassword) {
    if (formDataPassword.length < PASSWORD_MIN_LENGTH) {
      errors.password = "Слишком короткий пароль"
      console.log(errors.password)
      return false
    } else if (formDataPassword.length > PASSWORD_MAX_LENGTH) {
      errors.password = "Слишком длинний пароль"
      console.log(errors.password)
      return false
    } else return true
  }

  function validate() {
    const resultValidateName = validateName(nameRef.current.value)
    const resultValidateEmail = validateEmail(emailRef.current.value)
    const resultValidatePassword = validatePassword(passwordRef.current.value)
    setFullForm({nameForm: resultValidateName, emailForm: resultValidateEmail, passwordForm: resultValidatePassword})
    console.log('resultValidate -', fullForm)
  }

  const registerHandler = async () => {
    validate()
/*    try {
      const formData = {name: nameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value}
      const data = await request('api/auth/register', 'POST', formData)
      auth.login(data.name, data.token, data.userId)
    } catch (e) {}*/
  }

  console.log('aaa -', errors.password)

  return (
    <div className="auth-body">
      <div className="auth-field">
        <span className="card-title">Реєстрація</span>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Name</label>
          <input
            placeholder="Введите имя"
            type="text"
            className={formBorderBottom.name}
            ref={nameRef}
          />
        </div>

        <div className="input-field">
          <label 
            className="auth-text" 
            htmlFor="email"
          >
            Email
          </label>
          <input
            placeholder="Введите email"
            type="text"
            name="email"
            className={formBorderBottom.email}
            ref={emailRef}
          />
        </div>

        <div className="input-field">
          <label className="auth-text" htmlFor="email">Пароль</label>
          <input
            placeholder="Введите пароль"
            type="password"
            name="password"
            className={formBorderBottom.password}
            ref={passwordRef}
          />
          <p className={errors.password ? "none-form-error" : "form-error"}>{errors.password}</p>
        </div>

        <div className="card-action">
          <button
            className="button-active"
            onClick={registerHandler}
            disabled={loading}
          >
            Реєстрація
          </button>
          <Link to={`/signIn`}>
            <button className="button-pasive" >
              Вхід
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}