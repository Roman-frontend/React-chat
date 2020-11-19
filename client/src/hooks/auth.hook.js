import {useCallback, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {connect} from 'react-redux'
import { LOGIN_DATA, LOGOUT_DATA } from '../redux/types.js'

const storageName = 'userData'

export const useAuth = () => {
  const dispatch = useDispatch()

  /**
  *jwtToken - отримуємо з бекенда,
  *обертаємо в useCallback() - щоб використовувати login в useEffect() як залежність
  */
  const login = useCallback((userData, token) => {
    console.log(userData)
    localStorage.setItem(storageName, JSON.stringify({
      userData, token
    }))
  }, [])


  const logout = useCallback(() => {
    console.log("logout")
    localStorage.removeItem(storageName)
    dispatch({
      type: LOGOUT_DATA,
      payload: null
    })
  }, [])

  const changeLocalStorageUserData = useCallback((newData) => {
    //console.log("changeLocalStorageUserData")
    const data = JSON.parse(localStorage.getItem(storageName))
    const object = Object.assign({}, {...data}, { ...newData})
    localStorage.setItem(storageName, JSON.stringify({
      ...object
    }))
/*    dispatch({
      type: LOGIN_DATA,
      payload: { ...object }
    })*/
  }, [])

  useEffect(() => {
    /** JSON.parse() - приводить результат до обєкта */
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      //console.log(data)
      login(data.userData, data.token)
      dispatch({
        type: LOGIN_DATA,
        payload: {
          userData: data.userData,
          token: data.token,
        }
      })
    }
  }, [login])
  

  return { login, logout, changeLocalStorageUserData }
}


export default connect(null, null)(useAuth)