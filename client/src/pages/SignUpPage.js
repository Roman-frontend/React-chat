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
    <AuthTextField 
      correctForm={correctForm} 
      handleSubmit={handleSubmit} 
      nameRef={nameRef} 
      emailRef={emailRef} 
      passwordRef={passwordRef}
    />
  )
}