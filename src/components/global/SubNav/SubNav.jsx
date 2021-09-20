import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import classes from './SubNav.module.scss';

const SubNav = (props) => {
    const route = useRouteMatch();

    return (
        <nav className={classes.SubNav}>
        <ul className={classes.SubNav__list}>
            {props.subRoutes.map(subRoute => {
                return (
                    <li className={classes.SubNav__list__item} key={subRoute.name}><NavLink to={`${route.path}${subRoute.path}`} activeClassName={classes.activeRoute} exact>{subRoute.name}</NavLink></li>
                )
            })}
        </ul>
    </nav>
    )
}

export default SubNav
