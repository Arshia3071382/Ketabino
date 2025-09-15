import style from "./ReserveModal.module.css"

export default function ReserveModal({ isOpen, onClose }) {
  if (!isOpen) return null; 

  return (
    <div
      className={style.modalContainer}
      onClick={onClose} 
    >
      <div
        className={style.modalWrapper}
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className={style.closeModalBtn}
        >
          ×
        </button>

        <h2>فرم ثبت امانت کتاب</h2>

        <div className={style.userInfoWrapper}>
          <label>نام</label>
          <input type="text" placeholder="مثلا: علی" />
        </div>

        <div className={style.userInfoWrapper} >
          <label>نام خانوادگی</label>
          <input type="text" placeholder="مثلا: علیزاده" />
        </div>

        <div  className={style.userInfoWrapper}>
          <label>ایمیل</label>
          <input type="email" placeholder="example@gmail.com" />
        </div>

        <button
          className={style.reserveBtn}
        >
          تایید رزرو
        </button>
      </div>
    </div>
  );
}
