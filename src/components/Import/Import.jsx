// React Imports
import React, { useState } from "react";
// React Router
import { Link, useHistory } from "react-router-dom";
// Styles
import classes from "./Import.module.scss";
// Material UI
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
// Components
import Spinner from "../../components/global/Spinner/Spinner";
// Axios
import axios from "axios";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import classesSudo from "../../components/global/Sudo/Sudo.module.scss";

const ImportRecipient = props => {
    const history = useHistory();
    //State consts
    const [selectedFile, setSelectedFile] = useState();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadedFile, setuploadedFile] = useState(null);
    const [uploadedData, setuploadedData] = useState([]);

    const onFileChange = e => {
        setSelectedFile(e.target.files[0]);
    };

    const uploadFile = () => {
        setLoading(true);
        const form = new FormData();
        form.append("uploads", selectedFile);
        axios
            .post(props.link, form)
            .then(res => {
                if (res.data.fail) {
                    setError(res.data.errors[0]);
                    setLoading(false);
                    return;
                }
                console.log(res.data);
                setuploadedFile(res?.data?.uploadFile?.upload?.filename);
                setuploadedData(res.data.savedItems);
                setLoading(false);
                setMessage("File Imported Successfully");
                setIsUploaded(true);
                setError("");
            })
            .catch(err => {
                window.alert(err.response.data.message);
                setLoading(false);
                setError("An error occured please try again");
                setMessage("");
            });
    };

    return (
        <>
            {!isUploaded && (
                <div className={classes.import}>
                    <Alert severity="info" style={{ width: "100%" }}>
                        This expects plain vanilla CSV files, not UTF-8 encoded
                        CSV files, not Excel files.
                    </Alert>
                    <form>
                        <label>{props.importLabel}</label>
                        <input type="file" onChange={e => onFileChange(e)} />
                        {message ? (
                            <p style={{ color: "green" }}>
                                {message}{" "}
                                <Link to={props.redirectPath}>
                                    {props.redirectLabel}
                                </Link>
                            </p>
                        ) : null}
                        {error ? <p style={{ color: "red" }}>{error}</p> : null}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={uploadFile}>
                            {loading ? <Spinner /> : "Upload"}
                        </Button>
                    </form>
                </div>
            )}

            {uploadedData && uploadedData.length && (
                <>
                    <div className={`${classesSudo.Sudo}`}>
                        <h1>Orders Imported</h1>
                        <h3>{uploadedFile}</h3>
                        <p>
                            Your order upload has been successfully processed
                            and the resulting orders are pending shipment.
                        </p>
                        <p>{uploadedData.length} orders created</p>
                    </div>

                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="center">
                                        Reference
                                    </TableCell>
                                    <TableCell align="center">
                                        Recipient
                                    </TableCell>
                                    <TableCell align="center">
                                        Created
                                    </TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {uploadedData.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row?.customer_reference}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row?.recipient?.name} -{" "}
                                            {row?.recipient.contact}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.createdAt}
                                        </TableCell>
                                        <TableCell align="center">
                                            Pending
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div
                        className={`${classesSudo.Sudo}`}
                        style={{ marginTop: "30px" }}>
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => history.push("/order")}>
                            View all orders
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

export default ImportRecipient;
