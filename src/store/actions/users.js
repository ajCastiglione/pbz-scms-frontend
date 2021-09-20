import * as actionTypes from './actionTypes';
import axios from 'axios';

export const requestStart = () => {
    return {
        type: actionTypes.FETCH_USERS_START
    }
}

export const fetchUsersSuccess = (users, total) => {
    return {
        type: actionTypes.FETCH_USERS_SUCCESS,
        users,
        total
    }
}

export const fetchUsersFailed = () => {
    return {
        type: actionTypes.FETCH_USERS_FAILED
    }
}

export const addUserSuccess = (message) => {
    return {
        type: actionTypes.ADD_USER_SUCCESS,
        message
    }
}

export const addUserFailed = (error) => {
    return {
        type: actionTypes.ADD_USER_FAILED,
        error
    }
}

export const getUsers = (active, page) => {
    return dispatch => {
        dispatch(requestStart())
        axios.get(`/user/add-update?page=${page}&active=${active}`)
        .then(res => {
            dispatch(fetchUsersSuccess(res.data.users, res.data.total))
        })
        .catch(err => {
            window.alert(err.response.data.message);
        })
    }
}

export const addUser = (user) => {
    return dispatch => {
        dispatch(requestStart());
        axios.post('/user/add-update', user)
        .then(res => {
            dispatch(addUserSuccess(res.data.message))
        })
        .catch(err => {
            window.alert(err.response.data.message);
            dispatch(addUserFailed(err.response.data.message))
        })
    }
}