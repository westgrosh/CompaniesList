import React from 'react'
import {CircularProgress} from "@mui/material";

const CustomLoading = ({title}) => {
    return (
        <div className={"d-flex justify-content-center"}>
            <div className={"m-5"}>
                <h3><b>{title}</b></h3>
                <div className={"d-flex justify-content-center"}>
                    <CircularProgress color="secondary"/>
                </div>
            </div>
        </div>
    )
}

export default CustomLoading;