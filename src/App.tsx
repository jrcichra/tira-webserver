import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Base from "./Base";
import LoginPage from "./LoginPage";
import * as cookie from "cookie";
import Dashboard from "./Dashboard";

const mdTheme = createTheme();

export default function App() {
    const cookies = cookie.parse(document.cookie);
    const [loggedIn, setLoggedIn] = useState('tirauth' in cookies);

    return (
        <ThemeProvider theme={mdTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Base loggedIn={loggedIn} />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="tickets" element={<h1>Tickets</h1>} />
                        <Route path="users" element={<h1>Users</h1>} />
                    </Route>
                    <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}