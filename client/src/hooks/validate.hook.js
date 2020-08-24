import {useState, useReducer, useCallback, useMemo} from 'react'

const PASSWORD_MAX_LENGTH = 50
const PASSWORD_MIN_LENGTH = 8
const NAME_MAX_LENGTH = 15
const NAME_MIN_LENGTH = 3

export const useMethodsValidations = () => {

  const validateName = useCallback(formName => {
    const name = formName.name
    console.log(name)
    const regExp = /[A-Z0-9]/gi

    if (name.length < NAME_MIN_LENGTH) return {name: "Слишком короткое имя"}

    for (let index = 0; index < name.length; index++) {
      if ( !name[index].match(regExp) ) return {name: "Некоректное имя"}
    }

    if (name.length > NAME_MAX_LENGTH) return {name: "Слишком длинное имя"}

    return {name: true}

  }, [])

  const validateEmail = useCallback( formEmail => {
    const email = formEmail.email
    const regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

    if (email.match(regExp)) return {email: true}
      
    if (!email.match(regExp)) return {email: "Некоректний емейл"}

  }, [])

  const validatePassword = useCallback( formPassword => {
    const password = formPassword.password

    if (password.length < PASSWORD_MIN_LENGTH) {
      return {'password': "Слишком короткий пароль"}

    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {'password': "Слишком длинний пароль"}

    } else return {password: true}

  }, [])

  return {validateName, validateEmail, validatePassword}
}

export const useValidate = (validateObject) => {
  const [errors, setErrors] = useState({
    name: undefined, email: undefined, password: undefined
  })

  const validate = useCallback( formValue => {
    let a = {}

    for (let key in validateObject) {
      const validatedForm = validateObject[key](formValue)
      a = Object.assign(a, validatedForm)
    }

    setErrors({...a})

  }, [validateObject])

  return {errors, validate}
}