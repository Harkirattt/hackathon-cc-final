"use client";
import React, { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Simulated user authentication for agents
  const handleAgentLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'agent' && password === 'agentpass') {
      window.location.href = '/agentside';
    } else {
      setError('Invalid agent credentials');
    }
  };

  // Direct client access
  const handleClientAccess = () => {
    window.location.href = '/clientside';
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      flexDirection: 'column',
      gap: '20px',
      color: 'black'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333'
        }}>
          Agent Login
        </h2>
        <form onSubmit={handleAgentLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <div>
            <label htmlFor="username" style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555'
            }}>
              Username
            </label>
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter agent username"
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555'
            }}>
              Password
            </label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter agent password"
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            />
          </div>
          {error && (
            <div style={{
              color: 'red',
              textAlign: 'center',
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              {error}
            </div>
          )}
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            Agent Login
          </button>
        </form>
      </div>

      {/* Direct Client Access Button */}
      <button 
        onClick={handleClientAccess}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '12px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
      >
        Continue as Client (No Login Required)
      </button>
    </div>
  );
};

export default LoginPage;