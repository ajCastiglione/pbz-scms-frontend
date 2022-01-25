// React Imports
import React, { useEffect, useState } from 'react';
// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions'
// Styles
import classes from './home.module.scss';
// React-router 
import { useLocation, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
// Components Imports
import LargeSpinner from '../../components/global/LargeSpinner/LargeSpinner';
// Material UI Imports
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';
// Axios
import axios from 'axios';

const Home = (props) => {
    const history = useHistory();
    const { search } = useLocation();
    const dispatch = useDispatch();

    const values = queryString.parse(search);
    const [page, setPage] = useState(values.page ? values.page : 1);
    const [startDate, setStartDate] = useState(values.startDate ? values.startDate : '');
    const [endDate, setEndDate] = useState(values.endDate ? values.endDate : '');
    const [data, setData] = useState([]);
    const [lowStock, setLowStock] = useState([])
    const [pages, setPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const role = useSelector(state => state.auth.role)

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
        history.replace(`/?page=${value}&startDate=${startDate}&endDate=${endDate}`)
        setPage(value)
    }

    const getHome = () => {
        setLoading(true)
        axios.get(`/`)
            .then(res => {
                console.log(res)
                setData(res.data.orders)
                setPages(Math.ceil(res.data.totalOrders / 10))
                setLoading(false)
                if(res.data.low_stock){
                    setLowStock(res.data.low_stock)
                }
            })
            .catch(err => {
                window.alert(err.response.data.message)
                setLoading(false)
            })
    }


    useEffect(() => {
        getHome();
    }, [page])

    const getuploads = () => {
        history.replace(`/?page=${page}&startDate=${startDate}&endDate=${endDate}`)
        getHome();
    }

    const goEdit = (e, order) => {
        const data = {
            orderId: order.id,
            name: order.recipient.name,
            contact: order.recipient.contact,
            country: order.recipient.country
        }
        history.push(`/add-order`, data)
    }

    const cancelOrder = (e, status, id) => {
        let action = 'cancel';
        if (status === 3) {
            action = 'restore'
        }
        axios.post('/order/add-update/cancel-restore', {
            orderId: id,
            action: action
        })
            .then(res => {
                console.log(res)
                getHome();
            })
            .catch(err => {
                console.log(err)
            })
    }

    const postShip = (e, id) => {
        axios.post('/order/add-update/ship', { orderId: id })
            .then(res => {
                history.push('ship-order', res.data)
            }).catch(err => {
                console.log(err.response)
                window.alert(err.response.data.message)
            })
    }

    const split = (id) =>{
        axios.post('/inventory/split', {id})
        .then(res => {
            dispatch(actions.getInventory(page))
        })
        .catch(err => {
            window.alert(err.response.data.message)
        })
    }


    return (
        <React.Fragment>
            <h2>Pending Orders</h2>
            <h3>From All Users, grouped by client</h3>
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
            {loading ? <LargeSpinner /> : (<><TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Edit</TableCell>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Recipient</TableCell>
                            <TableCell align="center">Created</TableCell>
                            <TableCell align="center">Last Modified</TableCell>
                            <TableCell align="center">Shipped</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Packing Slip</TableCell>
                            <TableCell align="center">Pick Ticket</TableCell>
                            {role === 'superadmin' || role === 'warehouse' ? <TableCell align="center">Ship</TableCell> : null}
                            <TableCell align="center">Tracking</TableCell>
                            <TableCell align="center">Customer Reference</TableCell>
                            <TableCell align="center">Cancel / Restore</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map(o => (
                                
                                <TableRow key={o.id}>
                                    <TableCell align="center"><Button variant="contained" color="primary" onClick={(e) => goEdit(e, o)}>Edit</Button></TableCell>
                                    <TableCell align="center" style={{ maxWidth: '8rem' }}><p style={{ overflow: 'scroll', overflowY: 'hidden' }}>{o.id}</p></TableCell>
                                    <TableCell align="center">
                                        {o.recipient.name} {o.recipient.contact}
                                        { (o.recipient.country !== 'US' && o.recipient.country !== 'United States') ? <><br /><strong>International? {o.recipient.country}</strong></> : null}
                                        {!o.recipient.phone || o.recipient.phone.length < 8 ? <><br /><span style={{ color: 'red' }}>No recipient phone number (or phone # too short)</span></> : null}
                                    </TableCell>
                                    <TableCell align="center">{o.createdAt.slice(0, 10)}</TableCell>
                                    <TableCell align="center">{o.createdAt === o.updatedAt ? null : o.updatedAt.slice(0, 10)}</TableCell>
                                    <TableCell align="center">{o.shipped}</TableCell>
                                    <TableCell align="center">{
                                        (() => {
                                            if(o.status === 0)
                                                return 'Unknown'
                                            else if (o.status === 1)
                                                return 'Pending'
                                            else if (o.status === 2)
                                                return 'Shipped'
                                            else
                                                return 'Cancelled'
                                        })()
                                    }</TableCell>
                                    <TableCell align="center"><Link style={{ textDecoration: 'none', color: 'blue' }} target="_blank" to={`/picking-slip/${o.id}`}>Packing Slip</Link></TableCell>
                                    <TableCell align="center"><Link style={{ textDecoration: 'none', color: 'blue' }} target="_blank" to={`/picking-ticket/${o.id}`}>Pick Ticket</Link></TableCell>
                                    {role === 'superadmin' || role === 'warehouse' ? <TableCell align="center"><Button variant="contained" color="primary" onClick={e => postShip(e, o.id)}>Ship</Button></TableCell> : null}
                                    <TableCell align="center">{
                                        (() => {
                                            if (o.tracking && o.actual_carrier === 'FedEx')
                                                return <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${o.tracking}`} target="_blank" rel="noreferrer">{o.tracking}</a>
                                            else if (o.tracking && o.actual_carrier === 'USPS')
                                                return <a href={`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${o.tracking}`} target="_blank" rel="noreferrer">{o.tracking}</a>
                                            else
                                                return <p>{o.tracking}</p>
                                        }
                                        )()
                                    }</TableCell>
                                    <TableCell align="center">{o.customer_reference}</TableCell>
                                    <TableCell align="center"><Button variant="contained" color={o.status === 3 ? 'primary' : 'secondary'} onClick={e => cancelOrder(e, o.status, o.id)}>{o.status === 3 ? 'Restore' : 'Cancel'}</Button></TableCell>
                                </TableRow>
                            ))
                        ) : <p>lines are empty</p>}

                    </TableBody>
                </Table>
            </TableContainer>
            {pages > 1 && <div className={classes.pagination}><Pagination count={pages} page={page} onChange={changePage} color="primary" /></div>}
            {/*********************************************************************************************** */}
           {role !== 'superadmin' && role !== 'warehouse' ? <h2 style={{marginTop: '2rem'}}>Low Stock Inventory</h2> : null}
            {role !== 'superadmin' && role !== 'warehouse' ? (
                <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Item #</TableCell>
                            <TableCell align="center">Case Quantity</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Stock (Case)</TableCell>
                            <TableCell align="center">Stock (Units)</TableCell>
                            <TableCell align="center">Split Case</TableCell>
                            <TableCell align="center">Re-order Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lowStock.length > 0 ? (
                            lowStock.map(i => (
                                <TableRow key={i.id}>
                                    <TableCell align="center">{i.name}</TableCell>
                                    <TableCell align="center">{i.number}</TableCell>
                                    <TableCell align="center">{i.case_quantity}</TableCell>
                                    <TableCell align="center">{i.description}</TableCell>
                                    <TableCell align="center">{i.qoh_case}</TableCell>
                                    <TableCell align="center" style={{backgroundColor: (i.qoh_case*i.case_quantity)+i.qoh_units < i.reorder_quantity ? 'red' : 'white'}}>
                                        {i.qoh_units}
                                    </TableCell>
                                    <TableCell align="center"><Button variant="contained" onClick={e => split(e, i.id)}>Split</Button></TableCell>
                                    <TableCell align="center">{i.reorder_quantity}</TableCell>                                    
                                </TableRow>
                            ))
                        ) : <p>lines are empty</p>}

                    </TableBody>
                </Table>
            </TableContainer>
            ) : null}
            </>)}
        </React.Fragment>
    )
}

export default Home;
