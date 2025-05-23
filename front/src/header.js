import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import logo from './logo.jpg';
import Button from '@mui/material/Button';


export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    const hasCredentials = () => {
      return document.cookie.includes("token") || localStorage.getItem("token");
    };

    if (hasCredentials()) {
      console.log("📡 Fetching user profile...");
      fetch('http://localhost:4000/profile', {
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log("✅ Profile fetch successful, parsing JSON...");
          return response.json();
        })
        .then(userInfo => {
          console.log("👤 User info received:", userInfo);
          setUserInfo(userInfo);
        })
        .catch(error => {
          console.error("🔥 Failed to fetch user profile:", error);
          alert("An error occurred while fetching user profile: " + error.message);
        });
    } else {
      console.log("🔒 No credentials found, skipping profile fetch.");
    }
  }, []);

  function clearAllCookies() {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    })
      .then(() => {
        clearAllCookies();
        setUserInfo(null);
      })
      .catch(error => {
        console.error('Error during logout:', error);
        alert('Failed to logout. Please try again.');
      });
  }


  const username = userInfo?.username;

  return (
    <header>
      <Link to="/"  className="logo"><img src={logo} /></Link>
      <nav>
        {username && (
          <>
            <Link to="/create" > Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="login"><Button variant="contained" color="primary">Login</Button></Link>
            <Link to="Register"><Button variant="contained" color="primary" sx={{ mr: 2 }}>Register</Button></Link>
          </>
        )}

      </nav>
    </header>
  );
}
