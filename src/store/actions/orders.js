import * as actionTypes from './actionTypes';
import axios from 'axios'

export const getOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    }
}

export const getOrderAndUpdateSuccess = (data) => {
    return {
        type: actionTypes.FETCH_ORDERS_AND_UPDATE_SUCCESS,
        data
    }
}

export const getOrdersSuccess = (data) => {
    return {
        type: actionTypes.GET_ORDERS_SUCCESS,
        data
    }
}

export const getOrders = (page, filters) => {
    return dispatch => {
        dispatch(getOrdersStart())
        let url = (`/order?page=${page}`)
        if (filters) {
            if (filters.recipient || filters.transaction || filters.tracking){
                url = (`/order?page=${page}&recipent=${filters.recipient}&customerTransaction=${filters.transaction}&traking=${filters.tracking}`)
            }else if (filters.startDate || filters.endDate){
                url = (`/order?page=${page}&dataRangeStart=${filters.startDate}&dataRangeEnd=${filters.endDate}`)
            }
        }
        axios.get(url)
        .then(res => {
            dispatch(getOrdersSuccess(res.data))
        })
        .catch(err => {
            window.alert(err.response.data.message);
        })
    }
}

export const getOrderAndUpdate = (id) => {
    return dispatch => {
        dispatch(getOrdersStart())
        axios.get(`/order/add-update/${id}`)
        .then(res => {
            dispatch(getOrderAndUpdateSuccess(res.data.items_in_order))
            console.log(res)
        }).catch(err => {
            window.alert(err.response.data.message);
        })
    }   
}

export const addInventory = (data) => {
    return dispatch => {
        
        axios.post('/order/add-update/add-inventory', data)
        .then(res => {
            dispatch(getOrderAndUpdate(data.orderId))
        })
        .catch(err => {
            window.alert(err.response.data.message)
        })
    }
}

export const removeOrder = (id, orderId) => {
    return dispatch => {
        axios.post('/order/add-update/remove-inventory', {
            lineItemId: id
        })
        .then(res => {
            dispatch(getOrderAndUpdate(orderId))
        })
        .catch(err => {
            window.alert(err.response.data.message);
        })
    }
}