import axios from 'axios';
import * as actionTypes from './actionTypes';

export const fetchRecipientsStart = () =>{
    return{
        type: actionTypes.FETCH_RECIPIENTS_START
    }

}

export const fetchRecipientsSuccess = (recipients, total) => ({
    type: actionTypes.FETCH_RECIPIENTS_SUCCESS,
    recipients,
    total
})

export const fetchRecipientsFailed = (error) => ({
    type: actionTypes.FETCH_RECIPIENTS_FAILED,
    error
})

export const createRecipientStart = () => {
    return {
    type: actionTypes.CREATE_RECIPIENT_START
    }
}

export const createRecipientSuccess = (response) => {
    return {
        type: actionTypes.CREATE_RECIPIENT_SUCCESS,
        response
    }
}

export const createRecipientFailed = (error) => {
    return {
        type: actionTypes.CREATE_RECIPIENT_FAILED,
        error
    }
}

export const getRecipients = (page) => {
    return dispatch => {
        dispatch(fetchRecipientsStart())
        axios.get(`/recipient/add-update?page=${page}`)
        .then(res => {
            dispatch(fetchRecipientsSuccess(res.data.data, res.data.total))
        })
        .catch(err => {
            window.alert(err.response.data.message);
            dispatch(fetchRecipientsFailed(err.response.data))
        })
    }
};

export const createRecipient = (data) => {
    return dispatch => {
        dispatch(createRecipientStart())
        axios.post('/recipient/add-update', data)
        .then(res => {
            dispatch(createRecipientSuccess(res.data))
        })
        .catch(err => {
            window.alert(err.response.data.message);
            dispatch(createRecipientFailed(err.response))
        })
    }
}