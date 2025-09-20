import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import style from "./bookInfo.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookInfo() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8001/article/${id}`)
      .then((res) => {
        setBook(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!book) {
    return (
      <div className={style.bookInfoWrapper}>
        <Navbar />
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className={style.bookInfoWrapper}>
      <Navbar />
      <div className="container">
        <div className={style.bookInfoContent}>
          <h1>{book.title}</h1>
          <h3>نویسنده : {book.author}</h3>
          <h5>تعداد صفحات : {book.pages}</h5>
          <img src={book.image_url} alt="" />
          <p>{book.content}</p>
        </div>
      </div>
    </div>
  );
}
