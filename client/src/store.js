import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import profileReducer from './reducers/profileReducer'


const init = {}

const reducer = combineReducers({ profileReducer })

const middleware = [thunk]

const store = createStore(reducer, init, applyMiddleware(...middleware))

export default store