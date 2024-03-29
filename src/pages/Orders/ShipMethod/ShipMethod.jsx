// React Imports
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// React-router imports
import { Redirect } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";
// Styles
import classes from "./ShipMethod.module.scss";
// Material Ui
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

import LargeSpinner from "../../../components/global/LargeSpinner/LargeSpinner";

// Axios
import axios from "axios";

const ShipMethod = () => {
    // Hooks consts
    const location = useLocation();
    const history = useHistory();
    const order = location?.state?.order;
    // State consts
    const lineItems = location.state.lineItem;
    const shipRates = location.state.shipRates;
    const [insuranceValue, setInsuranceValue] = useState(
        order?.insurance_value || ""
    );
    const [signature, setSignature] = useState(
        order.signature_option || "NONE"
    );
    const selectedShipping = location?.state?.shipRates?.find(
        shipRate =>
            shipRate.carrier === order?.requested_carrier &&
            shipRate.service === order?.requested_service
    );
    const actualSelectedShipping = location?.state?.shipRates?.find(
        shipRate =>
            shipRate.carrier === order?.actual_carrier &&
            shipRate.service === order?.actual_service
    );
    const [shippingMethod, setShippingMethod] = useState([
        actualSelectedShipping?.carrier ||
            selectedShipping?.carrier ||
            location.state.shipRates[0].carrier,
        actualSelectedShipping?.service ||
            selectedShipping?.service ||
            location.state.shipRates[0].service,
    ]);
    const [customerReference, setCustomerReference] = useState(
        order?.customer_reference || ""
    );
    const [notify, setNotify] = useState(order?.notify_recipient || false);
    const [email, setEmail] = useState(order?.additionally_notify || "");
    const [company, setCompany] = useState(
        order?.blind_company || location.state.order.user.company
    );
    const [phone, setPhone] = useState(
        order?.blind_phone || location.state.order.user.phone
    );
    const discounts = location.state.descounTable;
    const loading = useSelector(state => state.orders.loading);
    const [nextPageLoading, setNextPageLoading] = useState(false);

    const submitShipment = () => {
        const data = {
            orderId: location.state.order.id,
            requested_service: shippingMethod[1],
            requested_carrier: shippingMethod[0],
            signature_option: signature,
            additionally_notify: email,
            blind_company: company,
            blind_phone: phone,
            customer_reference: customerReference,
            notify_recipient: notify,
            insurance_value: insuranceValue,
        };

        setNextPageLoading(true);

        axios
            .post("/order/add-update/pick-rate", data)
            .then(res => {
                setNextPageLoading(false);

                // history.push('/order?page=1')
                history.push("/order/add-update", {
                    shipConfirmation: "orderCreated",
                    order: location.state.order,
                    total_packages: location.state.total_packages,
                    total_weight: location.state.total_weight,
                    insurance_cost: location.state.insurance_cost,
                    lineItems: location.state.lineItem,
                });

                // <h2>Recipient: {location.state.order.recipient.name} {location.state.order.recipient.contact} | {location.state.order.recipient.country}</h2>
                // <p>Total Weight: {Number(location.state.total_weight).toFixed(2)}</p>
                // <p>Total Packages: {location.state.total_packages}</p>
                // <p>Insurance Cost: {location.state.insurance_cost} (built in to rates below)</p>
            })
            .catch(err => {
                setNextPageLoading(false);
                window.alert(err.response.data.message);
            });
    };

    let listRate = [];
    shipRates.forEach(rate => {
        discounts.forEach(discount => {
            if (
                rate.carrier === discount.carrier &&
                rate.service === discount.service
            ) {
                listRate.push({
                    ...rate,
                    value: Number(
                        rate.list_rate * (1 - discount.discount / 100) +
                            location.state.insurance_cost
                    ).toFixed(2),
                });
            }
        });
        // Add list rates for carriers that don't have discounts
        if (
            !discounts.some(
                discount =>
                    rate.carrier === discount.carrier &&
                    rate.service === discount.service
            )
        ) {
            listRate.push({
                ...rate,
                value: Number(
                    rate.list_rate + location.state.insurance_cost
                ).toFixed(2),
            });
        }
    });
    return (
        <div>
            {loading ? (
                <LargeSpinner />
            ) : location.state ? (
                <div>
                    <div className={classes.RecipientDetails}>
                        <h2>
                            Recipient: {location.state.order.recipient.name}{" "}
                            {location.state.order.recipient.contact} |{" "}
                            {location.state.order.recipient.country}
                        </h2>
                        <p>
                            Total Weight:{" "}
                            {Number(location.state.total_weight).toFixed(2)}
                        </p>
                        <p>Total Packages: {location.state.total_packages}</p>
                        <p>
                            Insurance Cost: {location.state.insurance_cost}{" "}
                            (built in to rates below)
                        </p>
                    </div>
                    <p>Shipment contents: </p>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">
                                        Item Name
                                    </TableCell>
                                    <TableCell align="center">Item #</TableCell>
                                    <TableCell align="center">
                                        Description
                                    </TableCell>
                                    <TableCell align="center">
                                        # (Cases)
                                    </TableCell>
                                    <TableCell align="center">
                                        # (Units)
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lineItems.length > 0 ? (
                                    lineItems.map(line => (
                                        <TableRow key={line.id}>
                                            <TableCell align="center">
                                                {line.inventory.name}
                                            </TableCell>
                                            <TableCell align="center">
                                                {line.inventory.number}
                                            </TableCell>
                                            <TableCell align="center">
                                                {line.inventory.description}
                                            </TableCell>
                                            <TableCell align="center">
                                                {line.quantity_cases}
                                            </TableCell>
                                            <TableCell align="center">
                                                {line.quantity_units}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <p>lines are empty</p>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className={classes.Form}>
                        <p>
                            With FedEx or USPS Priority Mail parcel insurance
                            for the first $100.00 is included at no extra cost.
                            Additional insurance is available at additional cost
                            (shown on the next page). To add additional
                            insurance input the total declared value of this
                            shipment. Leave blank for default insurance (if any)
                        </p>
                        <input
                            type="number"
                            style={{ height: "2rem", marginTop: "1rem" }}
                            value={insuranceValue}
                            onChange={e => setInsuranceValue(e.target.value)}
                        />
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="gender"
                                name="shipMethod"
                                value={signature}
                                onChange={e => setSignature(e.target.value)}>
                                <FormControlLabel
                                    value="NONE"
                                    control={<Radio />}
                                    label="No Signature Required"
                                />
                                <FormControlLabel
                                    value="DIRECT_SIGNATURE"
                                    control={<Radio />}
                                    label="Direct Signature Required (anyone at delivery address)"
                                />
                                <FormControlLabel
                                    value="ADULT_SIGNATURE"
                                    control={<Radio />}
                                    label="Adult Signature required (at delivery address, must show ID)"
                                />
                            </RadioGroup>
                        </FormControl>
                        <p>
                            Note: Additional Carrier fees for signature required
                            services will be applied when shipment is processed.
                        </p>
                        <div className={classes.Form__shipment}>
                            <div>
                                <p>Please select a shipping method</p>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center"></TableCell>
                                                <TableCell align="center">
                                                    Carrier
                                                </TableCell>
                                                <TableCell align="center">
                                                    Service
                                                </TableCell>
                                                <TableCell align="center">
                                                    List Rate
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {listRate.length > 0 ? (
                                                listRate.map(rate => (
                                                    <TableRow key={rate.id}>
                                                        <TableCell align="center">
                                                            <input
                                                                type="radio"
                                                                checked={
                                                                    shippingMethod[0] ===
                                                                        rate.carrier &&
                                                                    shippingMethod[1] ===
                                                                        rate.service
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={e =>
                                                                    setShippingMethod(
                                                                        [
                                                                            rate.carrier,
                                                                            rate.service,
                                                                        ]
                                                                    )
                                                                }
                                                                value={rate}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {rate.carrier}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {rate.service}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {rate.value}{" "}
                                                            {
                                                                rate.retail_currency
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <p>lines are empty</p>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div className={classes.subForm}>
                                <label>Shipment Identifier/Reference</label>
                                <input
                                    type="text"
                                    value={customerReference}
                                    onChange={e =>
                                        setCustomerReference(e.target.value)
                                    }
                                />
                                <p>
                                    shipment recipient:{" "}
                                    {location.state.order.recipient.email}
                                </p>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="checkedB"
                                            color="primary"
                                            onChange={() => setNotify(!notify)}
                                            checked={notify}
                                        />
                                    }
                                    label="Check to receive a copy of this shipment's notifications"
                                />
                                <label>Additionally Notify (email)</label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <label>Ship From Company</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                />
                                <label>Ship From Phone</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submitShipment}>
                            Submit Shipment
                        </Button>
                    </div>
                </div>
            ) : (
                <Redirect to="/order?page=1" />
            )}
        </div>
    );
};

export default ShipMethod;
