import React from "react"
import {AlertDialogProvider} from "./components/alert/AlertDialogProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import {QueryClient, QueryClientProvider} from "react-query";



// Приложение
const App = () => {

    // Создаем клиента
    const queryClient = new QueryClient();

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <AlertDialogProvider>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            {/*
                            <Route path="/admin" element={<AdminPage/>}/>
                            <Route path="/about" element={<AboutPage/>}/>
                            <Route path="/view" element={<ViewPage/>}/>
                            */}
                        </Routes>
                </AlertDialogProvider>
            </QueryClientProvider>
        </div>
    )
}

export default App;