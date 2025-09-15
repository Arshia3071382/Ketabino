import { Link, Routes, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar"
import style from "./Home.module.css"
import search from "./../../assest/pic/search_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.svg"
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Article from "../../components/article/Article";
import ReserveModal from "../../components/modal/ReserveModal";
import { AppContext } from "../../App";

function Home(){

      const{isLogin} = useContext(AppContext)
      const [article, setArticle] = useState([]);
      const [searchTerm, setSearchTerm] = useState("");
      const [open , setOpen] = useState(false)
      useEffect(() => {
    axios
      .get("http://localhost:8001/article")
      .then((res) => {
        setArticle(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const filteredArticles = article.filter(
    (art) =>
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author.toLowerCase().includes(searchTerm.toLowerCase())
    
  );
  
   return (
    <div className={style.homeWrapper}>
      <Navbar />
      <div className={style.searchWrapper}>
        <div className={style.hWrapper}>
          <h1>کتابخانه منتظران</h1>
          <h4>از بین محبوب‌ترین کتاب‌ها انتخاب کن 📚✨</h4>
        </div>
        <div className={style.searchBox}>
          <img src={search} alt="" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی کتاب ..."
          />
        </div>
      </div>

      <div className={style.articleCard}>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            
              <Article article={article}/>
          ))
        ) : (
         <p>😕 !هیچ کتابی مطابق جستجوی شما پیدا نشد، دوباره امتحان کنید ✨</p>

        )}
      </div>

     
    </div>
  );
}

export default Home