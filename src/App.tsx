import { useEffect, useState } from 'react'
import logo from './logo.svg'

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`api/users`)
    .then(response => response.json())
    .then(data => setUsers(data));
  }, []);

  return <div>{JSON.stringify(users)}</div>;
}

export default App
