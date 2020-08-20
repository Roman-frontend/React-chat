import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {useServer} from '../hooks/Server'

export const useValidate = () => {
  const [errors, setErrors] = useState({
    name: undefined, email: undefined, password: undefined
  })
  const PASSWORD_MAX_LENGTH = 50
  const PASSWORD_MIN_LENGTH = 8
  const NAME_MAX_LENGTH = 15
  const NAME_MIN_LENGTH = 3

  function validateName(formDataName) {
    const regExp = /[A-Z0-9]/gi

    for (let index = 0; index < formDataName.length; index++) {
      if ( !formDataName[index].match(regExp) ) { 
        return setErrors({name: "Некоректное имя", email: errors.email, password: errors.password})
      }
    }

    if (formDataName.length < NAME_MIN_LENGTH) {
      return setErrors({name: "Слишком короткое имя", email: errors.email, password: errors.password})

    } else if (formDataName.length > NAME_MAX_LENGTH) {
      return setErrors({name: "Слишком длинное имя", email: errors.email, password: errors.password})

    } else return true
  }

  function validateEmail(formDataEmail) {
    const regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return formDataEmail.match(regExp) ? true : setErrors({name: errors.name, email: "Некоректний емейл", password: errors.password});
  }

  function validatePassword(formDataPassword) {
    if (formDataPassword.length < PASSWORD_MIN_LENGTH) {
      return setErrors({name: errors.name, email: errors.email, password: "Слишком короткий пароль"})

    } else if (formDataPassword.length > PASSWORD_MAX_LENGTH) {
      return setErrors({name: errors.name, email: errors.email, password: "Слишком длинний пароль"})

    } else return true
  }

  console.log('errors -', errors.email)

  return {errors, validateName, validateEmail, validatePassword}
}