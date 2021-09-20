import React from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';


const DataTable = (props) => {

  const discounts = props.rows;
  let changeDiscounts = discounts;

  const handleClick = (id) => {
    props.editClicked(id);
  }

  const split = (id) => {
    props.split(id);
  }

  const handleAdjustClick = (id) => {
    props.adjustClicked(id);
  }

  const discountChange = (e, row) => {
    changeDiscounts = discounts.map(p => 
      p.service === row.service ? {...p, discount: e.target.value} : p
    )
  }

  const adjustDiscount = (row) => {
    const editedObject = changeDiscounts.find(p => p.service === row.service)
    props.adjustDiscount(editedObject)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {props.headers.map(header => (
              <TableCell key={header} align="center">{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow key={row.id}>
              {
                Object.keys(row).map(key => {
                  switch (key) {
                    case 'id':
                      return null
                    case 'edit':
                      return <TableCell align="center"><Button variant="contained" color="primary" key={row['id']} onClick={(key) => handleClick(row['id'])}>Edit</Button></TableCell>
                    case 'role':
                      const role = new Object(row[key])
                      return <TableCell align="center">{role.name}</TableCell>
                    case 'adjust':
                      return <TableCell align="center" key={row['id']}><Button variant="contained" color="primary"  onClick={(key) => handleAdjustClick(row['id'])}>Adjust</Button></TableCell>
                    case 'discount':
                      return (<TableCell align="center">
                        <form key={row['id']}>
                        <TextField type="number" onChange={(e) => discountChange(e, row)} />
                        <Button variant="contained" color="primary" onClick={() => adjustDiscount(row)}>Adjust</Button>
                        </form>
                      </TableCell>)
                      case 'splitCase':
                        return <TableCell align="center" key={row['id']}><Button variant="contained" color="primary"  onClick={(key) => split(row['id'])}>split</Button></TableCell>
                    default:
                      return <TableCell align="center">{row[key]}</TableCell>
                  }

                })
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable;
