import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';

import inventoryReducer from './store/reducers/inventory';
import recipientsReducer from './store/reducers/recipients';
import authReducer from './store/reducers/auth';
import usersReducer from './store/reducers/users';
import discountsReducer from './store/reducers/discounts';
import orders from './store/reducers/orders'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  inventory: inventoryReducer,
  recipients: recipientsReducer,
  auth: authReducer,
  users: usersReducer,
  discounts: discountsReducer,
  orders: orders
})

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));




ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
