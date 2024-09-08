import React, {useReducer} from "react";
import {AlertDialogContext} from "./AlertDialogContext";

const initialState = {
    open: false,
    task: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'OPEN_DIALOG':
            return {
                ...state,
                open: true,
                task: action.payload,
            };
        case 'CLOSE_DIALOG':
            return {
                ...state,
                open: false,
                task: null,
            };
        default:
            throw new Error();
    }
}

export const AlertDialogProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AlertDialogContext.Provider value={{state, dispatch}}>
            {children}
        </AlertDialogContext.Provider>
    );
};