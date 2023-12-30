// src/components/Register.js
import React, { useState } from 'react';
import './AuthForm.css'; // Import the same CSS file for consistency

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Add registration logic here (e.g., create a new user)
    // For simplicity, we'll just register the user with a callback
    onRegister({ username });
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
