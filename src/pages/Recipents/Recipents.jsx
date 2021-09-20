import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';

import GetRecipient from './GetRecipient/GetRecipient';
import CreateRecipient from './CreateRecipient/CreateRecipient';
import ImportRecipient from './ImportRecipient/ImportRecipient';
import UploadHistory from './UploadHistory/UploadHistory';
import SubNav from '../../components/global/SubNav/SubNav'

const Recipents = () => {


const route = useRouteMatch()

const routes = [
    {name: 'Recipients', path: '/?page=1'},
    {name: 'Create New Recipient', path:'/add-update/null'},
    {name: 'Import Recipients', path:'/import'},
    {name: 'Upload history', path:'/history?page=1'},
]

    return (
        <React.Fragment>
            <SubNav subRoutes={routes}></SubNav>
            <Switch>
                <Route path={`${route.path}/`} component={GetRecipient} exact></Route>
                <Route path={`${route.path}/add-update/:id`} component={CreateRecipient}></Route>
                <Route path={`${route.path}/import`} component={ImportRecipient}></Route>
                <Route path={`${route.path}/history`} component={UploadHistory}></Route>
            </Switch>
        </React.Fragment>
    )
}

export default Recipents
