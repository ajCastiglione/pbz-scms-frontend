import * as actionTypes from './actionTypes';
import axios from 'axios';

export const fetchDiscountsStart = () => {
    return {
        type: actionTypes.FETCH_DISCOUNTS_START
    }
}

export const fetchDiscountsSuccess = (discounts) => {
    return {
        type: actionTypes.FETCH_DISCOUNTS_SUCCESS,
        discounts
    }
}

export const fetchDiscountsFailed = () => {
    return {
        type: actionTypes.FETCH_DISCOUNTS_FAILED
    }
}

export const getDiscounts = (id) => {
    return dispatch => {
        dispatch(fetchDiscountsStart())
        axios.get(`/user/add-update/discounts/${id}`)
        .then(res => {
            dispatch(fetchDiscountsSuccess(res.data.discounts))
        })
        .catch(err => {
            dispatch(fetchDiscountsFailed())
        })
    }
}

export const addDiscount = (discount) => {
    return dispatch => {
        dispatch(fetchDiscountsStart())
        axios.post('/user/add-update/discounts', discount)
        .then(res => {
            dispatch(getDiscounts(discount.id))
        })
        .catch(err => {
            dispatch(getDiscounts(discount.id))
        })
    }
}