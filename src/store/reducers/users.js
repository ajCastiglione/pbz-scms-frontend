import * as actionTypes from '../actions/actionTypes';

const initialState = {
    users: [],
    total: 0,
    loading: false,
    message: '',
    error: '',
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USERS_START :
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_USERS_SUCCESS :
            return {
                ...state,
                users: action.users,
                total: action.total,
                loading: false
            }
        case actionTypes.ADD_USER_SUCCESS :
            return {
                ...state,
                message: action.message,
                error: '',
                loading: false
            }
        case actionTypes.ADD_USER_FAILED :
            return {
                ...state,
                error: action.error,
                message: '',
                loading: false
            }
        default:
            return state
    }
}

export default reducer;