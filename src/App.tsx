import { useEffect, useState } from 'react'
import logo from './logo.svg'

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/users')
    .then(response => response.json())
    .then(data => setUsers(data));
  }, []);

  return <div>{JSON.stringify(users)}</div>;
}

export default App
