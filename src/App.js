import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Task from "./components/Task";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

function App() {
  const [localStorageChange, setLocalStorageChange] = useState(0);
  useAutoRefresh();

  useEffect(() => {
    // Add an event listener to the 'storage' event to detect changes in localStorage
    const handleStorageChange = () => {
      // Increment the state variable to trigger a re-render
      setLocalStorageChange((prevChange) => prevChange + 1);
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <>
            <Route exact path="/" element={<Login />}></Route>
            <Route exact path="/register" element={<Register />}></Route>
            <Route exact path="/task" element={<Task />}></Route>
          </>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
function useAutoRefresh() {
  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const token = refreshToken.split(" ")[1];
      const refreshInterval = setInterval(async () => {
        await axios
          .post(
            "http://localhost:4000/refreshToken",
            { Refresh_Token: token },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          .then((res) => {
            localStorage.setItem("authorization", res.headers.authorization);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 5 * 60 *1000);

      return () => {
        clearInterval(refreshInterval);
      };
    }
  }, []);
}

export default App;
