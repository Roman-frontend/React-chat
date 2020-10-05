import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [userData, setUserData] = useState(null)
  const [name, setName] = useState(null)
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)

  /**
  *jwtToken - отримуємо з бекенда,
  *обертаємо в useCallback() - щоб використовувати login в useEffect() як залежність
  */
  const login = useCallback((userData, name, jwtToken, id) => {
    //console.log("userData ", userData, "name ", name, "jwtToken ", jwtToken, "id ", id)
    setUserData(userData)
    setName(name)
    setToken(jwtToken)
    setUserId(id)

    localStorage.setItem(storageName, JSON.stringify({
      userData, name, userId: id, token: jwtToken
    }))
  }, [])


  const logout = useCallback(() => {
    setUserData(null)
    setName(null)
    setToken(null)
    setUserId(null)
    localStorage.removeItem(storageName)
  }, [])

  const changeLocalStorageUserData = useCallback((newData) => {
    const data = JSON.parse(localStorage.getItem(storageName))
    const object = Object.assign({}, {...data}, {userData: newData})
    localStorage.setItem(storageName, JSON.stringify({
      ...object
    }))
  }, [])

  /**
  *При загрузці додатку по замовчуванні буде перевірятись чи в localStorage є дані і якщо вони є то 
  *викличеться login() і змінить states хука useAuth 
  */
  useEffect(() => {
    /** JSON.parse() - приводить результат до обєкта */
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.userData, data.name, data.token, data.userId)
    }
    setReady(true)
  }, [login])
  

  return { login, logout, changeLocalStorageUserData, userData, setUserData, name, token, userId, ready }
}
