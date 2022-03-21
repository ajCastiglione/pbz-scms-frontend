// React Imports
import React, { useEffect, useState } from 'react';
// Styles
import classes from './Upload.module.scss';
// React-router Imports
import { useLocation, useHistory } from 'react-router';
// query-string to get queries from URL
import queryString from 'query-string';
// Material UI imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// Axios
import axios from 'axios';

const Upload = (props) => {
    // Hooks consts
    const history = useHistory();
    const { search } = useLocation();
    // State variables
    const values = queryString.parse(search);
    const [page, setPage] = useState(values.page ? Number(values.page) : 1);
    const [startDate, setStartDate] = useState(values.startDate ? values.startDate : '');
    const [endDate, setEndDate] = useState(values.endDate ? values.endDate : '');
    const [data, setData] = useState([]);
    const [pages, setPages] = useState(0);

    useEffect(() => {
        fetchHistory();
    }, [page])

    const changeStartDate = (e) => {
        if (e.target.value) {
            setStartDate(new Date(e.target.value).toISOString())
        } else {
            setStartDate('')
        }
    }

    const changeEndDate = (e) => {
        if (e.target.value) {
            setEndDate(new Date(e.target.value).toISOString())
        } else {
            setEndDate('')
        }
    }

    const changePage = (event, value) => {
        history.replace(`${props.path}?page=${page}&startDate=${startDate}&endDate=${endDate}`)
        setPage(value)
    }

    const fetchHistory = () => {
        axios.get(`${props.path}?page=${page}&dataRangeStart=${startDate}&dataRangeEnd=${endDate}`)
            .then(res => {
                setData(res.data.data)
                setPages(Math.ceil(res.data.total / 10))
            })
            .catch(err => {
                window.alert(err.response.data.message);
            })
    }

    const getuploads = () => {
        history.replace(`${props.path}?page=${page}&startDate=${startDate}&endDate=${endDate}`)
        fetchHistory();
    }

    const downloadFile = (e, row) => {
        /* axios.get(`https://scms-api.herokuapp.com/uploads/test.csv`) */
        /* axios.get(`http://localhost:4000/uploads/test.csv`) */
        axios.get(`http://18.119.141.222:3000/uploads/test.csv`)
            .then(res => {

            })
            .catch(err => {
                window.alert(err.response.data.message);
            })
    }

    return (
        <React.Fragment>
            <form className={classes.filters__container} onSubmit={e => e.preventDefault()}>
                <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={e => changeStartDate(e)}
                />
                <TextField
                    id="startDate"
                    label="End Date"
                    type="date"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={e => changeEndDate(e)}
                />
                <Button variant="contained" color="primary" onClick={getuploads}>Filter</Button>
            </form>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Created</TableCell>
                            <TableCell align="center">User</TableCell>
                            <TableCell align="center">Filename</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">{row.createdAt}</TableCell>
                                <TableCell align="center">{row.user.username}</TableCell>
                                <TableCell align="center" onClick={e => downloadFile(e, row)}><a target="_blank" href={`https://scms-api.herokuapp.com/${row.filename}`} rel="noreferrer">{row.filename}</a></TableCell>
                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
            {pages > 1 && <div className={classes.pagination}><Pagination count={pages} page={page} onChange={changePage} color="primary" /></div>}
        </React.Fragment>
    )
}

export default Upload;
