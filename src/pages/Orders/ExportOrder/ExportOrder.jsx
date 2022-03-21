// React Imports
import React, { useEffect, useState, Fragment } from 'react';
// Styles
import classes from './ExportOrder.module.scss';
// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

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

    const [code, setCode] = useState(0);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [fileData, setFileData] = useState();
    const [datePickerStartOpened, setDatePickerStartOpened] = useState(false);
    const [datePickerEndOpened, setDatePickerEndOpened] = useState(false);
    const [bDownloadable, setDownloadable] = useState(false);
    const [customRange, setCustomRange] = useState(false);
    const loading = open && options.length === 0;
    const [dateStart, setDateStart] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());

    const csvLink = React.createRef();

    useEffect(() => {
        const currentDate = new Date()
        const dateBegin = new Date(currentDate - 2592000000)
        setDateStart(dateBegin)
        setDateEnd(currentDate)
    }, [])

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

    useEffect(() => {
        if(code == -2) {
            setCustomRange(true);
        } else setCustomRange(false);
    }, [code]);

    const exportOrders = () => {

        if(code !== 0) {
            if (code == -2) {
                axios.get(`/order/export?filter=${code}&&dateStart=${dateStart}&&dateEnd=${dateEnd}`)
                .then(res => {
                    
                    setFileData(res.data)
                    setDownloadable(true);
                })
                .catch(err => {
                    window.alert(err.response.data.message)
                })
            } else {
                axios.get(`/order/export?filter=${code}`)
                .then(res => {
                    
                    setFileData(res.data)
                    setDownloadable(true);
                })
                .catch(err => {
                    window.alert(err.response.data.message)
                })
            }
            
        }
    }

    const handleChange = (event, value) => value !== null ? setCode(value.code) : setCode(0);

    const dateStartChanged = (date, e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        setDateStart(date);
        setDatePickerStartOpened(false);
    }

    const dateEndChanged = (date, e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        setDateEnd(date);
        setDatePickerEndOpened(false);
    }

    const requestStartPickerOpen = () => {
        setDatePickerStartOpened(true);
    }

    const requestEndPickerOpen = () => {
        setDatePickerEndOpened(true);
    }

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

                    <br></br>
                    {customRange ? (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            
                            
                            <Fragment>
                                <KeyboardDatePicker
                                    clearable
                                    value={dateStart}
                                    placeholder="2018/10/10"
                                    onChange={date => dateStartChanged(date)}
                                    format="yyyy-MM-dd"
                                />

                                <KeyboardDatePicker
                                    placeholder="2018/10/10"
                                    value={dateEnd}
                                    onChange={date => dateEndChanged(date)}
                                    format="yyyy-MM-dd"
                                />
                            </Fragment>
                        </MuiPickersUtilsProvider>
                    ): <div></div>}
                    

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
