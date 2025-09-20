import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/home/Home";
import { Route, Routes } from "react-router-dom";
import AboutUs from "./../src/pages/aboutUs/AboutUs";
import Calendar from "./pages/TrainingCalendar/Calendar";
import { createContext, useContext, useState } from "react";
import AdminPanel from "./pages/adminPanel/AdminPanel";
import BookInfo from "./pages/bookInfo/BookInfo";

export const AppContext = createContext(null);

function App() {
  const [auth, setAuth] = useState({
    role: "user",
    isLoginIn: false,
    userInfo: null,
  });
  return (
    <AppContext.Provider value={{ auth  , setAuth}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/trainingCalendar" element={<Calendar />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/bookInfo/:id" element={<BookInfo />} />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
