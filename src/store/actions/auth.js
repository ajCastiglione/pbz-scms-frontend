import axios from 'axios';
import * as actionTypes from './actionTypes';


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (data) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: data.token,
        role: data.role,
        username: data.username
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    }
}

export const logout = () => {
    localStorage.clear();
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const getSudoSuccess = (data) => {
    return {
        type: actionTypes.GET_SUDO_SUCCESS,
        data
    }
}

export const changeSudoSuccess = (data) => {
    return {
        type: actionTypes.CHANGE_SUDO_SUCCESS,
        data
    }
}

export const checkAuthTimeout = (expireTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expireTime)
    }
}


export const authUser = (data) => {
    return dispatch => {
        dispatch(authStart())

        console.log(`API_URL = ${process.env.REACT_APP_API_URL}/auth/login`);
        axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data)
        .then(res => {
            const expirationDate = new Date(new Date().getTime() + res.data.data.token_expiresIn);
            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('role', res.data.data.role);
            localStorage.setItem('username', res.data.data.username);
            dispatch(authSuccess(res.data.data))
            dispatch(checkAuthTimeout(res.data.data.token_expiresIn));
        })
        .catch(err => {
            dispatch(authFail(err.response.data.message))
        })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const auth = {
            token :localStorage.getItem('token'),
            role : localStorage.getItem('role'),
            username : localStorage.getItem('username'),
        }
        if (!auth.token){
            dispatch(logout());
        }else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()){
                dispatch(logout());
            }else {
                const sudoAuth = {
                    token: localStorage.getItem('sudoToken'),
                    userName : localStorage.getItem('sudoUsername')
                }
                if(!sudoAuth.token){
                    dispatch(authSuccess(auth))
                }else{
                    dispatch(authSuccess(auth))
                    dispatch(changeSudoSuccess(sudoAuth))
                }
            }
        }
    }
}

export const getSudo = () => {
    return dispatch => {
        axios.get('/user/sudo')
        .then(res => {
            dispatch(getSudoSuccess(res.data.descount))
        })
        .catch(err => {
            window.alert(err.response.data.message)
        })
    }
}

export const changeSudo = (id) => {
    return dispatch => {
        axios.post('/user/sudo', {id : id})
        .then(res => {
            localStorage.setItem('sudoToken', res.data.data.token);
            localStorage.setItem('sudoUsername', res.data.data.userName);
            dispatch(changeSudoSuccess(res.data.data))
        })
        .catch(err => {
            window.alert(err.response.data.message)
        })
    }
}
