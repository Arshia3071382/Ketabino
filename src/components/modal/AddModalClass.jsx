import React, { useState } from "react";
import { toGregorian } from "jalaali-js";
import  style from "./AddModalClass.module.css";

export default function AddModalClass({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [teacher, setTeacher] = useState("");
  const [location, setLocation] = useState("");
  const [grade, setGrade] = useState("");
  const [persianDate, setPersianDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState("");

  if (!isOpen) return null;


  const convertToGregorian = (persianDate, time) => {
  
    const dateParts = persianDate.split('/');
    if (dateParts.length !== 3) {
      alert("فرمت تاریخ صحیح نیست. لطفاً از فرمت yyyy/mm/dd استفاده کنید.");
      return null;
    }
    
    const jYear = parseInt(dateParts[0]);
    const jMonth = parseInt(dateParts[1]);
    const jDay = parseInt(dateParts[2]);
    
    // تقسیم رشته زمان به ساعت و دقیقه
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    
    try {
      // تبدیل تاریخ شمسی به میلادی
      const gregorianDate = toGregorian(jYear, jMonth, jDay);
      
      // ایجاد تاریخ میلادی با زمان
      const finalDate = new Date(
        gregorianDate.gy,
        gregorianDate.gm - 1,
        gregorianDate.gd,
        hours,
        minutes
      );
      
      return finalDate.getTime();
    } catch (error) {
      alert("تاریخ وارد شده معتبر نیست.");
      return null;
    }
  };

  const handleSubmit = () => {
    if (!title || !teacher || !persianDate || !location || !grade || !type) {
      alert("لطفا همه فیلدها را پر کنید");
      return;
    }

    // تبدیل تاریخ شمسی به میلادی
    const dateInMilliseconds = convertToGregorian(persianDate, time);
    if (!dateInMilliseconds) return;

    const newClass = {
      id: Date.now(),
      title,
      teacher,
      date: dateInMilliseconds,
      persian_date: `${persianDate} ساعت ${time}`,
      location,
      grade,
      type,
    };

    onAdd(newClass);
    onClose();
  };

  return (
     <div className={style.modalBackdrop} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>افزودن کلاس جدید</h2>

        <div className={style.field}>
          <label>عنوان کلاس</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={style.field}>
          <label>نام مدرس</label>
          <input
            type="text"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
        </div>

          <div className={style.field}>
          <label>ساعت (hh:mm)</label>
          <input
            type="text"
            placeholder="10:00"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>


        <div className={style.field}>
          <label>تاریخ (شمسی)</label>
          <input
            type="text"
            placeholder="مثلا ۲۵ شهریور ۱۴۰۳"
            value={persianDate}
            onChange={(e) => setPersianDate(e.target.value)}
          />
        </div>

        <div className={style.field}>
          <label>محل برگزاری</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className={style.field}>
          <label>پایه</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>

        <div className={style.field}>
          <label>دسته بندی</label>
          <div className={style.radioGroup}>
            <label>
              <input
                type="radio"
                name="type"
                value="class"
                checked={type === "class"}
                onChange={(e) => setType(e.target.value)}
              />
              کلاس
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="exam"
                checked={type === "exam"}
                onChange={(e) => setType(e.target.value)}
              />
              آزمون
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="meeting"
                checked={type === "meeting"}
                onChange={(e) => setType(e.target.value)}
              />
              جلسه
            </label>
          </div>
        </div>

        <div className={style.buttonGroup}>
          <button className={style.cancelButton} onClick={onClose}>
            انصراف
          </button>
          <button className={style.registerClass} onClick={handleSubmit}>
            ثبت کلاس
          </button>
        </div>
      </div>
    </div>
  );
}