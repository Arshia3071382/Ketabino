import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../../App";
import style from "./ReserveModal.module.css";

export default function AdminLoginModal({ isOpen, onClose }) {
  const { setAuth } = useContext(AppContext);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    if (!isOpen) {
      setUserName("");
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = () => {
    const adminData = {
      username: "arshia",
      password: "1234",
    };

    if (username === adminData.username && password === adminData.password) {
      setAuth({
        role: "admin",
        isLoginIn: true,
        userInfo: { username },
      });

      setErrorMessage("");

     

      setSuccessMessage("✅ شما وارد شدید");
      setTimeout(() => {
        onClose();
        setSuccessMessage("")
      }, 3000);
    } else {
      setErrorMessage("رمز عبور و نام کاربری اشتباه است");
      setSuccessMessage("");
    }
  };

  return (
    <div className={style.modalContainer} onClick={onClose}>
      <div className={style.modalWrapper} onClick={(e) => e.stopPropagation()}>
        {/* دکمه بستن */}
        <button onClick={onClose} className={style.closeModalBtn}>
          ×
        </button>

        <h2> ورود به پنل مدیریت</h2>

        <div className={style.userInfoWrapper}>
          <label> نام کاربری</label>
          <input
            type="text"
            placeholder="مثلا: علی"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className={style.userInfoWrapper}>
          <label>رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button className={style.reserveBtn} onClick={handleLogin}>
          ورود
        </button>
        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
        )}
      </div>

      {successMessage && (
        <div className={style.successMessage}>{successMessage}</div>
      )}
    </div>
  );
}
