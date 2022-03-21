import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classes from './Sudo.module.scss';

const Sudo = () => {
    const role = useSelector(state => state.auth.role);
    const username = useSelector(state => state.auth.username)
    const sudoToken = useSelector(state => state.auth.sudoToken);
    const sudoUsername = useSelector(state => state.auth.sudoUsername);
    const location = useLocation();
    const pick = location.pathname.search('picking-')

    return (
        <React.Fragment>
        {pick !== 1 && (role === 'warehouse' || role === 'superadmin') && location.pathname !== '/members' && location.pathname !== '/test-label' ? <div className={classes.Sudo}>
            <p>You are a {role} {sudoToken !== null ? `User: ${username} performing actions as: ${sudoUsername}.` : null} <Link to="/sudo">Become someone else</Link></p>
        </div> : null}
        </React.Fragment>
    )
}

export default Sudo
