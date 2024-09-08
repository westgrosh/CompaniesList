import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useEffect, useState} from "react";
import * as React from "react";

export default function AlertDialogMessage(
    {
        open,
        title,
        message,
        reloadPage,
        onClose
    }
) {
    const handleClose = () => {
        // По умолчанию при закрытии диалогового окна, компонент перезагружает страницу
        if (reloadPage) {
            window.location.reload();
        } else {
            onClose();
        }
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                    <div className="d-flex justify-content-around mt-2">
                        <button className="btn btn-primary" onClick={handleClose}>Ок</button>
                    </div>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}