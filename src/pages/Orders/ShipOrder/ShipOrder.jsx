// React Imports
import React, { useState, useRef } from "react";
// React-Router Imports
import { useLocation, useHistory } from "react-router-dom";
// Styles
import classes from "./ShipOrder.module.scss";
// Material UI
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";
// Axios
import axios from "axios";

const ShipOrder = () => {
    // Hooks consts
    const location = useLocation();
    // State Consts
    let boxes = [];
    console.log(location.state)
    location.state.box?.forEach(box => {
        boxes.push({ weight: box[1] });
    });
    const [showBoxes, setShowBoxes] = useState(boxes);
    const [newData, setNewData] = useState(boxes);
    const [carrier, setCarrier] = useState("");
    const [service, setService] = useState("");
    const [tracking, setTracking] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [customsDescInputs, setCustomsDescInputs] = useState([]);
    const [customsValueInputs, setCustomsValueInputs] = useState([]);
    const [customsInfo, setCustomsInfo] = useState([]);
    const history = useHistory();
    // Refs
    const customsDescRef = useRef();
    const customsValueRef = useRef();

    const addRows = () => {
        setShowBoxes([...showBoxes, { weight: 0 }]);
        setNewData([...newData, { weight: 0 }]);
    };

    const removeRows = () => {
        setShowBoxes(showBoxes.slice(0, -1));
        setNewData(newData.slice(0, -1));
    };

    const changeWeight = (e, editedIndex) => {
        setNewData(
            newData.map((box, index) =>
                index === editedIndex
                    ? { ...box, weight: parseInt(e.target.value) }
                    : box
            )
        );
    };

    const changeDesc = (e, editedIndex) => {
        setCustomsInfo(prev => {
            prev[editedIndex] = {
                ...prev[editedIndex],
                customs_desc: e.target.value,
            };
            return prev;
        });
    };

    const changeValue = (e, editedIndex) => {
        setCustomsInfo(prev => {
            prev[editedIndex] = {
                ...prev[editedIndex],
                customs_value: parseInt(e.target.value),
            };
            return prev;
        });
    };

    const pickRate = (e, rate) => {
        const data = {
            orderId: location.state.order.id,
            actual_service: rate.service,
            actual_carrier: rate.carrier,
            box: newData,
            customs: customsInfo,
            shipment_id: location.state.shipment_id,
            rateId: rate.id,
        };

        // Disable button on click
        setBtnLoading(true);
        // Set button to spinner while loading.
        e.target.innerHTML = `<div class="${classes.spinner}"></div>`;

        axios
            .post(
                `${import.meta.env.VITE_APP_API_URL}/order/add-update/do-ship`,
                data
            )
            .then(res => {
                history.push("/order/add-update", {
                    shipConfirmation: "shipped",
                    type: "pickRate",
                    data: res.data,
                });
            })
            .catch(err => {
                window.alert(err.response.data.message);
            });
    };

    const pickManual = () => {
        const data = {
            orderId: location.state.order.id,
            actual_service: service,
            actual_carrier: carrier,
            tracking: tracking,
            box: newData,
        };
        axios
            .post(`/order/add-update/do-ship`, data)
            .then(res => {
                history.push("/order/add-update", {
                    shipConfirmation: "shipped",
                    type: "manual",
                });
            })
            .catch(err => {
                window.alert(err.response.data.message);
            });
    };

    const renderAdditionalTextFields = () => {
        // Append additional to customs description.
        setCustomsDescInputs(prev => [
            ...prev,
            <>
                <br />
                <input
                    key={`cdesc-${prev.length}`}
                    type="text"
                    onChange={e => changeDesc(e, parseInt(prev.length + 1))}
                />
            </>,
        ]);
        // Append additional to customs value.
        setCustomsValueInputs(prev => [
            ...prev,
            <>
                <br />
                <input
                    key={`cvalue-${prev.length}`}
                    type="number"
                    onChange={e => changeValue(e, parseInt(prev.length + 1))}
                />
            </>,
        ]);
    };

    return (
        <div className={classes.Container}>
            <p>Boxes in this shipment</p>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Box</TableCell>
                            <TableCell align="center">Weight (lbs)</TableCell>
                            <TableCell align="center">
                                Customs Description
                            </TableCell>
                            <TableCell align="center">
                                Customs Value (USD)
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {showBoxes.map((b, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">
                                    {index + 1}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}>
                                    {newData[index].weight
                                        ? newData[index].weight.toFixed(2)
                                        : Number(b.weight).toFixed(2)}
                                    <input
                                        type="text"
                                        placeholder="new weight"
                                        style={{ padding: ".2rem .6rem" }}
                                        onChange={e => changeWeight(e, index)}
                                    />
                                </TableCell>
                                <TableCell ref={customsDescRef} align="center">
                                    <input
                                        key="cdesc-original"
                                        type="text"
                                        onChange={e => changeDesc(e, index)}
                                    />
                                    {customsDescInputs}
                                </TableCell>
                                <TableCell
                                    ref={customsValueRef}
                                    align="center"
                                    style={{ position: "relative" }}>
                                    <input
                                        key="cvalue-original"
                                        type="number"
                                        onChange={e => changeValue(e, index)}
                                    />
                                    {customsValueInputs}
                                    <AddBoxIcon
                                        style={{
                                            position: "absolute",
                                            top: "25px",
                                            right: "25%",
                                            cursor: "pointer",
                                        }}
                                        onClick={e =>
                                            renderAdditionalTextFields(e, index)
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={classes.Buttons}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addRows()}>
                    Add box
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeRows()}>
                    Remove Box
                </Button>
            </div>
            {/**************************************************************************************************** */}
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Carrier</TableCell>
                            <TableCell align="center">Service</TableCell>
                            <TableCell align="center">List Rate</TableCell>
                            <TableCell align="center">Retail Rate</TableCell>
                            <TableCell align="center">Choose</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {location.state.rates.map((rate, index) => (
                            <TableRow key={rate.id}>
                                <TableCell align="center">
                                    {rate.carrier}
                                </TableCell>
                                <TableCell align="center">
                                    {rate.service}
                                    <br />
                                    {(() => {
                                        if (
                                            rate.service.toUpperCase() ===
                                            "FEDEX_EXPRESS_SAVER"
                                        )
                                            return "3rd party billing: 308754227";
                                        if (
                                            rate.service.toUpperCase() ===
                                            "FEDEX_GROUND"
                                        )
                                            return "Bill Sender 291480179";
                                        if (
                                            location.state.order.user.username.toLowerCase() ===
                                            "buffalofoodproducts.com"
                                        )
                                            return "3rd party billing: 210128980";
                                        if (
                                            rate.carrier.toUpperCase() ===
                                                "FEDEX" &&
                                            (location.state.order.requested_service.toUpperCase() ===
                                                "FEDEXMEDIUMBOX" ||
                                                location.state.order.requested_service.toUpperCase() ===
                                                    "FEDEXSMALLBOX" ||
                                                location.state.order.requested_service.toUpperCase() ===
                                                    "FEDEXPAK" ||
                                                location.state.order.requested_service.toUpperCase() ===
                                                    "FEDEXENVELOPE") &&
                                            rate.custom_predefined_package
                                        )
                                            return "BillSender 242823303";
                                        if (
                                            rate.carrier.toUpperCase() ===
                                            "FEDEX"
                                        )
                                            return "3rd party billing: 210128980";
                                        else
                                            return "No 3rd party billing option set";
                                    })()}
                                </TableCell>
                                <TableCell align="center">
                                    {Number(rate.list_rate) +
                                        Number(
                                            location.state.order.insurance_value
                                        )}{" "}
                                    {rate.list_currency}
                                </TableCell>
                                <TableCell align="center">
                                    {Number(rate.retail_rate) +
                                        Number(
                                            location.state.order.insurance_value
                                        )}{" "}
                                    {rate.list_currency}
                                </TableCell>
                                {location.state.order.requested_service?.toLowerCase() ===
                                rate.service?.toLowerCase() ? (
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={btnLoading}
                                            onClick={e => pickRate(e, rate)}>
                                            Pick this rate
                                        </Button>
                                    </TableCell>
                                ) : (
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            disabled={btnLoading}
                                            onClick={e => pickRate(e, rate)}>
                                            Pick this rate
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={classes.Manual}>
                <p>Manual shipping </p>
                <div className={classes.Manual__inputs}>
                    <input
                        type="text"
                        placeholder="Carrier"
                        value={carrier}
                        onChange={e => setCarrier(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Service"
                        value={service}
                        onChange={e => setService(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Tracking"
                        value={tracking}
                        onChange={e => setTracking(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        disabled={!carrier || !service || !tracking}
                        onClick={pickManual}>
                        Enter tracking manually
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShipOrder;
