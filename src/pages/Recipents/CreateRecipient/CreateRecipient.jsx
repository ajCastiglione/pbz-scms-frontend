// React Imports
import React, { useState } from 'react';
// Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/actions/index';
// React-router imports
import { useLocation, useHistory } from 'react-router-dom';
// Components
import Spinner from '../../../components/global/Spinner/Spinner';
// Material UI
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// Styles
import classes from './CreateRecipient.module.scss'

const CreateRecipient = () => {
    // Hooks Consts
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch()
    // State consts
    const [name, setName] = useState(location.state ? location.state.name : '');
    const [contact, setContact] = useState(location.state ? location.state.contact : '');
    const [phone, setPhone] = useState(location.state ? location.state.phone : '');
    const [email, setEmail] = useState(location.state ? location.state.email : '');
    const [street1, setStreet1] = useState(location.state ? location.state.street1 : '');
    const [street2, setStreet2] = useState(location.state ? location.state.street2 : '');
    const [city, setCity] = useState(location.state ? location.state.city : '');
    const [state, setState] = useState(location.state ? location.state.state : '')
    const [postal, setPostal] = useState(location.state ? location.state.postal : '');
    const [country, setCountry] = useState(location.state ? location.state.country : '');

    const createRecipient = (event) => {
        event.preventDefault();
        let data = {
            name,
            contact,
            phone,
            email,
            street1,
            street2,
            city,
            state,
            postal,
            country
        }
        if (location.state){
            data = {...data, id: location.state._id};
            dispatch(actions.createRecipient(data))
        }else{
            dispatch(actions.createRecipient(data))
        }
    }

    const goBack = () => {
        history.goBack();
    }
    // Redux State getters
    const message = useSelector(state => state.recipients.message)
    const error = useSelector(state => state.recipients.error)
    const loading = useSelector(state => state.recipients.loading)

    return (
        <React.Fragment>
            <Box width="100%" display="flex" justifyContent="center" p={2} >

                <form onSubmit={createRecipient} className={classes.Form}>
                    <h1>Create Recipient</h1>
                    <TextField width="6" label="Recipient name" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Contact name " value={contact} onChange={(e) => setContact(e.target.value)} />
                    <TextField label="Phone number " value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Street 1" value={street1} onChange={(e) => setStreet1(e.target.value)} />
                    <TextField label="Street 2" value={street2} onChange={(e) => setStreet2(e.target.value)} />
                    <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    <TextField label="State" value={state} onChange={(e) => setState(e.target.value)} />
                    <TextField label="Zip or Postal Code" value={postal} onChange={(e) => setPostal(e.target.value)} />
                    <TextField label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                    {message !== '' && <p style={{color: 'green'}}>{message}</p>}
                    {error !== '' && <p style={{color: 'red'}}>{error}</p>}
                    {message || error ? <p style={{cursor: 'pointer', color: 'blue'}} onClick={goBack}>Go back</p> : null}
                    <Button variant="contained" color="primary" type="submit">
                        {loading ? <Spinner /> : 'Submit'}
                    </Button>
                </form>

            </Box>
        </React.Fragment>
    )
}

export default CreateRecipient;
