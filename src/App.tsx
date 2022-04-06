import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import LoginPage from "./LoginPage";

const mdTheme = createTheme();

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <ThemeProvider theme={mdTheme}>
            <Routes>
                <Route path="/" element={<Dashboard loggedIn={loggedIn} />} />
                <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
            </Routes>
        </ThemeProvider>
    )
}