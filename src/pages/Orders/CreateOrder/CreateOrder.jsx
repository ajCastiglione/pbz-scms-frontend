// React Imports
import React, { useEffect, useState } from 'react';
// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../store/actions/index'
// React- router imports
import { useHistory } from 'react-router';
// Styles
import classes from './CreateOrder.module.scss';
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from "@material-ui/core/Box";

// Axios
import axios from 'axios';
// Material UI Styles
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

  
function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

    
const CreateOrder = props => {
    // Hooks consts
    const matClasses = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    // State consts
    const [reci, setReci] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    // const [page, setPage] = useState(1)
  
    // // Redux State getters
    // const recipients = useSelector(state => state.recipients.recipients)
    // const pages = useSelector(state => Math.ceil(state.recipients.total / 10))
    // useEffect hook to Fetch recipients
    // useEffect(() => {
    //     dispatch(actions.getRecipients(page))
    // }, [page])

    useEffect(() => {

        let active = true;

        if (!loading) {
            return undefined;
        }

        async function searchRecipients() {
            try {
                const response = await axios.get('/recipient/api/search')
                setOptions(response.data.data)
            } catch (error) {
                setOptions([])
            }
        }

        searchRecipients()

        return () => {
            active = false;
        };
        }, [loading]);

        React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const goCreateRec = () => {
        history.push('/recipient/add-update/null')
    }

    // Function to create order and save the response then navigate to next page
    const goOrders = (id) => {
        axios.post('/order/add-update', {
            recipientId: id
        })
            .then(res => {
                history.push('/add-order', {
                    ...reci,
                    orderId: res.data.data._id
                })
            })
            .catch(err => {
                window.alert(err.response.data.message)
            })
    }

    const setSelectedRecipients = (e) => {
        console.log(e)
        setReci(e);
    }

    const handleChange = (event, value) => setSelectedRecipients(value);

    let shipConfirmation = true;
    let lineItems = [];

    console.log('States=>', props.location);
    if(props.location.state === undefined || props.location.state === null) {
        shipConfirmation = false;
    } else {
        shipConfirmation = (props.location.state === null && props.location.state.shipConfirmation === null) ? 0 : props.location.state.shipConfirmation;
        lineItems = props.location.state.lineItems;
    }


    return !shipConfirmation ? (
        <div className={classes.Container}>
            <Button variant="contained" color="primary" onClick={goCreateRec}>Create New Recipient</Button>
            <div className={classes.Recipient}>
                <p>Or select existing recipient</p>
                <h2>Recipient</h2>
                <div className={classes.menus}>

                    <Autocomplete
                        id="asyncAutocomplete"
                        sx={{ width: 300 }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        onChange={handleChange}                  
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => option.name}
                        options={options}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Recipients"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />

                </div>

                {reci ? (<div className={classes.Details}>
                    <div className={classes.Details__box}>
                        <p>Name: <span>{reci.name}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Contact: <span>{reci.contact}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Phone: <span>{reci.phone}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Email: <span>{reci.email}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Street1: <span>{reci.street1}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Street2: <span>{reci.street2}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>City: <span>{reci.city}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>State: <span>{reci.state}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Zip/Postal Code: <span>{reci.postal}</span></p>
                    </div>
                    <div className={classes.Details__box}>
                        <p>Country: <span>{reci.country}</span></p>
                    </div>
                    <Button variant="contained" color="primary" onClick={() => goOrders(reci._id)}>go</Button>
                </div>
                ) : null}
            </div>
        </div>
    ) : (
        <div>
            <Box width="100%" display="flex" justifyContent="center" p={2}>
                <h1>Order Created</h1>
            </Box>
            <div className={classes.RecipientDetails}>
                <h2>Recipient: {props.location.state.order.recipient.name} {props.location.state.order.recipient.contact} | {props.location.state.order.recipient.country}</h2>
                <p>Total Weight: {Number(props.location.state.total_weight).toFixed(2)}</p>
                <p>Total Packages: {props.location.state.total_packages}</p>
                <p>Insurance Cost: {props.location.state.insurance_cost} (built in to rates below)</p>
            </div>
            <p>Shipment contents: </p>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Item Name</TableCell>
                            <TableCell align="center">Item #</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center"># (Cases)</TableCell>
                            <TableCell align="center"># (Units)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lineItems.length > 0 ? (
                            lineItems.map(line => (
                                <TableRow key={line._id}>
                                    <TableCell align="center">{line.item.name} s</TableCell>
                                    <TableCell align="center">{line.item.number}</TableCell>
                                    <TableCell align="center">{line.item.description}</TableCell>
                                    <TableCell align="center">{line.quantity_cases}</TableCell>
                                    <TableCell align="center">{line.quantity_units}</TableCell>
                                </TableRow>
                            ))
                        ) : <p>lines are empty</p>}

                    </TableBody>
                </Table>
            </TableContainer>
            <Box width="100%" display="flex" justifyContent="center" >
                <p>Your order has been successfully entered into the system and is pending shipment.</p>
            </Box>
            <Box width="100%" display="flex" justifyContent="center" p={2}>
                <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} onClick={() => history.push('/order/add-update')}>Create another New Order</Button>
            </Box>
        </div>
    )
}

export default CreateOrder
