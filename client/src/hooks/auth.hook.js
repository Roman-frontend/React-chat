import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [name, setName] = useState(null)
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)

  /**
  *jwtToken - отримуємо з бекенда,
  *обертаємо в useCallback() - щоб використовувати login в useEffect() як залежність
  */
  const login = useCallback((name, jwtToken, id, names) => {
    setName(name)
    setToken(jwtToken)
    setUserId(id)

    localStorage.setItem(storageName, JSON.stringify({
      name: name, userId: id, token: jwtToken
    }))
  }, [])


  const logout = useCallback(() => {
    setName(null)
    setToken(null)
    setUserId(null)
    localStorage.removeItem(storageName)
  }, [])

  /**
  *При загрузці додатку по замовчуванні буде перевірятись чи в localStorage є дані і якщо вони є то 
  *викличеться login() і змінить states хука useAuth 
  */
  useEffect(() => {
    /** JSON.parse() - приводить результат до обєкта */
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.name, data.token, data.userId)
    }
    setReady(true)
  }, [login])
  

  return { login, logout, name, token, userId, ready }
}
