import React, {useState, useReducer, useCallback, useMemo} from 'react'
import {Link} from 'react-router-dom'
import {useServer} from '../hooks/Server'

export const useValidate = (validateObject) => {
  const PASSWORD_MAX_LENGTH = 50
  const PASSWORD_MIN_LENGTH = 8
  const NAME_MAX_LENGTH = 15
  const NAME_MIN_LENGTH = 3

  const [errors, setErrors] = useState({
    name: undefined, email: undefined, password: undefined
  })
  
  const [formValue, setFormValue] = useState({
    name: '', email: '', password: ''
  })

  const reducer = (state, action) => { 
    switch(action.type) { 
    case 'name': return validateName(action.text)
    case 'email': return validateEmail(action.text)
    case 'password': return validatePassword(action.text)
    default: return state 
    }
  }

  const [state, dispatch] = useReducer(reducer, {text: " "})

  const name = useMemo(() =>  { 
    dispatch({ type: 'name', text: formValue.name })
  }, [formValue.name])

  const email = useMemo(() =>  { 
    dispatch({ type: 'email', text: formValue.email })
  }, [formValue.email])

  const password = useMemo(() =>  { 
    dispatch({ type: 'password', text: formValue.password })
  }, [formValue.password])

  const validate = (formValue) => {
    setFormValue({...formValue})
  }

  function validateName(formName) {
    const regExp = /[A-Z0-9]/gi

    for (let index = 0; index < formName.length; index++) {
      if ( !formName[index].match(regExp) ) { 
        return setErrors({name: "Некоректное имя"})
      }
    }

    if (!formName) {
      return null

    } else if (formName.length < NAME_MIN_LENGTH) {
      return setErrors({name: "Слишком короткое имя"})

    } else if (formName.length > NAME_MAX_LENGTH) {
      return setErrors({name: "Слишком длинное имя"})

    } else return setErrors({name: true})
  }

  function validateEmail(formEmail) {
    const regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

    if (!formEmail) {
      return null

    } else if (formEmail.match(regExp)) {
      return setErrors({email: true})

    } else if (!formEmail.match(regExp)) {
      return setErrors({email: "Некоректний емейл"})

    }
  }

  function validatePassword(formPassword) {

    if (!formPassword) {
      return null

    } else if (formPassword.length < PASSWORD_MIN_LENGTH) {
      return setErrors({password: "Слишком короткий пароль"})

    } else if (formPassword.length > PASSWORD_MAX_LENGTH) {
      return setErrors({password: "Слишком длинний пароль"})

    } else return setErrors({password: true})
  }

  return {errors, validate}
}