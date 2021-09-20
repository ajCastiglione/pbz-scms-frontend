import React from 'react';
import { Link } from 'react-router-dom';

const Members = () => {
    return (
        <React.Fragment>
            <div style={{display: 'flex', flexDirection: 'column', padding: '1rem'}}>
                <p>Need to print ZPL files on Zebra printers? <a href="http://www.lerup.com/printfile/descr.html" target="_blank" rel="noreferrer"  style={{textDecoration: 'none', color: 'blue'}}>Download PrintFile Software</a>. You can set this software to automatically open the .zpl files produced for labels.</p>
                <ul style={{listStyle: 'none'}}>
                    <li><Link to="/recipient?page=1" style={{textDecoration: 'none', color: 'blue'}}>Recipients (Address Book)</Link></li>
                    <li><Link to="/inventory?page=1" style={{textDecoration: 'none', color: 'blue'}}>Inventory</Link></li>
                </ul>
            </div>

        </React.Fragment>
    )
}

export default Members
