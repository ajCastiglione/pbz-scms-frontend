import React from 'react';
import Import from '../../../components/Import/Import'

const ImportInventory = () => {
    return (
    <Import 
    link='/inventory/import' 
    importLabel="Inventory File (csv)" 
    redirectPath="/inventory?page=1"
    redirectLabel="Go to Inventory"/>
    )
}

export default ImportInventory
