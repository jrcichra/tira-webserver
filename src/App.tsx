import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Base from "./Base";
import LoginPage from "./LoginPage";
import * as cookie from "cookie";
import Dashboard from "./Dashboard";
import TicketsPage from "./TicketsPage";
import Users from "./Users";
import TicketPage from "./TicketPage";
import CreateTicketPage from "./CreateTicketPage";

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
                        <Route path="tickets">
                            <Route index element={<TicketsPage />} />
                            <Route path="new" element={<CreateTicketPage />} />
                            <Route path=":ticketId" element={<TicketPage />} />
                        </Route>
                        <Route path="users" element={<Users />} />
                    </Route>
                    <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
                    <Route path="*" element={<h1>Page not found</h1>} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}