// React Imports
import React, { useEffect, useState } from 'react';
// Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions/index';
// React-router Imports
import { useHistory, useRouteMatch, useLocation } from 'react-router';
// query-string package to extract queries from URL
import queryString from 'query-string';
// Styles
import classes from './GetRecipient.module.scss';
// Components
import LargeSpinner from '../../../components/global/LargeSpinner/LargeSpinner';
import DataTable from '../../../components/global/DataTable/DataTable';
// Material UI
import Pagination from '@material-ui/lab/Pagination';

const GetRecipient = () => {
    // Hooks Consts
    const dispatch = useDispatch();
    const history = useHistory();
    const route = useRouteMatch();
    const { search } = useLocation()
    const values = queryString.parse(search)
    const [page, setPage] = useState(Number(values.page))

    useEffect(() => {
        dispatch(actions.getRecipients(page))
    }, [page])

    // Redux state getters
    const rows = useSelector(state => state.recipients.recipients);
    const loading = useSelector(state => state.recipients.loading);
    const pages = useSelector(state => Math.ceil(state.recipients.total/10))
    // Refactoring Recipients to present
    const headers = ['Edit', 'Name', 'Contact', 'Phone', 'Email', 'Address']
    const presentRows = [];
    if(rows.length > 0){
        rows.forEach(row => {
            presentRows.push({
                id: row._id,
                edit: 'Edit',
                name: row.name,
                contact: row.contact,
                phone: row.phone,
                email: row.email,
                address: row.street1,
            })
        });
    }

    const changePage = (event, value) => {
        history.replace(`/recipient?page=${value}`)
        setPage(value)
    }

    const editRecipient = (id) => {
        const filteredRecipient = rows.filter(row => row._id === id)
        history.push(`${route.path}add-update/${id}`, filteredRecipient[0])
    }

    return (
        <React.Fragment>
            {loading ? <LargeSpinner /> : <DataTable rows={presentRows} headers={headers} editClicked={editRecipient} />}
            {pages > 1 && <div className={classes.pagination}><Pagination count={pages} page={page} onChange={changePage} color="primary" /></div>}
        </React.Fragment>
    )
}

export default GetRecipient
