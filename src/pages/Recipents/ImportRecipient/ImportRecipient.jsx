import React from 'react';
import Import from '../../../components/Import/Import'

const ImportRecipient = () => {
    return (
    <Import 
    link='/recipient/import' 
    importLabel="Recipients File (csv)" 
    redirectPath="/recipent?page=1"
    redirectLabel="Go to Recipients"/>
    )
}

export default ImportRecipient
