import { useState, useCallback } from 'react'

export const useHttp = () => {
  const[loading, setLoading] = useState(false)
  const[error, setError] = useState(null)

  const request = useCallback( async ( url, token, method="GET", body=null ) => {
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

      console.log("http request", url, headers, method, body)

      const response = await fetch(url, {method, body, headers})
      const data = await response.json()

      if (!response.ok) {
      	throw new Error(data.message || 'Щось пішло не так ')
      }

      setLoading(false)

      console.log("http data ", data)
      return data

    } catch (e) {
      setLoading(false)
      setError(e.message)
      if ( url.match(/\/api\/chat\/post-message/gi) ) return "403"
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError }
}