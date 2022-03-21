"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editEnventory = exports.createInventory = exports.getInventory = exports.createInventoryFailed = exports.createInventorySuccess = exports.createInventoryStart = exports.fetchInventoryFailed = exports.fetchInventorySuccess = exports.fetchInventoryStart = void 0;

var actionTypes = _interopRequireWildcard(require("./actionTypes"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var fetchInventoryStart = function fetchInventoryStart() {
  return {
    type: actionTypes.FETCH_INVENTORY_START
  };
};

exports.fetchInventoryStart = fetchInventoryStart;

var fetchInventorySuccess = function fetchInventorySuccess(inventory) {
  return {
    type: actionTypes.FETCH_INVENTORY_SUCCESS,
    inventory: inventory
  };
};

exports.fetchInventorySuccess = fetchInventorySuccess;

var fetchInventoryFailed = function fetchInventoryFailed(error) {
  return {
    type: actionTypes.FETCH_INVENTORY_FAILED,
    error: error
  };
};

exports.fetchInventoryFailed = fetchInventoryFailed;

var createInventoryStart = function createInventoryStart() {
  return {
    type: actionTypes.CREATE_INVENTORY_START
  };
};

exports.createInventoryStart = createInventoryStart;

var createInventorySuccess = function createInventorySuccess(response) {
  return {
    type: actionTypes.CREATE_INVENTORY_SUCCESS,
    response: response
  };
};

exports.createInventorySuccess = createInventorySuccess;

var createInventoryFailed = function createInventoryFailed(error) {
  return {
    type: actionTypes.CREATE_INVENTORY_FAILED,
    error: error
  };
};

exports.createInventoryFailed = createInventoryFailed;

var getInventory = function getInventory(page) {
  return function (dispatch) {
    dispatch(fetchInventoryStart());

    _axios["default"].get("/inventory/add-update?page=".concat(page)).then(function (res) {
      dispatch(fetchInventorySuccess(res.data));
    })["catch"](function (err) {
      window.alert(err.response.data.message);
    });
  };
};

exports.getInventory = getInventory;

var createInventory = function createInventory(data) {
  return function (dispatch) {
    dispatch(createInventoryStart());

    _axios["default"].post('/inventory/add-update', data).then(function (res) {
      dispatch(createInventorySuccess(res.data.data));
    })["catch"](function (err) {
      window.alert(err.response.data.message);
      dispatch(createInventoryFailed(err.response));
    });
  };
};

exports.createInventory = createInventory;

var editEnventory = function editEnventory(data) {
  return function (dispatch) {
    dispatch(createInventoryStart());

    _axios["default"].post('/inventory/add-update/edit', data).then(function (res) {
      dispatch(createInventorySuccess(res.data.data));
    })["catch"](function (err) {
      console.log(err.response);
      dispatch(createInventoryFailed(err.response));
    });
  };
};

exports.editEnventory = editEnventory;