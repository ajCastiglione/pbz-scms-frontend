// React Imports
import React, { useEffect, useState } from 'react';
// Redux Imports
import { useDispatch, useSelector } from 'react-redux';
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
    
const CreateOrder = props => {
    // Hooks consts
    const matClasses = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const recipient = useSelector(state => state.recipients.recipient)

    // State consts
    const [reci, setReci] = useState(recipient);
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;
    const inputRef = React.createRef();

    async function searchRecipients(q) {
        try {
            const response = await axios.get(`/recipient/api/search?q=${q}`)
            if(response.data.total > 0)
                setOptions(response.data.data)
            else {
                setOptions([])
                setOpen(false)
            }
        } catch (error) {
            setOptions([])
        }
    }

    useEffect(() => {

        let active = true;

        if (!loading) {
            return undefined;
        }

        setTimeout(() => {
            searchRecipients('')
        }, 500);

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
        history.push('/recipient/add-update/null', {recipient: null, createOrder: 1})
    }

    // Function to create order and save the response then navigate to next page
    const goOrders = (id) => {
        axios.post('/order/add-update', {
            recipientId: id
        })
            .then(res => {
                history.push('/add-order', {
                    ...reci,
                    orderId: res.data.data.id
                })
            })
            .catch(err => {
                window.alert(err.response.data.message)
            })
    }

    const setSelectedRecipients = (e) => {
        console.log('E => ',e)
        setReci(e);
    }

    const handleChange = (event, value) => setSelectedRecipients(value);

    let shipConfirmation = 'default';
    let lineItems = [];

    if(props.location.state === undefined || props.location.state === null) {
        shipConfirmation = 'default';
    } else {
        shipConfirmation = (props.location.state === null && props.location.state.shipConfirmation === null) ? 'default' : props.location.state.shipConfirmation;
        lineItems = props.location.state.lineItems;
    }

    const handleKeyPress = (e) => {
        
        setTimeout(() => searchRecipients(e.target.value), 1000);
    }


    return shipConfirmation === 'default' ? (
        //Create order page
        <div className={classes.Container}>
            <Button variant="contained" color="primary" onClick={goCreateRec}>Create New Recipient</Button>
            <div className={classes.Recipient}>
                <p>Or select existing recipient</p>
                <h2>Recipient</h2>
                <div className={classes.menus}>

                    <Autocomplete
                        id="autoRecipientSelect"
                        sx={{ width: 600 }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        onChange={handleChange}
                        value={reci}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (option.name !== undefined && option.contact != undefined) ? option.name + ' - ' + option.contact : ''}
                        options={options}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                ref = {inputRef}
                                label="Search Recipients"
                                onChange={handleKeyPress}
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

                {(reci && reci.contact) ? (<div className={classes.Details}>
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
                    <Button variant="contained" color="primary" onClick={() => goOrders(reci.id)}>go</Button>
                </div>
                ) : null}
            </div>
        </div>
    ) : shipConfirmation === 'orderCreated' ? (
        //The confirmation page showing after submittiong of order
        <div className={classes.RecipientDetails}>
            <div >
                <h1>Order Created</h1>
                <div>
                    <h3>Recipient: {props.location.state.order.recipient.name} {props.location.state.order.recipient.contact} | {props.location.state.order.recipient.country}</h3>
                    <span>Total Weight: {Number(props.location.state.total_weight).toFixed(2)}</span><br></br>
                    <span>Total Packages: {props.location.state.total_packages}</span><br></br>
                    <span>Insurance Cost: {props.location.state.insurance_cost} (built in to rates below)</span><br></br>
                </div>

                <p>Shipment contents: </p>

            </div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"><strong>Item Name</strong></TableCell>
                            <TableCell align="left"><strong>Item #</strong></TableCell>
                            <TableCell align="left"><strong>Description</strong></TableCell>
                            <TableCell align="left"><strong># (Cases)</strong></TableCell>
                            <TableCell align="left"><strong># (Units)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lineItems.length > 0 ? (
                            lineItems.map(line => (
                                <TableRow key={line.id}>
                                    <TableCell align="left">{line.inventory.name}</TableCell>
                                    <TableCell align="left">{line.inventory.number}</TableCell>
                                    <TableCell align="left">{line.inventory.description}</TableCell>
                                    <TableCell align="left">{line.quantity_cases}</TableCell>
                                    <TableCell align="left">{line.quantity_units}</TableCell>
                                </TableRow>
                            ))
                        ) : <p>lines are empty</p>}

                    </TableBody>
                </Table>
            </TableContainer>
                <p>Your order has been successfully entered into the system and is pending shipment.</p>
            <Box width="100%" display="flex" justifyContent="left" p={0}>
                <Button variant="outlined" color="primary" style={{ marginRight: '1rem' }} onClick={() => history.push('/order/add-update')}>Create another New Order</Button>
            </Box>
            <br></br>
        </div>
    ) : 
    <div>
        { props.location.state.type === 'pickRate' ? (props.location.state.data.labels.length > 0 ? ( 
            //Shipping Label Page
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><b>Box #</b></TableCell>
                            <TableCell align="center"><b>Weight (pounds)</b></TableCell>
                            <TableCell align="center"><b>Image (PNG)</b></TableCell>
                            <TableCell align="center"><b>PDF</b></TableCell>
                            <TableCell align="center"><b>ZPL (Zebra)</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { props.location.state.data.labels.length > 0 ? (
                            props.location.state.data.labels.map(function(label,i) {
                                return (<TableRow key={i}>
                                    <TableCell align="center">{i+1}</TableCell>
                                    <TableCell align="center">{label.weight}</TableCell>
                                    <TableCell align="center"><a className={classes.LABEL} href={label.label_url} target='_blank' role='button'>PNG</a></TableCell>
                                    <TableCell align="center"><a className={classes.LABEL} href={label.label_pdf_url} target='_blank' role='button'>PDF</a></TableCell>
                                    <TableCell align="center"><a className={classes.LABEL} href={label.label_zpl_url} target='_blank' role='button'>ZPL</a></TableCell>
                                </TableRow>)
                            })
                        ) : <p>lines are empty</p>}

                    </TableBody>
                </Table>
            </TableContainer>): <p>No Shippment Labels</p>) :  
        (<div><p className={classes.strong}>As this order was shipped manually there are no labels to print from here.</p></div>)}
    </div>
}

export default CreateOrder
