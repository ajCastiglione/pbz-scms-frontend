// React Imports
import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
// Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions/index';
// Components Imports
import Spinner from '../../../components/global/Spinner/Spinner';
// Styles
import classes from './CreateInventory.module.scss';
// Material UI Imports
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const CreateInventory = () => {
    // React Router consts
    const location = useLocation();
    const history = useHistory();
    // Redux consts
    const dispatch = useDispatch()
    // State consts
    const [name, setName] = useState(location.state ? location.state.name : '');
    const [number, setNumber] = useState(location.state ? location.state.number : '');
    const [caseQuantity, setCaseQuantity] = useState(location.state ? location.state.case_quantity : '');
    const [desc, setDesc] = useState(location.state ? location.state.description : '');
    const [quantityCase, setQuantityCase] = useState(location.state ? location.state.qoh_case : '');
    const [quantityUnits, setQuantityUnits] = useState(location.state ? location.state.qoh_units : '');
    const [caseWeight, setCaseWeight] = useState(location.state ? location.state.case_weight : '');
    const [reorderQuantity, setReorderQuantity] = useState(location.state ? location.state.reorder_quantity : '')
    const [length, setLength] = useState(location.state ? location.state.length : '');
    const [width, setWidth] = useState(location.state ? location.state.width : '');
    const [height, setHeight] = useState(location.state ? location.state.height : '');
    const [isReady, setIsReady] = useState(location.state ? location.state.ship_ready : false)

    // Function to re-format data and dispatch redux action
    const createInventory = (event) => {
        event.preventDefault();
        let data = {
            name: name,
            number: number,
            case_quantity: parseInt(caseQuantity),
            description: desc,
            qoh_case: parseInt(quantityCase),
            qoh_units: parseInt(quantityUnits),
            case_weight: parseInt(caseWeight),
            reorder_quantity: parseInt(reorderQuantity),
            length: parseInt(length),
            width: parseInt(width),
            height: parseInt(height),
            ship_ready: isReady,
        }
        if (location.state){
            data = {...data, id: location.state._id};
            dispatch(actions.editEnventory(data))
        }else{
            dispatch(actions.createInventory(data))
        }
    }
    // Function to navigate back
    const goBack = () => {
        history.goBack();
    }
    // Redux state consts
    const message = useSelector(state => state.inventory.message)
    const error = useSelector(state => state.inventory.error)
    const loading = useSelector(state => state.inventory.loading)

    return (
        <React.Fragment>
            <Box width="100%" display="flex" justifyContent="center" p={2} >

                <form onSubmit={createInventory} className={classes.Form}>
                    <h1>Create Inventory</h1>
                    <TextField width="6" label="Item Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Item Number" value={number} onChange={(e) => setNumber(e.target.value)} />
                    <TextField label="Case Quantity" value={caseQuantity} onChange={(e) => setCaseQuantity(e.target.value)} />
                    <TextField label="Unit Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
                    <TextField label="Quantity - Case" value={quantityCase} onChange={(e) => setQuantityCase(e.target.value)} />
                    <TextField label="Quantity - Units" value={quantityUnits} onChange={(e) => setQuantityUnits(e.target.value)} />
                    <TextField label="Case Weight (pounds)" value={caseWeight} onChange={(e) => setCaseWeight(e.target.value)} />
                    <TextField label="Re-order Quantity" value={reorderQuantity} onChange={(e) => setReorderQuantity(e.target.value)} />
                    <TextField label="Length (inches)" value={length} onChange={(e) => setLength(e.target.value)} />
                    <TextField label="Width (inches)" value={width} onChange={(e) => setWidth(e.target.value)} />
                    <TextField label="Height (inches)" value={height} onChange={(e) => setHeight(e.target.value)} />
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
                    {message !== '' && <p style={{color: 'green'}}>{message}</p>}
                    {error !== '' && <p style={{color: 'red'}}>{error}</p>}
                    {message || error ? <p style={{cursor: 'pointer', color: 'blue'}} onClick={goBack}>Go back</p> : null}
                    <Button variant="contained" color="primary" type="submit">
                        {loading ? <Spinner /> : 'Submit'}
                    </Button>
                </form>

            </Box>
        </React.Fragment>
    )
}

export default CreateInventory;
