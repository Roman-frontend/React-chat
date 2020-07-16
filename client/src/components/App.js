import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from '../routes.js'
import {useAuth} from '../hooks/auth.hook.js'
import {AuthContext} from '../context/AuthContext.js'
//import 'materialize-css'

export default function App() {
  const {login, logout, token, userId} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)
  return (
  	<AuthContext.Provider value={{
  	  login, logout, token, userId, isAuthenticated
  	}}>
  	  <Router>
        <div>
	        {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

