import React from 'react';
import Import from '../../../components/Import/Import'

const ImportOrder = () => {
    return (
    <Import 
        link='/order/import' 
        importLabel="Orders File (csv)" 
        redirectPath="/order?page=1"
        redirectLabel="Go to Orders"/>
    )
}

export default ImportOrder;
