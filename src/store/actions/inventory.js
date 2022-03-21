import * as actionTypes from './actionTypes';
import axios from 'axios';

export const fetchInventoryStart = () => ({
    type: actionTypes.FETCH_INVENTORY_START
})

export const fetchInventorySuccess = (inventory) => ({
    type: actionTypes.FETCH_INVENTORY_SUCCESS,
    inventory
})

export const fetchInventoryFailed = (error) => ({
    type: actionTypes.FETCH_INVENTORY_FAILED,
    error
})

export const createInventoryStart = () => {
    return {
    type: actionTypes.CREATE_INVENTORY_START
    }
}

export const createInventorySuccess = (response) => {
    return {
        type: actionTypes.CREATE_INVENTORY_SUCCESS,
        response
    }
}

export const createInventoryFailed = (error) => {
    return {
        type: actionTypes.CREATE_INVENTORY_FAILED,
        error
    }
}


export const getInventory = (page) => {
    return dispatch => {
        dispatch(fetchInventoryStart())
        axios.get(`/inventory/add-update?page=${page}`)
        .then(res => {            
            dispatch(fetchInventorySuccess(res.data))

        })
        .catch(err => {
            window.alert(err.response.data.message);
        })
    }

}

export const createInventory = (data) => {
    return dispatch => {
        dispatch(createInventoryStart())
        axios.post('/inventory/add-update', data)
        .then(res => {
            dispatch(createInventorySuccess(res.data.data))
        })
        .catch(err => {
            window.alert(err.response.data.message);
            dispatch(createInventoryFailed(err.response))
        })
    }
}

export const editEnventory = (data) => {
    return dispatch => {
        dispatch(createInventoryStart())
        axios.post('/inventory/add-update/edit', data)
        .then(res => {
            dispatch(createInventorySuccess(res.data.data))
        })
        .catch(err => {
            console.log(err.response);
            dispatch(createInventoryFailed(err.response))
        })
    }
}