import { useState, useCallback } from 'react'
import {connect} from 'react-redux'
import {getUsers} from '../redux/actions/actions.js'

export const useHttp = () => {
  const[loading, setLoading] = useState(false)
  const[error, setError] = useState(null)

  const request = useCallback( async ( param, token, method="GET", body=null ) => {
  	setLoading(true)
    try {
      const headers = {}

      headers['authorization'] = token

      if ( body ) {
        /**передаємо body на сервер як строку а не обєкт */
        body = JSON.stringify(body)
        /**Щоб на сервері пирйняти json */
        headers['Content-Type'] = 'application/json'
      }

      console.log("http request", param, headers, method, body)

      const response = await getUsers(param, method, body, headers)
      console.log(response)
      const data = response//.json()

      /*if (!response.ok) {
      	throw new Error(data.message || 'Щось пішло не так ')
      }*/

      setLoading(false)

      console.log("http data ", data)
      return data

    } catch (e) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError }
}

const mapDispatchToProps = {
  getUsers
}

const mapStateToProps = state => ({
  users: state.req.users
})

export default connect(mapStateToProps, mapDispatchToProps)(useHttp)