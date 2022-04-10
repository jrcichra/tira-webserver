import { Box, Button, Container, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordTextField from "./PasswordTextField";
import SHA256 from 'crypto-js/sha256';
import { API_BASE_URL } from "./EnvironmentVariables";
import { User } from "./utils/Types";

export default function LoginPage({setUser}: {setUser: (user: User) => void}) {
    const linkState = useLocation().state as any;

    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const [loginFailure, setLoginFailure] = useState(false);
    
    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newUsername = event.target.value;
        setUsernameError(!newUsername);
        setUsername(newUsername);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newPassword = event.target.value;
        setPasswordError(!newPassword);
        setPassword(newPassword);
    };

    const verifyFields = () => {
        if(!username || !password) {
            setUsernameError(!username);
            setPasswordError(!password);
            return false;
        }
        return true;
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginFailure(false);

        if(!verifyFields()) {
            return;
        }

        const loginJSON = {
            username,
            password: SHA256(password).toString()
        }

        console.log(loginJSON);
        fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginJSON)
        })
        .then(response => {
            console.log('Success:', response);
            if(response.ok) {
                response.json().then((data: User) => {
                    setUser(data);
    
                    if(linkState && linkState.prevPath) {
                        navigate(linkState.prevPath)
                    } else {
                        navigate("/dashboard")
                    }
                })
            } else {
                setLoginFailure(true);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <Box sx={{mt: 1}}>
                        <TextField value={username} onChange={handleUsernameChange} error={usernameError} helperText={usernameError ? 'Username is required' : ''} margin="normal" id="outlined-basic" label="Username" variant="outlined" fullWidth />
                        <PasswordTextField value={password} onChange={handlePasswordChange} error={passwordError}  />
                    </Box>
                    {loginFailure && <span>Login Failed</span>}
                    <Button
                        type="submit"
                        variant="contained"
                        color='primary'
                        sx={{
                            mt: 2,
                            alignItems: 'flex-start'
                        }}
                        fullWidth
                    >
                        Log in
                    </Button>
                </form>
            </Box >
        </Container >
    )
}
