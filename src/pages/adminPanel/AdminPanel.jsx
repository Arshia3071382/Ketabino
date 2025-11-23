import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import style from "./AdminPanel.module.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function AdminPanel() {
  const [tab, setNewTab] = useState("book");
  const [activeBtn, setActiveBtn] = useState("book");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const schema = yup.object().shape({
    title: yup.string().required("نام کتاب الزامی است"),
    author: yup.string().required("نام نویسنده الزامی است"),
    image_url: yup
      .string()
      .url("لینک وارد شده معتبر نیست")
      .required("لینک تصویر اجباری است"),
    short_desc: yup.string().required("توضیح کوتاه در مورد کتاب الزامی است"),
    pages: yup
      .number()
      .min(15, "تعداد صفحات نمی‌تواند کمتر از ۱۵ باشد")
      .max(500, "تعداد صفحات نمی‌تواند بیشتر از ۵۰۰ باشد")
      .required("تعداد صفحات الزامی است")
      .typeError("تعداد صفحات باید یک عدد باشد"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    setIsSubmiting(true);
    setSubmitStatus(null);

    axios
      .post("http://localhost:8000/article", {
        title: data.title,
        author: data.author,
        image_url: data.image_url,
        pages: data.pages,
        content: data.short_desc,
        createdAt: new Date().toISOString(),
      })
      .then((res) => {
        console.log(res.data);
        setSubmitStatus("success");
        reset();
      })
      .catch((error) => {
        console.error("خطا در ایجاد مقاله:", error);
        setSubmitStatus("error");
      })
      .finally(() => {
        setIsSubmiting(false);
      });
  };

  const handleTabChange = (newTab) => {
    setNewTab(newTab);
    setActiveBtn(newTab);
  };

  return (
    <div className={style.panelPageWrapper}>
      <Navbar />
      <div className="container">
        <h1>پنل مدیریت</h1>
        <div className={style.panelTabWrapper}>
          <button
            className={`${style.panelTabBtn} ${
              activeBtn === "reserve" ? style.activeTab : ""
            }`}
            onClick={() => handleTabChange("reserve")}
          >
            لیست امانات
          </button>
          <button
            className={`${style.panelTabBtn} ${
              activeBtn === "book" ? style.activeTab : ""
            }`}
            onClick={() => handleTabChange("book")}
          >
            افزودن کتاب جدید
          </button>
        </div>
      </div>
      <div className={style.createBookWrapper}>
        {tab === "book" && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>نام کتاب :</label>
            <input
              {...register("title")}
              placeholder="مثلا تاریخ معاصر"
              type="text"
            />

            <label> نویسنده :</label>
            <input
              type="text"
              placeholder="مثلا ویلیام گلدینگ"
              {...register("author")}
            />

            <label> تعداد صفحات :</label>
            <input type="number" {...register("pages")} min={0} max={800} />
            <label> لینک تصویر</label>
            <input
              {...register("image_url")}
              type="text"
              placeholder="https://example.com/book.jpg"
            />

            <label>توضیح کوتاه :</label>
            <textarea
              {...register("short_desc")}
              placeholder="خلاصه‌ای کوتاه از کتاب..."
              rows="4"
            />
            <button
              type="submit"
              disabled={isSubmiting}
              className={isSubmiting ? style.submitting : ""}
            >
              {isSubmiting ? "در حال ثبت..." : "ثبت کتاب"}
            </button>

            {submitStatus === "success" && (
              <p className={style.success}>مقاله با موفقیت ایجاد شد!</p>
            )}

            {submitStatus === "error" && (
              <p className={style.error}>
                خطا در ایجاد مقاله. لطفا دوباره تلاش کنید.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
