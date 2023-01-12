import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import SubNav from "../../components/global/SubNav/SubNav";
import GetUsers from "./GetUsers/GetUsers";
import CreateUser from "./CreateUser/CreateUser";

const Users = () => {
    const route = useRouteMatch();

    const routes = [
        { name: "Users", path: "/?page=1&active=all" },
        { name: "Create or Edit", path: "/add-update/null" },
    ];

    return (
        <div>
            <SubNav subRoutes={routes}></SubNav>
            <Switch>
                <Route
                    path={`${route.path}/`}
                    component={GetUsers}
                    exact></Route>
                <Route
                    path={`${route.path}/add-update/:id`}
                    component={CreateUser}></Route>
            </Switch>
        </div>
    );
};

export default Users;
