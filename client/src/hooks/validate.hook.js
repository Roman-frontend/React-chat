import React from 'react'
import {Link} from 'react-router-dom'
import {useServer} from '../hooks/Server'

export const useValidate = () => {
  const PASSWORD_MAX_LENGTH = 50
  const PASSWORD_MIN_LENGTH = 8
  const NAME_MAX_LENGTH = 15
  const NAME_MIN_LENGTH = 3

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

  return {validateName, validateEmail, validatePassword}
}