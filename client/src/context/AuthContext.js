import {createContext, useState} from 'react'

function noop() {}

export const AuthContext = createContext({
  name: null,
  token: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
/*  messages: [],
  setMessages: null,
  usersNames: [],
  setUsersNames: null*/
})
