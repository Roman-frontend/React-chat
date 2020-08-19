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
    const regExp = /[a-z]/gi

    for (let index = 0; index < formDataName.length; index++) {
      if ( !formDataName[index].match(regExp) ) return "Некоректное имя"
    }

    if (formDataName.length < NAME_MIN_LENGTH) {
      return "Слишком короткое имя"

    } else if (formDataName.length > NAME_MAX_LENGTH) {
      return "Слишком длинное имя"

    } else return true
  }

  function validateEmail(formDataEmail) {
    return formDataEmail.match(/[@]\S/) ? true : "Некоректний емейл";
  }

  function validatePassword(formDataPassword) {
    if (formDataPassword.length < PASSWORD_MIN_LENGTH) {
      return "Слишком короткий пароль"

    } else if (formDataPassword.length > PASSWORD_MAX_LENGTH) {
      return "Слишком длинний пароль"

    } else return true
  }

  return {validateName, validateEmail, validatePassword}
}