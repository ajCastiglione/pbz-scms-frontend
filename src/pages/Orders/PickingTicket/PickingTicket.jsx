import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import classes from "./PickingTicket.module.scss";

const PickingTicket = () => {
  const route = useRouteMatch();
  const [data, setData] = useState();
  const date = new Date();

  useEffect(() => {
    axios
      .get(`/order/packing-slip/${route.params.id}`)
      .then((res) => {
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
        <h1>Pick Ticket</h1>
        {data && data.order.tracking ? (
          <h1>
            {data.order.trackin} {data.order.actual_carrier}{" "}
            {data.order.actual_service}
          </h1>
        ) : null}
        {data && data.order.customer_reference ? (
          <h1>{data.order.customer_reference}</h1>
        ) : null}
        Ship To:
        {data && (
          <pre>
            {data.order?.recipient?.name ?? ""}
            <br />
            {data.order?.recipient?.contact ?? ""}
            <br />
            {data.order?.recipient?.street1 ?? ""}
            <br />
            {data.order?.recipient?.street2 ?? ""}
            <br />
            {data.order?.recipient?.city ?? ""},
            {data.order?.recipient?.state ?? ""}
            {data.order?.recipient?.postal ?? ""}
            <br />
            {data.order?.recipient?.country ?? ""}
            <br />
            {data.order?.recipient?.phone ?? ""}
            <br />
          </pre>
        )}
        {data && (
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
        )}
        <p>Thank you for your order.</p>
        <p>{date.toString()}</p>
      </div>
    </React.Fragment>
  );
};

export default PickingTicket;
