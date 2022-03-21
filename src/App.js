import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';


import Navbar from './components/global/Navbar/Navbar';
import Auth from './pages/Auth/Auth';
import Home from './pages/home/home';
import Orders from './pages/Orders/Orders'
import Inventory from './pages/Inventory/Inventory';
import Recipents from './pages/Recipents/Recipents';
import Users from './pages/Users/Users'
import Discounts from './pages/Discounts/Discounts';
import AddOrder from './pages/Orders/AddOrder/AddOrder';
import ShipMethod from './pages/Orders/ShipMethod/ShipMethod';
import ShipOrder from './pages/Orders/ShipOrder/ShipOrder';
import PackingSlip from './pages/Orders/PackingSlip/PackingSlip';
import PickingTicket from './pages/Orders/PickingTicket/PickingTicket'
import Sudo from './components/global/Sudo/Sudo';
import SudoPage from './pages/Sudo/Sudo';
import TestLabel from './pages/TestLabel/TestLabel';
import Members from './pages/Members/Members';

import * as actions from './store/actions/index'

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.auth.token !== null);
  const role = useSelector(state => state.auth.role)
  const token = useSelector(state => state.auth.token);
  const sudoToken = useSelector(state => state.auth.sudoToken);

  useEffect(() => {
    dispatch(actions.authCheckState())
  }, [dispatch])


  axios.defaults.baseURL = process.env.REACT_APP_API_URL;

  axios.defaults.headers.common['Authorization'] = `auth ${token}`;
  if (sudoToken){
    axios.defaults.headers.common['Sudo'] = `auth ${sudoToken}`;
  }

  let routes = (
    <Switch>
      <Route path="/login" component={Auth}></Route>
      {(() => {
            if (!localStorage.getItem('token') || new Date(localStorage.getItem('expirationDate')) <= new Date())
                return <Redirect to="/login" />
            else
                return null
        })()}
    </Switch>
  )
  if (isAuth) {
    if(role === 'superadmin'){
      routes = (
        <Switch>
          <Route path="/order" component={Orders}></Route>
          <Route path="/inventory" component={Inventory}></Route>
          <Route path="/recipient" component={Recipents}></Route>
          <Route path="/users" component={Users}></Route>
          <Route path="/discounts/:id" component={Discounts}></Route>
          <Route path="/add-order/" component={AddOrder}></Route>
          <Route path="/ship-method/" component={ShipMethod}></Route>
          <Route path="/ship-order/" component={ShipOrder}></Route>
          <Route path="/picking-slip/:id" component={PackingSlip}></Route>
          <Route path="/picking-ticket/:id" component={PickingTicket}></Route>
          <Route path="/sudo/" component={SudoPage}></Route>
          <Route path="/test-label/" component={TestLabel}></Route>
          <Route path="/members/" component={Members}></Route>
          <Route path="/" component={Home} exact></Route>
          <Redirect to="/" />
        </Switch>
      )
    }else {
      routes = (
        <Switch>
          <Route path="/order" component={Orders}></Route>
          <Route path="/inventory" component={Inventory}></Route>
          <Route path="/recipient" component={Recipents}></Route>
          <Route path="/add-order/" component={AddOrder}></Route>
          <Route path="/ship-method/" component={ShipMethod}></Route>
          <Route path="/ship-order/" component={ShipOrder}></Route>
          <Route path="/picking-slip/:id" component={PackingSlip}></Route>
          <Route path="/picking-ticket/:id" component={PickingTicket}></Route>
          <Route path="/" component={Home} exact></Route>
          <Redirect to="/" />
        </Switch>
      )
    }
  }

  return (
      <Router>
        <Navbar />
        {isAuth && (role === 'superadmin' || role === 'warehouse') ? <Sudo /> : null}
          {routes}
      </Router>
  );
}

export default App;