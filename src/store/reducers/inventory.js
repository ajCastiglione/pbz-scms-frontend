import * as actionTypes from "../actions/actionTypes";

const initialState = {
    inventory: [],
    total: 0,
    searchTerm: "",
    loading: false,
    message: "",
    error: "",
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_INVENTORY_START:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.SEARCH_INVENTORY_TERM:
            return {
                ...state,
                searchTerm: action.searchTerm,
            };
        case actionTypes.FETCH_INVENTORY_SUCCESS:
            return {
                ...state,
                inventory: action.inventory.data,
                total: action.inventory.total,
                page: action.page,
                loading: false,
            };
        case actionTypes.CREATE_INVENTORY_START:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.CREATE_INVENTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                message: "Inventory Created Successfully",
                error: "",
            };
        case actionTypes.CREATE_INVENTORY_FAILED:
            return {
                ...state,
                loading: false,
                error: "An error occured please refresh and try again",
                message: "",
            };
        case actionTypes.CLEAR_INVENTORY_MESSAGE:
            return {
                ...state,
                message: "",
                error: "",
            };

        default:
            return state;
    }
};

export default reducer;
