import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import classes from './Auth.module.scss';

import * as actions from '../../store/actions/index'

import Spinner from '../../components/global/Spinner/Spinner'

const Auth = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()

    const isLoading = useSelector(state => state.auth.loading)
    const error = useSelector(state => state.auth.error)
    const isAuth = useSelector(state => state.auth.token !== null)

    let authRedirect = null;
    if (isAuth) {
        authRedirect = <Redirect to="/" />
    }

    const login = (event) => {
        event.preventDefault();
        const userData = {
            email: userName,
            password: password
        }
        dispatch(actions.authUser(userData))
    }

    return (
        <>
            {authRedirect}
            <form className={classes.Login} onSubmit={login}>
                <h2 className={classes.Login__heading}>Sign in</h2>
                <div className={classes.Login__box}>
                    <div className={classes.Login__box__item}>
                        <label>Username</label>
                        <input type="text" placeholder="Username" value={userName} onChange={(event) => setUserName(event.target.value)} />
                    </div>
                    <div className={classes.Login__box__item}>
                        <label>Password</label>
                        <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                </div>
                {error && <p style={{ color: 'red', textTransform: 'capitalize' }}>{error}</p>}
                <button type="submit">{isLoading ? <Spinner /> : 'Submit'}</button>
            </form>
        </>
    )
}

export default Auth;
