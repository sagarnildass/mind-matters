import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import { Provider } from 'react-redux';
import { store } from './utils/store';

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
