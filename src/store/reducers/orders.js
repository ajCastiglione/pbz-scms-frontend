import * as actionTypes from '../actions/actionTypes'

const initialState = {
    ordersLines : [],
    loading: false,
    orders: [],
    totalOrders: 0,
}

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.FETCH_ORDERS_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_ORDERS_AND_UPDATE_SUCCESS:
            return{
                ...state,
                ordersLines : action.data,
                loading: false
            }
        case actionTypes.GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.data.orders,
                total: action.data.total,
                loading: false
            }
        default :
            return state;
    }
}

export default reducer;