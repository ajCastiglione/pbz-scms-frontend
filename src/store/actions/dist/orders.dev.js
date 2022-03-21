"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeOrder = exports.addInventory = exports.getOrderAndUpdate = exports.getOrders = exports.getOrdersSuccess = exports.getOrderAndUpdateSuccess = exports.getOrdersStart = void 0;

var actionTypes = _interopRequireWildcard(require("./actionTypes"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var getOrdersStart = function getOrdersStart() {
  return {
    type: actionTypes.FETCH_ORDERS_START
  };
};

exports.getOrdersStart = getOrdersStart;

var getOrderAndUpdateSuccess = function getOrderAndUpdateSuccess(data) {
  return {
    type: actionTypes.FETCH_ORDERS_AND_UPDATE_SUCCESS,
    data: data
  };
};

exports.getOrderAndUpdateSuccess = getOrderAndUpdateSuccess;

var getOrdersSuccess = function getOrdersSuccess(data) {
  return {
    type: actionTypes.GET_ORDERS_SUCCESS,
    data: data
  };
};

exports.getOrdersSuccess = getOrdersSuccess;

var getOrders = function getOrders(page, filters) {
  return function (dispatch) {
    dispatch(getOrdersStart());
    var url = "/order?page=".concat(page);

    if (filters) {
      if (filters.recipient || filters.transaction || filters.tracking) {
        url = "/order?page=".concat(page, "&recipent=").concat(filters.recipient, "&customerTransaction=").concat(filters.transaction, "&traking=").concat(filters.tracking);
      } else if (filters.startDate || filters.endDate) {
        url = "/order?page=".concat(page, "&dataRangeStart=").concat(filters.startDate, "&dataRangeEnd=").concat(filters.endDate);
      }
    }

    _axios["default"].get(url).then(function (res) {
      dispatch(getOrdersSuccess(res.data));
    })["catch"](function (err) {
      window.alert(err.response.data.message);
    });
  };
};

exports.getOrders = getOrders;

var getOrderAndUpdate = function getOrderAndUpdate(id) {
  return function (dispatch) {
    dispatch(getOrdersStart());

    _axios["default"].get("/order/add-update/".concat(id)).then(function (res) {
      dispatch(getOrderAndUpdateSuccess(res.data.items_in_order));
      console.log(res);
    })["catch"](function (err) {
      window.alert(err.response.data.message);
    });
  };
};

exports.getOrderAndUpdate = getOrderAndUpdate;

var addInventory = function addInventory(data) {
  return function (dispatch) {
    _axios["default"].post('/order/add-update/add-inventory', data).then(function (res) {
      dispatch(getOrderAndUpdate(data.orderId));
    })["catch"](function (err) {
      window.alert(err.response.data.message);
    });
  };
};

exports.addInventory = addInventory;

var removeOrder = function removeOrder(id, orderId) {
  return function (dispatch) {
    _axios["default"].post('/order/add-update/remove-inventory', {
      lineItemId: id
    }).then(function (res) {
      dispatch(getOrderAndUpdate(orderId));
    })["catch"](function (err) {
      window.alert(err.response.data.message);
    });
  };
};

exports.removeOrder = removeOrder;