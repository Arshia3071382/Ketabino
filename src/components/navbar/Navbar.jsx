import { Link } from "react-router-dom";
import logo from "./../../assest/pic/logo2-removebg-preview.png";
import person from "./../../assest/pic/person.svg";
import styled from "./../navbar/Navbar.module.css";
import { useContext, useState } from "react";
import AdminLoginModal from "../modal/AdminLoginModal";
import { AppContext } from "../../App";

function Navbar() {
  const { auth, setAuth } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setAuth({
      role: "user",
      isLoginIn: false,
      userInfo: null,
    });
  };

  return (
    <div className="container">
      <div className={styled.navbarWrapper}>
        <img src={logo} alt="" className={styled.logobook} />
        
        <ul>
          <Link to={"/"}>
            <li>خانه</li>
          </Link>
          <Link to={"/trainingCalendar"}>
            <li>تقویم آموزشی</li>
          </Link>
          <Link to={"/aboutUs"}>
            <li>درباره ما</li>
          </Link>
          
         
          {auth.isLoginIn && auth.role === "admin" && (
            <Link to={"/admin"}>
              <li className={styled.adminTab}>پنل مدیریت</li>
            </Link>
          )}
        </ul>
        
        <div className={styled.userSection}>
          {auth.isLoginIn ? (
            <div className={styled.panelWrapper}>
              <span className={styled.welcomeText}>خوش آمدید، {auth.userInfo?.username}</span>
              <button onClick={handleLogout} className={styled.logoutBtn}>
                خروج
              </button>
            </div>
          ) : (
            <img 
              src={person} 
              alt="" 
              className={styled.personImg}  
              onClick={() => setIsModalOpen(true)}
            />
          )}
        </div>
      </div>

      <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Navbar;