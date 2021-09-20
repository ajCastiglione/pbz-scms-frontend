import * as actionTypes from '../actions/actionTypes'

const initialState = {
    inventory: [],
    total: 0,
    loading: false,
    message: '',
    error: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_INVENTORY_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_INVENTORY_SUCCESS:
            return {
                ...state,
                inventory: action.inventory.data,
                total: action.inventory.total,
                loading: false
            }
        case actionTypes.CREATE_INVENTORY_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.CREATE_INVENTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                message: 'Inventory Created Successfully',
                error: ''
            }
        case actionTypes.CREATE_INVENTORY_FAILED:
            return {
                ...state,
                loading: false,
                error: 'An error occured please refresh and try again',
                message: ''
            }

        default:
            return state;

    }
}

export default reducer;
