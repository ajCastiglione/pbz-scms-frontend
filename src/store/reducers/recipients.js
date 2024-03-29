import * as actionTypes from "../actions/actionTypes";

const initialState = {
    recipients: [],
    total: 0,
    loading: false,
    message: "",
    error: "",
    recipient: {},
    query: "",
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_RECIPIENTS_START:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.FETCH_RECIPIENTS_SUCCESS:
            return {
                ...state,
                recipients: action.recipients,
                total: action.total,
                page: action.page,
                loading: false,
                query: action.query,
            };
        case actionTypes.FETCH_RECIPIENTS_FAILED:
            return {
                error: action.error,
                loading: false,
            };
        case actionTypes.CREATE_RECIPIENT_START:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.CREATE_RECIPIENT_SUCCESS:
            return {
                ...state,
                loading: false,
                message: "Recipient Created Successfully",
                error: "",
                recipient: action.response.data,
            };
        case actionTypes.CREATE_RECIPIENT_FAILED:
            return {
                ...state,
                loading: false,
                error: "An error occured please refresh and try again",
                message: "",
            };
        default:
            return state;
    }
};

export default reducer;
