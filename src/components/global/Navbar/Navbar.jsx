import React, {useState} from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions/index';

import classes from './Navbar.module.scss'

const Navbar = () => {
    const dispatch = useDispatch();
    const route = useLocation();
    const history = useHistory();
    const pick = route.pathname.search('picking-');

    const [isNavOpen, setIsNavOpen] = useState(false)

    const role = useSelector(state => state.auth.role);
    const username = useSelector(state => state.auth.username)

    const logoutUser = () =>{
        dispatch(actions.logout())
        history.replace('/login')
    }

    let lowerNav = (
        <div className={classes.Nav__lower}>
            <ul className={isNavOpen ? `${classes.Nav__lower__list} ${classes.open}` : classes.Nav__lower__list}>
                <li className={classes.Nav__lower__list__item}  onClick={e => setIsNavOpen(false)}><NavLink to='/' activeClassName={classes.activeRoute} exact>Home</NavLink></li>
                <li className={classes.Nav__lower__list__item}  onClick={e => setIsNavOpen(false)}><NavLink to='/order?page=1' activeClassName={classes.activeRoute}>Orders</NavLink></li>
                <li className={classes.Nav__lower__list__item}  onClick={e => setIsNavOpen(false)}><NavLink to='/inventory?page=1' activeClassName={classes.activeRoute}>Inventory</NavLink></li>
                <li className={classes.Nav__lower__list__item}  onClick={e => setIsNavOpen(false)}><NavLink to='/recipient?page=1' activeClassName={classes.activeRoute}>Recipents</NavLink></li>
                {role === 'superadmin' ? <li className={classes.Nav__lower__list__item}><NavLink to='/members' activeClassName={classes.activeRoute}>Members</NavLink></li> : null}
                {role === 'superadmin' ? <li className={classes.Nav__lower__list__item}><NavLink to='/users?page=1&active=all' activeClassName={classes.activeRoute}>Users</NavLink></li> : null}
                {role === 'superadmin' ? <li className={classes.Nav__lower__list__item}><NavLink to='/test-label' activeClassName={classes.activeRoute}>Test Label</NavLink></li> : null}
            </ul>
            <svg 
            className={classes.Nav__lower__icon} 
            width="27" 
            height="17" 
            viewBox="0 0 27 17" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            onClick={e => setIsNavOpen(!isNavOpen)}>
                <path d="M26 8.33337H1" stroke="black" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M26 1H1" stroke="black" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M26 15.6667H1" stroke="black" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <button onClick={logoutUser}>Logout ({username})</button>
        </div>
    )

    if(route.pathname === '/login' || pick === 1){
        lowerNav = null
    }

    return (
        <React.Fragment>
        {pick !== 1 ? <nav className={classes.Nav}>
            <h1 className={classes.Nav__heading}>PriorityBiz Shipping</h1>
            {lowerNav}
        </nav> : null}
        </React.Fragment>
    )
}

export default Navbar
