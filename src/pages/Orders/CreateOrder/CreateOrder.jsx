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
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
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

const CreateOrder = () => {
    // Hooks consts
    const matClasses = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    // State consts
    const [reci, setReci] = useState(null);
    // const [page, setPage] = useState(1)
    const [searchedRecipients, setSearchedRecipients] = useState([])
    // // Redux State getters
    // const recipients = useSelector(state => state.recipients.recipients)
    // const pages = useSelector(state => Math.ceil(state.recipients.total / 10))
    // useEffect hook to Fetch recipients
    // useEffect(() => {
    //     dispatch(actions.getRecipients(page))
    // }, [page])


    const handleChangeReci = (e) => {
        console.log('rasr')
        setReci(searchedRecipients.find(p => p._id === e.target.value))
        console.log(reci)

    }

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

    const searchReceipients = (e) => {
        axios.get(`/recipient/api/search?search=${e.target.value}`)
        .then(res => {
            console.log(res)
            setSearchedRecipients(res.data.data)
        })
    }

    return (
        <div className={classes.Container}>
            <Button variant="contained" color="primary" onClick={goCreateRec}>Create New Recipient</Button>
            <div className={classes.Recipient}>
                <p>Or select existing recipient</p>
                <h2>Recipient</h2>
                <div className={classes.menus}>
                    {/* <FormControl className={matClasses.formControl}>
                        <InputLabel id="demo-simple-select-label">Recipient</InputLabel>
                        <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            onChange={handleChangeReci}
                            className={matClasses.selectEmpty}
                        >
                            {recipients.map((reci => (
                                <MenuItem key={reci._id} value={reci._id}>{reci.name}</MenuItem>
                            )))}
                        </Select>
                    </FormControl>
                    <FormControl className={matClasses.formControl}>
                        <InputLabel id="demo-simple-select-label">Pages</InputLabel>
                        <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            onChange={e => setPage(Number(e.target.value))}
                            className={matClasses.selectEmpty}
                        >
                            {[...Array(pages)].map(((page, index) => (
                                <MenuItem key={index} value={index+1}>{index+1}</MenuItem>
                            )))}
                        </Select>
                    </FormControl> */                    
                    }
                    <TextField id="standard-basic" label="Search Recipients" onChange={e => searchReceipients(e)}/>
                    <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            onChange={handleChangeReci}
                            className={matClasses.selectEmpty}
                        >
                            {searchedRecipients.map((reci => (
                                <MenuItem key={reci._id} value={reci._id}>{reci.name ? `${reci.name} ${reci.contact} ${reci.street1}` : `${reci.contact} ${reci.street1}`}</MenuItem>
                            )))}
                        </Select>
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
    )
}

export default CreateOrder
