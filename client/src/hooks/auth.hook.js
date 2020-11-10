import {useCallback, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {connect} from 'react-redux'
import { AUTH_DATA } from '../redux/types.js'

const storageName = 'userData'

export const useAuth = () => {
  const dispatch = useDispatch()

  /**
  *jwtToken - отримуємо з бекенда,
  *обертаємо в useCallback() - щоб використовувати login в useEffect() як залежність
  */
  const login = useCallback((userData, name, token, userId) => {
    console.log(userData)
    localStorage.setItem(storageName, JSON.stringify({
      userData, name, userId, token
    }))
  }, [])


  const logout = useCallback(() => {
    console.log("logout")
    localStorage.removeItem(storageName)
    dispatch({
      type: AUTH_DATA,
      payload: null
    })
  }, [])

  const changeLocalStorageUserData = useCallback((newData) => {
    console.log("changeLocalStorageUserData")
    const data = JSON.parse(localStorage.getItem(storageName))
    const object = Object.assign({}, {...data}, { ...newData})
    localStorage.setItem(storageName, JSON.stringify({
      ...object
    }))
/*    dispatch({
      type: AUTH_DATA,
      payload: { ...object }
    })*/
  }, [])

  useEffect(() => {
    /** JSON.parse() - приводить результат до обєкта */
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      console.log(data)
      login(data.userData, data.name, data.token, data.userId)
      dispatch({
        type: AUTH_DATA,
        payload: {
          userData: data.userData,
          name: data.name,
          token: data.token,
          userId: data.userId
        }
      })
    }
  }, [login])
  

  return { login, logout, changeLocalStorageUserData }
}


export default connect(null, null)(useAuth)