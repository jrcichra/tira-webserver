import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as cookie from 'cookie';
import Base from './Base';
import LoginPage from './LoginPage';
import Dashboard from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import Users from './Users';
import TicketPage from './pages/TicketPage';
import CreateTicketPage from './pages/CreateTicketPage';
import CreateNewCategory from './CreateNewCategory';
import { Category, User } from './utils/Types';
import React from 'react';
import { API_BASE_URL } from './EnvironmentVariables';
import ProfilePage from './pages/ProfilePage';

const mdTheme = createTheme();

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(() => {
    const cookies = cookie.parse(document.cookie);
    return 'tirauth' in cookies;
  });
  const [currentUser, setCurrentUser] = React.useState<User | undefined>();
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      document.title = 'Tira (Local)';
    }
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      fetch(`${API_BASE_URL}/users/current`).then((response) => {
        if (response.ok) {
          response.json().then((data: User) => setCurrentUser(data));
        }
      });
    } else {
      setCurrentUser(undefined);
    }
  }, [loggedIn]);

  return (
    <ThemeProvider theme={mdTheme}>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Base
                user={currentUser}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                categories={categories}
                setCategories={setCategories}
              />
            }
          >
            <Route
              path='dashboard'
              element={
                <Dashboard loggedIn={loggedIn} currentUser={currentUser} />
              }
            />
            <Route path='tickets'>
              <Route index element={<TicketsPage />} />
              <Route path='edit'>
                <Route
                  path=':ticketId'
                  element={
                    <CreateTicketPage
                      categories={categories}
                      setCategories={setCategories}
                      editMode
                    />
                  }
                />
              </Route>
              <Route
                path='new'
                element={
                  <CreateTicketPage
                    categories={categories}
                    setCategories={setCategories}
                  />
                }
              />
              <Route
                path=':ticketId'
                element={<TicketPage loggedIn={loggedIn} />}
              />
            </Route>
            <Route path='categories'>
              <Route
                path='new'
                element={<CreateNewCategory setCategories={setCategories} />}
              />
            </Route>
            <Route
              path='profile'
              element={<ProfilePage user={currentUser} />}
            />
            <Route
              path='users'
              element={
                <Users
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Route>
          <Route
            path='/login'
            element={<LoginPage setLoggedIn={setLoggedIn} />}
          />
          <Route path='*' element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
