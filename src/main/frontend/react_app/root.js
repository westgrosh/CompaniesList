import React from "react";
import App from "./app";
import ErrorBoundary from "./components/error/ErrorBoundary";
import {BrowserRouter} from "react-router-dom";


// Обертка для контекста
/*
    Возможно использование что-нибудь такого эдакового из Паруса:
    - MessagingContext
    - BrowserRouter
    - ErrorBoundary
    - App
 */


const Root = () => {
    return (

        <React.Fragment>
            <BrowserRouter basename="/CompaniesList/">
                <ErrorBoundary>
                    <App/>
                </ErrorBoundary>
            </BrowserRouter>
        </React.Fragment>

    )
}

export default Root