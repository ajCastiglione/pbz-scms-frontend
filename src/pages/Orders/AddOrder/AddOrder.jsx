// React Imports
import React, { useEffect, useState } from 'react';
// React-router Imports
import { useLocation, useHistory, Redirect } from 'react-router';
// Redux Imports
import * as actions from '../../../store/actions/index';
import { useDispatch, useSelector } from 'react-redux';
// Styles
import classes from './AddOrder.module.scss'
// Components
import Spinner from '../../../components/global/Spinner/Spinner';
import LargeSpinner from '../../../components/global/LargeSpinner/LargeSpinner';
// Material UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
// Axios
import axios from 'axios';


const AddOrder = () => {
    // URL Consts
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    // State Consts
    const [page, setPage] = useState(1);
    const [nextPageLoading, setNextPageLoading] = useState(false);

    // useEffect Hook
    useEffect(() => {
        if (location.state) {
            dispatch(actions.getOrderAndUpdate(location.state.orderId))
            dispatch(actions.getInventory(page))
        }
    }, [])
    // Redux State getters
    const lines = useSelector(state => state.orders.ordersLines)
    const [newLines, setNewLines] = useState(lines)
    const pages = useSelector(state => Math.ceil(state.inventory.total / 10))
    const loading = useSelector(state => state.orders.loading)
    const inventory = useSelector(state => state.inventory.inventory)
    // Refactoring lines to present
    const presentRows = [];
    inventory.forEach(row => {        
        presentRows.push({
            id: row.id,
            name: row.name,
            item: row.number,
            caseQuantity: row.case_quantity,
            desc: row.description,
            stockCase: row.qoh_case,
            stockUnits: row.qoh_units,
            caseWeight: row.case_weight,
            reOrder: row.reorder_quantity,
            length: row.length,
            width: row.width,
            height: row.height,
            shipReady: row.ship_ready ? 'Yes' : 'No',
            add: 'Add to order'

        })
    });

    useEffect(() => {
        setNewLines(lines);
    }, [lines])

    const addOrder = (e, invId) => {
        
        const data = {
            quantity_cases: 0,
            quantity_units: 0,
            inventoryId: invId,
            orderId: location.state.orderId,
        }
        dispatch(actions.addInventory(data))
    }

    const editCases = (e, id, type) => {
        if (type === 'quantity_cases') {
            setNewLines(newLines.map(line =>
                line.id === id
                    ? { ...line, quantity_cases: e.target.value }
                    : line
            ))
        }else{
            setNewLines(newLines.map(line =>
                line.id === id
                    ? { ...line, quantity_units: e.target.value }
                    : line
            ))
        }
        console.log(newLines)
    }

    const saveOrder = (id) => {
        newLines.map(line => {
            if (line.id === id) {
                const data = {
                    quantity_cases: line.quantity_cases,
                    quantity_units: line.quantity_units,
                    inventoryId: line.inventory.id,
                    orderId: location.state.orderId,
                }
                dispatch(actions.addInventory(data))
            }
        })
    }

    const removeOrder = (id) => {
        dispatch(actions.removeOrder(id, location.state.orderId))
    }

    const changePage = (e, value) => {
        setPage(value);
        dispatch(actions.getInventory(page))
    }
    // On order complete save state and navigate to next page
    const orderComplete = () => {
        setNextPageLoading(true)
        axios.post('/order/add-update/select-ship-method', {
            orderId: location.state.orderId
        })
            .then(res => {
                
                setNextPageLoading(false)
                
                if (res.data.shipRayes.length < 1) {
                    window.alert("Order can't be shipped (Wrong recipient info)")
                    return
                } else {
                    history.push('/ship-method', res.data)
                }
            })
            .catch(err => {
                setNextPageLoading(false)
                window.alert(err.response.data.message)
            })

    }


    return (
        <React.Fragment>
            {location.state ? (<div>
                <h2>Recipient: {location.state.name} {location.state.contact} | {location.state.country}</h2>
                <h1>Items on Order</h1>
                {loading ? <LargeSpinner /> : (<TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Number</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Quantity (Cases)</TableCell>
                                <TableCell align="center">Quantity (Units)</TableCell>
                                <TableCell align="center">Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lines.length > 0 ? (
                                lines.map((row, i) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.inventory.number}</TableCell>
                                        <TableCell align="center">{row.inventory.name}</TableCell>
                                        <TableCell align="center">{row.inventory.description}</TableCell>
                                        <TableCell align="center">
                                            <input type="number" style={{ width: '4rem' }} value={newLines[i]?.quantity_cases} onChange={e => editCases(e, row.id, 'quantity_cases')} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <input type="number" style={{ width: '4rem' }} value={newLines[i]?.quantity_units} onChange={e => editCases(e, row.id, 'quantity_units')} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} onClick={() => saveOrder(row.id)}>Save</Button>
                                            <Button variant="contained" color="secondary" onClick={() => removeOrder(row.id)}>Remove from Order</Button>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))
                            ) : <p>lines are empty</p>}

                        </TableBody>
                    </Table>
                </TableContainer>)}
                {lines.length > 0 ? <Button variant="contained" color="primary" style={{ margin: '1rem' }} onClick={orderComplete}>{nextPageLoading ? <Spinner /> : 'Order Complete'}</Button> : null}

                {/************************************************************************ */}

                <h1>Add more to the order.</h1>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Item#</TableCell>
                                <TableCell align="center">Case Quantity</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Stock (Case)</TableCell>
                                <TableCell align="center">Stock (Units)</TableCell>
                                <TableCell align="center">Case Weight (pounds)</TableCell>
                                <TableCell align="center">Re-order Quantity</TableCell>
                                <TableCell align="center">Length (inches)</TableCell>
                                <TableCell align="center">Width (inches)</TableCell>
                                <TableCell align="center">Height (inches)</TableCell>
                                <TableCell align="center">Ship Ready</TableCell>
                                <TableCell align="center">Add</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventory.map((i) => (
                                <TableRow>
                                    <TableCell align="center">{i.name}</TableCell>
                                    <TableCell align="center">{i.number}</TableCell>
                                    <TableCell align="center">{i.case_quantity}</TableCell>
                                    <TableCell align="center">{i.description}</TableCell>
                                    <TableCell align="center">{i.qoh_case}</TableCell>
                                    <TableCell align="center" style={{
                                        backgroundColor: ((i.qoh_case * i.case_quantity) + i.qoh_units) < i.reorder_quantity ? 'red' : 'white'
                                    }}>{i.qoh_units}</TableCell>
                                    <TableCell align="center">{i.case_weight}</TableCell>
                                    <TableCell align="center">{i.reorder_quantity}</TableCell>
                                    <TableCell align="center">{i.length}</TableCell>
                                    <TableCell align="center">{i.width}</TableCell>
                                    <TableCell align="center">{i.height}</TableCell>
                                    <TableCell align="center">{i.ship_ready ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="center"><Button variant="contained" color="primary" onClick={(e) => addOrder(e, i.id)}>Add to Orders</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>) : <Redirect to="/order?page=1" />}
            {pages > 1 && <div className={classes.pagination}><Pagination count={pages} page={page} onChange={changePage} color="primary" /></div>}
        </React.Fragment>
    )
}

export default AddOrder
