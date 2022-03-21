import React, { useEffect, useState } from 'react';
import axios from 'axios'

const TestLabel = () => {
    const [id, setId] = useState('');
    const [img, setImg] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        axios.get('/test-lable')
            .then(res => {
                setLoading(false)
                setId(res.data.tracking_code);
                setImg(res.data.label)
            })
            .catch(err => {
                setLoading(false)
                setMessage(err.response.data.message)
            })

    }, [])

    return (
        <React.Fragment>
            <div style={{display: 'flex',flexDirection: 'column' ,alignItems: 'center', padding: '1rem'}}>
                {message ? <h1>{message}</h1> : null}
                <h3>Test label: {loading && 'Loading...'}{id}</h3>
                <img src={img} alt="Test label" style={{ width: '50%', height: '50%' }} />
            </div>
        </React.Fragment>
    )
}

export default TestLabel
