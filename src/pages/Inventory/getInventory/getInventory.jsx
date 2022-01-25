// React Imports
import React, { useEffect, useState } from 'react';
// Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions/index'
// React Router Imports
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
// Query string package to extract queries from URL
import queryString from 'query-string';
// Styles
import classes from './getInventory.module.scss';
// Components
import LargeSpinner from '../../../components/global/LargeSpinner/LargeSpinner';
import DataTable from '../../../components/global/DataTable/DataTable';
// Material UI imports
import Pagination from '@material-ui/lab/Pagination';
// Axios
import axios from 'axios';


const GetInventory = () => {
    // consts for routing and getting url info
    const dispatch = useDispatch()
    const history = useHistory()
    const route = useRouteMatch()
    const { search } = useLocation()
    const values = queryString.parse(search)
    // state consts
    const [page, setPage] = useState(parseInt(values.page))
    // useEffect hook to get inventory items
    useEffect(() => {
        dispatch(actions.getInventory(page))
    }, [page])
    // Redux state getters
    const pages = useSelector(state => Math.ceil(state.inventory.total/10))
    const rows = useSelector(state => state.inventory.inventory)
    const loading = useSelector(state => state.inventory.loading);
    // Refactoring inventory data to present it
    const headers = ['Edit', 'Name', 'Item #', 'Case Quantity', 'Description', 'Stock (Case)', 'Stock (Units)', 'Total Units', 'Split Case', 'Case Weight (pounds)', 'Re-order Quantity', 'Length (inches)', 'Width (inches)', 'Height (inches)', 'Ship Ready']
    const presentRows = [];
    rows.forEach(row => {
        presentRows.push({
            id: row.id,
            edit: 'Edit',
            name: row.name,
            item: row.number,
            caseQuantity: row.case_quantity,
            description: row.description,
            stockCase: row.qoh_case,
            stockUnits: row.qoh_units,
            totalUnit: row.qoh_case*row.case_quantity+row.qoh_units,
            splitCase: 'splitCase',
            caseWeight: row.case_weight,
            reOrder: row.reorder_quantity,
            length: row.length,
            width: row.width,
            height: row.height,
            shipReady: row.ship_ready ? 'Ready' : 'Not Ready'
        })
    });
    // Changing page handler
    const changePage = (event, value) => {
        history.replace(`/inventory?page=${value}`)
        setPage(value)
    }

    const editEnventory = (id) => {
        const filteredInv = rows.filter(row => row.id === id);
        const inv = filteredInv[0]
        history.push(`${route.path}add-update/${id}`, inv)
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
            {loading ? <LargeSpinner /> : <DataTable rows={presentRows} headers={headers} editClicked={editEnventory} split={split}/>}
            {pages > 1 && <div className={classes.pagination}><Pagination count={pages} page={page} onChange={changePage} color="primary" /></div>}
        </React.Fragment>
    );
}

export default GetInventory
