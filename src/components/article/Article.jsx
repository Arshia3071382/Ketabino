import style from "./Article.module.css"
import ReserveModal from "../modal/ReserveModal";
import { useState } from "react";


function Article(props) {
  const [isModalOpen , setIsModalOpen] = useState(false)
  return (
    <div className="container">
      <div className={style.articleWrapper}>
        <img src={props.article.image_url} />
        <h2>{props.article.title}</h2>
        <h4> نویسنده :{props.article.author}</h4>
        <h6> تعداد صفحات : {props.article.pages} </h6>
        <button onClick={() => setIsModalOpen(true)}>رزرو امانت کتاب</button>
      </div>

      <ReserveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> 
    </div>
  );
}

export default Article;
