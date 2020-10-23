import React from 'react'
import {render} from 'react-dom'
//applyMiddleware - необхідний щоб коректно прийняти middleware
import {compose, createStore, applyMiddleware} from 'redux'
//thunk дозволяє диспатчити ассинхронні події
import thunk from 'redux-thunk'
//Provider - компонент вищого порядку що не створює власний шаблон і в який ми обертаємо наш проект (додаток), завдяки цьому ми не змінимо шаблон, а додамо в нього певний функціонал
import {Provider} from 'react-redux'
import { rootReducer } from './redux/reducers/rootReducer.js'
import App from './App.js'
import { useHttp } from './hooks/http.hook.js';

const { request } = useHttp()

//createStore() - першим параметром приймає основний редюсер необхідний для роботи
//compose - Потім якщо доведеться додати midleware то compose дозволить їх об'єднати
const store = createStore(rootReducer, compose(
	applyMiddleware(
		//замість thunk можуть бути будь які middleware які захочемо
		thunk, request
	),
	//Перевіряє - якщо в глобальному об'єкті window є ключ - __REDUX_DEVTOOLS_EXTENSION__ - тоді ми з'єднуємо наш store і __REDUX_DEVTOOLS_EXTENSION__ які необхідно встановити
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))

//обертаючи батьківський компонент в Provider - ми підписуємось на store і після цього зможемо діспатчити 
//store - обовʼязковий параметр, і завдяки цьому react-компоненти зможуть дізнатись про redux який ми використовуємо в цьому додатку 
const app = (
	<Provider store={store}>
		<App />
	</Provider>
)

render(app, document.getElementById("root"));