// React Imports
import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
// Redux Imports
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/actions/index";
// Components Imports
import Spinner from "../../../components/global/Spinner/Spinner";
// Styles
import classes from "./CreateInventory.module.scss";
// Material UI Imports
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

const CreateInventory = () => {
  // React Router consts
  const location = useLocation();
  const history = useHistory();
  // Redux consts
  const dispatch = useDispatch();
  // State consts
  const [name, setName] = useState(location.state ? location.state.name : "");
  const [number, setNumber] = useState(
    location.state ? location.state.number : ""
  );
  const [caseQuantity, setCaseQuantity] = useState(
    location.state ? location.state.case_quantity : ""
  );
  const [desc, setDesc] = useState(
    location.state ? location.state.description : ""
  );
  const [quantityCase, setQuantityCase] = useState(
    location.state ? location.state.qoh_case : ""
  );
  const [quantityUnits, setQuantityUnits] = useState(
    location.state ? location.state.qoh_units : ""
  );
  const [caseWeight, setCaseWeight] = useState(
    location.state ? location.state.case_weight : ""
  );
  const [reorderQuantity, setReorderQuantity] = useState(
    location.state ? location.state.reorder_quantity : ""
  );
  const [length, setLength] = useState(
    location.state ? location.state.length : ""
  );
  const [width, setWidth] = useState(
    location.state ? location.state.width : ""
  );
  const [height, setHeight] = useState(
    location.state ? location.state.height : ""
  );
  const [isReady, setIsReady] = useState(
    location.state ? location.state.ship_ready : false
  );
  const [validationErrors, setValidationErrors] = useState({});

  // Function to re-format data and dispatch redux action
  const createInventory = (event) => {
    event.preventDefault();
    const validations = validation();
    if (Object.keys(validations).length) {
      setValidationErrors(validations);
      return;
    } else {
      setValidationErrors({});
    }

    let data = {
      name: name,
      number: number,
      case_quantity: parseInt(caseQuantity),
      description: desc,
      qoh_case: parseInt(quantityCase),
      qoh_units: parseInt(quantityUnits),
      case_weight: parseInt(caseWeight),
      reorder_quantity: parseInt(reorderQuantity),
      length: (length === '' ? 0 : parseInt(length)),
      width: (width === '' ? 0 : parseInt(width)),
      height: (height === '' ? 0 : parseInt(height)),
      ship_ready: isReady,
    };
    if (location.state) {
      data = { ...data, id: location.state.id };
      dispatch(actions.editEnventory(data));
    } else {
      dispatch(actions.createInventory(data));
    }
  };

  const validation = () => {
    const errors = {};
    if (name === "") {
      errors.name = true;
    }
    if (number === "") {
      errors.number = true;
    }
    if (caseQuantity === "") {
      errors.caseQuantity = true;
    }
    if (desc === "") {
      errors.desc = true;
    }
    if (quantityCase === "") {
      errors.quantityCase = true;
    }
    if (quantityUnits === "") {
      errors.quantityUnits = true;
    }
    if (caseWeight === "") {
      errors.caseWeight = true;
    }
    if (reorderQuantity === "") {
      errors.reorderQuantity = true;
    }
    return errors;
  };

  // Function to navigate back
  const goBack = () => {
    history.goBack();
  };
  // Redux state consts
  const message = useSelector((state) => state.inventory.message);
  const error = useSelector((state) => state.inventory.error);
  const loading = useSelector((state) => state.inventory.loading);

  const preValidation = (func, _name) => ({target: {value}}) => {
      if(value !== '') {
          if(_name == 'number') {
            value = value.replace(/[^A-Za-z0-9]/ig, '')
          }
          const newValidationErrors = JSON.parse(JSON.stringify(validationErrors));
          delete newValidationErrors[_name];
          setValidationErrors(newValidationErrors);
      }
    func(value);
  }

  return (
    <React.Fragment>
      <Box width="100%" display="flex" justifyContent="center" p={2}>
        <form onSubmit={createInventory} className={classes.Form}>
          <h1>Create Inventory</h1>
          <TextField
            width="6"
            label="Item Name"
            value={name}
            onChange={preValidation(setName, 'name')}
            {...(validationErrors.name && { error: true })}
          />
          <TextField
            label="Item Number"
            value={number}
            onChange={preValidation(setNumber, 'number')}
            {...(validationErrors.number && { error: true })}
          />
          <TextField
            label="Case Quantity"
            value={caseQuantity}
            onChange={preValidation(setCaseQuantity, 'caseQuantity')}
            type="number"
            {...(validationErrors.caseQuantity && { error: true })}
          />
          <TextField
            label="Unit Description"
            value={desc}
            onChange={preValidation(setDesc, 'desc')}
            {...(validationErrors.desc && { error: true })}
          />
          <TextField
            label="Quantity - Case"
            value={quantityCase}
            onChange={preValidation(setQuantityCase, 'quantityCase')}
            type="number"
            {...(validationErrors.quantityCase && { error: true })}
          />
          <TextField
            label="Quantity - Units"
            value={quantityUnits}
            onChange={preValidation(setQuantityUnits, 'quantityUnits')}
            type="number"
            {...(validationErrors.quantityUnits && { error: true })}
          />
          <TextField
            label="Case Weight (pounds)"
            value={caseWeight}
            onChange={preValidation(setCaseWeight, 'caseWeight')}
            type="number"
            {...(validationErrors.caseWeight && { error: true })}
          />
          <TextField
            label="Re-order Quantity"
            value={reorderQuantity}
            onChange={preValidation(setReorderQuantity, 'reorderQuantity')}
            type="number"
            {...(validationErrors.reorderQuantity && { error: true })}
          />
          <TextField
            label="Length (inches)"
            value={length}
            onChange={preValidation(setLength, 'length')}
            type="number"
            {...(validationErrors.length && { error: true })}
          />
          <TextField
            label="Width (inches)"
            value={width}
            onChange={preValidation(setWidth, 'width')}
            type="number"
            {...(validationErrors.width && { error: true })}
          />
          <TextField
            label="Height (inches)"
            value={height}
            onChange={preValidation(setHeight, 'height')}
            type="number"
            {...(validationErrors.height && { error: true })}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="checkedB"
                color="primary"
                onChange={() => setIsReady(!isReady)}
                checked={isReady}
              />
            }
            label="Ship Ready"
          />
          {message !== "" && <p style={{ color: "green" }}>{message}</p>}
          {error !== "" && <p style={{ color: "red" }}>{error}</p>}
          {message || error ? (
            <p style={{ cursor: "pointer", color: "blue" }} onClick={goBack}>
              Go back
            </p>
          ) : null}
          <Button variant="contained" color="primary" type="submit">
            {loading ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </Box>
    </React.Fragment>
  );
};

export default CreateInventory;
