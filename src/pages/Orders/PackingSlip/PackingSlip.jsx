// React Imports
import React, { useEffect, useState } from "react";
// Axios
import axios from "axios";
// React-router
import { useRouteMatch } from "react-router";
// Styles
import classes from "./PackingSlip.module.scss";

const PackingSlip = () => {
  const route = useRouteMatch();
  const [data, setData] = useState();
  const date = new Date();

  useEffect(() => {
    axios
      .get(`/order/packing-slip/${route.params.id}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        window.print();
      })
      .catch((err) => {
        window.alert(err.response.data.message);
      });
  }, []);

  return (
    <React.Fragment>
      <div className={classes.Container}>
        <h1>Packing Slip</h1>
        {data && data.order.customer_reference ? (
          <h1>{data.order.customer_reference}</h1>
        ) : null}
        Ship To:
        {data ? (
          <pre>
            {data.order.recipient?.name ?? ""}
            <br />
            {data.order.recipient?.contact ?? ""}
            <br />
            {data.order.recipient?.street1 ?? ""}
            <br />
            {data.order.recipient?.street2 ?? ""}
            <br />
            {data.order.recipient?.city ?? ""},
            {data.order.recipient?.state ?? ""}{" "}
            {data.order.recipient?.postal ?? ""}
            <br />
            {data.order.recipient?.country ?? ""}
            <br />
            {data.order.recipient?.phone ?? ""}
            <br />
          </pre>
        ) : null}
        {data ? (
          <table>
            <tr>
              <th>Item Name</th>
              <th>Item #</th>
              <th>Description</th>
              <th># Cases</th>
              <th># Units</th>
            </tr>
            {data.lineItem.map((line) => (
              <tr key={line.id}>
                <td>{line?.inventory?.name ?? ''}</td>
                <td>{line?.inventory?.number ?? ''}</td>
                <td>{line?.inventory?.description ?? ''}</td>
                <td>{line?.quantity_cases ?? ''}</td>
                <td>{line?.quantity_units ?? ''}</td>
              </tr>
            ))}
          </table>
        ) : null}
        <p>Thank you for your order.</p>
        <p>{date.toString()}</p>
      </div>
    </React.Fragment>
  );
};

export default PackingSlip;
