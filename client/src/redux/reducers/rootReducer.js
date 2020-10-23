//Дозволяє комбінувати редюсери
import {combineReducers} from 'redux'
import { reqReducer } from './reqReducer.js'

export const rootReducer = combineReducers({
	//Тут приймаємо набір редюсерів (в кінцевому результаті - чисті функції)
	test: reqReducer
})