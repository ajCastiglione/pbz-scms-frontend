import React from 'react';
import classes from './Spinner.module.scss'

const Spinner = ({size, color}) => {
    return (
        <div className={classes.loader}>Loading...</div>
    )
}

export default Spinner
