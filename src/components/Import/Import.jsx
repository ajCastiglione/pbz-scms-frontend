// React Imports
import React, {useState} from 'react';
// React Router
import { Link } from 'react-router-dom'
// Styles
import classes from './Import.module.scss';
// Material UI
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
// Components
import Spinner from '../../components/global/Spinner/Spinner'
// Axios
import axios from 'axios';

const ImportRecipient = (props) => {
    //State consts
    const [selectedFile, setSelectedFile] = useState();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const uploadFile = () => {
        setLoading(true)
        const form = new FormData();
        form.append('uploads', selectedFile)
        axios.post(props.link, form)
        .then(res => {
            console.log(res)
            if(res.data.fail){
                setError(res.data.errors[0])
                setLoading(false)
                return
            }
            setLoading(false)
            setMessage('File Imported Successfully')
            setError('')
        })
        .catch(err => {
            window.alert(err.response.data.message);
            setLoading(false)
            setError('An error occured please try again');
            setMessage('')
        })
    }

    return (
        <div className={classes.import}>
            <Alert severity="info" style={{ width: '100%' }}>This expects plain vanilla CSV files, not UTF-8 encoded CSV files, not Excel files.</Alert>
            <form>
                <label>{props.importLabel}</label>
                <input type="file" onChange={e => onFileChange(e)}/>
                {message ? <p style={{color: 'green'}}>{message} <Link to={props.redirectPath}>{props.redirectLabel}</Link></p> : null}
                {error ? <p style={{color: 'red'}}>{error}</p> : null}
                <Button variant="contained" color="primary" onClick={uploadFile}>{loading ? <Spinner /> : 'Upload'}</Button>
            </form>
        </div>
    )
}

export default ImportRecipient
