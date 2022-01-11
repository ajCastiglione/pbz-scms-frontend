import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import SubNav from '../../components/global/SubNav/SubNav';
import GetOrders from './GetOrders/GetOrders';
import CreateOrder from './CreateOrder/CreateOrder';
import ImportOrder from './ImportOrder/ImportOrder';
import ExportOrder from './ExportOrder/ExportOrder';
import UploadHistory from './UploadHistory/UploadHistory'

const Order = () => {
    const route = useRouteMatch();
    const subRoutes = [
        {name: 'Orders', path:'/?page=1'},
        {name: 'Create New Order', path:'/add-update'},
        {name: 'Import Order', path:'/import'},
        {name: 'Export Shipped Orders', path:'/export'},
        {name: 'Upload History', path:'/history'},
    ]

    return (
        <React.Fragment>
            <SubNav subRoutes={subRoutes}></SubNav>
            <Switch>
                <Route path={`${route.path}/`} component={GetOrders} exact></Route>
                <Route path={`${route.path}/add-update`} component={CreateOrder} exact></Route>
                <Route path={`${route.path}/import`} component={ImportOrder} exact></Route>
                <Route path={`${route.path}/export`} component={ExportOrder} exact></Route>
                <Route path={`${route.path}/history`} component={UploadHistory} exact></Route>
            </Switch>
        </React.Fragment>
    )
}

export default Order
