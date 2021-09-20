import * as actionTypes from '../actions/actionTypes';

const initialState = {
    token: null,
    error: null,
    role: null,
    loading: false,
    users: [],
    username: null,
    sudoToken: null,
    sudoUsername: null
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_START:
            return {
                ...state,
                loading: true,
                error: null
            }
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                token: action.token,
                role: action.role,
                username: action.username,
                loading: false
            }
        case actionTypes.AUTH_FAIL:
            return {
                ...state,
                error: action.error,
                loading: false
            }
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                token: null,
                role: null
            }
        case actionTypes.GET_SUDO_SUCCESS:
            return {
                ...state,
                users: action.data
            }
        case actionTypes.CHANGE_SUDO_SUCCESS:
            return {
                ...state,
                sudoToken: action.data.token,
                sudoUsername: action.data.userName
            }
        default :
            return state
    }
}

export default reducer;
