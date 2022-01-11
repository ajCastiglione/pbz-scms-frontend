// React Imports
import React, { useEffect, useState, useRef } from 'react';
// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../store/actions/index'
// React- router imports
import { useHistory } from 'react-router';
// Styles
import classes from './ExportOrder.module.scss';
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress } from '@material-ui/core';
import { CSVLink } from 'react-csv';

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

const fileHeaders = [
    '_id',
    'status',
    'insurance_value',
    'shipping_cost',
    'customs_value',
    'notify_recipient',
    'user',
    'recipient',
    'createdAt',
    'updatedAt',
    '__v',
    'easypost_order_id',
    'additionally_notify',
    'blind_company',
    'blind_phone',
    'requested_carrier',
    'requested_service',
    'signature_option'
];

const dateOptions = [
                        {name: 'Last 24 hours', code: 1},
                        {name: 'Last 7 days', code: 7},
                        {name: 'Last 30 days', code: 30},
                        {name: 'Last 60 days', code: 60},
                        {name: 'All Orders', code: -1},
                        {name: 'Custom Range', code: -2},
                    ];

const ExportOrder = () => {
    // Hooks consts
    const matClasses = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    // State consts

    const [code, setCode] = useState(0);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [fileData, setFileData] = useState();
    const [bDownloadable, setDownloadable] = useState(false);

    const loading = open && options.length === 0;

    const csvLink = React.createRef();

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        async function searchDateOptions() {
            try {
                setOptions(dateOptions)
            } catch (error) {
                setOptions([])
            }
        }
        searchDateOptions()
        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    useEffect(() => {
        if (csvLink && csvLink.current && bDownloadable) {
            csvLink.current.link.click();
            setDownloadable(false);
        }
    }, [bDownloadable]);


    const exportOrders = () => {

        if(code !== 0) {
            axios.get(`/order/export?filter=${code}`)
            .then(res => {
                setFileData(res.data)
                setDownloadable(true);
            })
            .catch(err => {
                // window.alert(err.response.data.message)
            })
        }
    }

    const dateOptionSelected = (e) => {
        if(e !== null) setCode(e.code)
        else setCode(0)
    }

    const handleChange = (event, value) => dateOptionSelected(value);

    return (
        <div className={classes.Container}>
            <div className={classes.Recipient}>
                <p>What dates would you like to export orders for?</p>
                <div className={classes.menus}>

                    <Autocomplete
                        id="dateAutocomplete"
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
                                label="Search Dates"
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
            </div>
            <br></br><br></br>
            <Button variant="contained" color="primary" onClick={exportOrders}>Export Orders</Button>

            {fileData?.length &&
            <CSVLink
                headers={null}
                data={fileData}
                fileName="data.csv"
                ref={csvLink}
                target="_blank"
                hidden
            >
                Export
            </CSVLink>
            }
        </div>
    )
}

export default ExportOrder
