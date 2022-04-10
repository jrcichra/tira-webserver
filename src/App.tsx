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
import CreateNewCategory from "./CreateNewCategory";
import { Category, User } from "./utils/Types";
import React from "react";
import { API_BASE_URL } from "./EnvironmentVariables";

const mdTheme = createTheme();
 
export default function App() {
    const [user, setUser] = React.useState<User|undefined>();
    const [categories, setCategories] = React.useState<Category[]>([]);

    React.useEffect(() => {
        const cookies = cookie.parse(document.cookie);

        fetch(`${API_BASE_URL}/users/current`)
            .then(response => {
                if(response.ok) {
                    response.json().then((data: User) => setUser(data))
                }
            });
    }, []);

    return (
        <ThemeProvider theme={mdTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Base user={user} categories={categories} setCategories={setCategories} />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="tickets">
                            <Route index element={<TicketsPage />} />
                            <Route path="new" element={<CreateTicketPage categories={categories} setCategories={setCategories} />} />
                            <Route path=":ticketId" element={<TicketPage />} />
                        </Route>
                        <Route path="categories">
                            <Route path="new" element={<CreateNewCategory setCategories={setCategories} />} />
                        </Route>
                        <Route path="users" element={<Users />} />
                    </Route>
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="*" element={<h1>Page not found</h1>} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}