// React Imports
import React, { useState } from 'react';
// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../store/actions';
// React-router Imports
import { useLocation, useHistory } from 'react-router';
// Componets
import Spinner from '../../../components/global/Spinner/Spinner';
// Material UI 
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
// Styles
import classes from './CreateUser.module.scss'


const CreateUser = () => {
    // Hooks consts
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch()
    // State consts
    const newDate = new Date()
    const [userName, setUserName] = useState(location.state ? location.state.username : '');
    const [firstName, setFirstName] = useState(location.state ? location.state.first_name : '');
    const [lastName, setLastName] = useState(location.state ? location.state.last_name : '');
    const [company, setCompany] = useState(location.state ? location.state.company : '');
    const [phone, setPhone] = useState(location.state ? location.state.phone : '');
    const [email, setEmail] = useState(location.state ? location.state.email : '');
    const [password, setPassword] = useState('');
    const [date, setDate] = useState(location.state ? location.state.confirmed_at : newDate.toISOString())
    const [isActive, setIsActive] = useState(location.state ? location.state.is_enabled : false)
    const [isEmail, setIsEmail] = useState(location.state ? location.state.send_tracking_emails_by_default : false)

    const addUser = () => {
        let userData = {
            username: userName,
            email: email,
            password: password,
            fname: firstName,
            lname: lastName,
            phone: phone,
            companyName: company,
            is_enabled: isActive,
            send_tracking_emails_by_default: isEmail,
            confirmed_at: date
        }
        if (location.state) {
            userData = { ...userData, id: location.state.id };
            dispatch(actions.addUser(userData))
        } else {
            dispatch(actions.addUser(userData))
        }
    }

    const goBack = () => {
        history.goBack();
    }

    const message = useSelector(state => state.users.message)
    const error = useSelector(state => state.users.error)
    const loading = useSelector(state => state.users.loading)

    return (
        <React.Fragment>
            <Box width="100%" display="flex" justifyContent="center" p={2} >

                <form onSubmit={e => e.preventDefault()} className={classes.Form}>
                    <h1>Add User</h1>
                    <TextField width="6" label="Username (must be uniqe)" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <TextField label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
                    <TextField label="Phone (must be unique)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <TextField label="Email (must be unique)" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                    <TextField label="Confirmed At" value={date} onChange={(e) => setDate(e.target.value)} />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="checkedB"
                                color="primary"
                                onChange={() => setIsActive(!isActive)}
                                checked={isActive}
                            />
                        }
                        label="Is Active"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="checkedB"
                                color="primary"
                                onChange={() => setIsEmail(!isEmail)}
                                checked={isEmail}
                            />
                        }
                        label="Send tracking emails to customers by default"
                    />
                    {message !== '' ? <p style={{ color: 'green', textTransform: 'capitalize' }}>{message}</p> : null}
                    {error !== '' ? <p style={{ color: 'red', textTransform: 'capitalize' }}>{error}</p> : null}
                    {message || error ? <p style={{ cursor: 'pointer', color: 'blue' }} onClick={goBack}>Go back</p> : null}
                    <Button variant="contained" color="primary" onClick={addUser}>
                        {loading ? <Spinner /> : 'Submit'}
                    </Button>
                </form>

            </Box>
        </React.Fragment>
    )
}

export default CreateUser;
