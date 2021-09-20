import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import * as actions from '../../store/actions/index';

import DataTable from '../../components/global/DataTable/DataTable';
import LargeSpinner from '../../components/global/LargeSpinner/LargeSpinner';

const Discounts = () => {
    const route = useRouteMatch();
    const dispatch = useDispatch();
    const id = route.params.id;

    useEffect(() => {
        dispatch(actions.getDiscounts(id))
    }, [])

    const headers = ['Carrier', 'Service', 'Discount Precentage', 'Adjust'];
    const discounts = useSelector(state => state.discounts.discounts);
    const loading = useSelector(state => state.discounts.loading);
    const presentRows = [];
    discounts.forEach(row => {
        presentRows.push({
            id: id,
            carrier: row.carrier,
            service: row.service,
            showDiscount: row.discount,
            discount: row.discount,
        })
    });

    const adjustDiscount = (disc) => {
        const discount = {
            carrier: disc.carrier,
            service: disc.service,
            discount: disc.discount,
            id: disc.id
        }
        dispatch(actions.addDiscount(discount))
    }


    return (
        <React.Fragment>
            {loading ? <LargeSpinner /> : <DataTable headers={headers} rows={presentRows} adjustDiscount={adjustDiscount}/>}
        </React.Fragment>
    )
}

export default Discounts
