import * as actionTypes from '../actions/actionTypes'

const initialState = {
    discounts: [],
    loading: false,
    error: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_DISCOUNTS_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_DISCOUNTS_SUCCESS:
            return {
                ...state,
                loading: false,
                discounts: action.discounts
            }
        case actionTypes.FETCH_DISCOUNTS_FAILED:
            return {
                ...state,
                loading: false,
                error: 'An error occured, please try again'
            }
        default:
            return state;
    }
}

export default reducer;