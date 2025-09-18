import { useContext, useEffect, useState, useRef, useMemo } from "react";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import style from "./Calendar.module.css";
import { AppContext } from "../../App";
import AddModalClass from "../../components/modal/AddModalClass";

function TimeRemaining({ eventDate, eventDuration }) {
  const [timeLeft, setTimeLeft] = useState("در حال محاسبه...");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = new Date(eventDate).getTime();
      const difference = eventTime - now;
      const durationMs = eventDuration * 60 * 1000;

      if (difference <= 0 && Math.abs(difference) < durationMs) {
        setTimeLeft("در حال برگزاری");
        return;
      }

      if (difference <= 0 && Math.abs(difference) >= durationMs) {
        setTimeLeft("اتمام یافته");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days} روز و ${hours} ساعت و ${minutes} دقیقه و ${seconds} ثانیه تا شروع کلاس`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [eventDate, eventDuration]);

  return <div className={style.countdownTimer}>{timeLeft}</div>;
}

function Calendar() {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AppContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const checkIntervalRef = useRef(null);

  useEffect(() => {
    fetchCalendarData();

   
    checkIntervalRef.current = setInterval(() => {
      checkAndRemoveExpiredClasses();
    }, 30000); 

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
   
    checkAndRemoveExpiredClasses();
  }, [calendar]);

  // مرتب‌سازی کلاس‌ها بر اساس نزدیک‌ترین زمان شروع
  const sortedCalendar = useMemo(() => {
    const now = new Date().getTime();
    
    return [...calendar].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      
      
      return aTime - bTime;
    });
  }, [calendar]);

  const fetchCalendarData = () => {
    axios
      .get("http://localhost:8000/training")
      .then((res) => {
        setCalendar(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("خطا در دریافت اطلاعات از سرور");
        setLoading(false);
      });
  };

  const checkAndRemoveExpiredClasses = () => {
    const now = new Date().getTime();
    const classesToRemove = [];

    // پیدا کردن کلاس‌هایی که باید حذف شوند
    calendar.forEach(item => {
      const eventTime = new Date(item.date).getTime();

      const removeTime = eventTime + (90 * 60 * 1000);
      
      if (now > removeTime) {
        classesToRemove.push(item.id);
      }
    });

    // اگر کلاسی برای حذف وجود دارد
    if (classesToRemove.length > 0) {
  
      setCalendar(prev => prev.filter(item => !classesToRemove.includes(item.id)));
      
      
      classesToRemove.forEach(id => {
        axios.delete(`http://localhost:8000/training/${id}`)
          .then(() => console.log(`کلاس با شناسه ${id} حذف شد`))
          .catch(err => console.error("خطا در حذف کلاس:", err));
      });
    }

  };

  const handleDelete = async (id) =>{
    try{
      axios.delete(`http://localhost:8000/training/${id}`)
      setCalendar(calendar.filter((item) => item.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) {
    return (
      <div className={style.calendarBox}>
        <Navbar />
        <div className="container">
          <div className={style.calendarWrapperErr}>
            <h1>تقویم کلاس های آموزشی</h1>
            <p>در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.calendarBox}>
        <Navbar />
        <div className="container">
          <div className={style.calendarWrapperErr}>
            <h1>تقویم کلاس های آموزشی</h1>
            <p className={style.error}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.calendarBox}>
      <Navbar />
      <div className="container">
        <h1>تقویم کلاس های آموزشی</h1>
        
        <div className={style.controls}>
          {auth.role === "admin" && (
            <button className={style.addBtn} onClick={() => setIsOpenModal(true)}>
              افزودن کلاس +
            </button>
          )}
        </div>
        
        <div className={style.calendarWrapper}>
          {sortedCalendar && sortedCalendar.length > 0 ? (
            sortedCalendar.map((item) => (
              <div key={item.id} className={style.cardCalendarWrapper}>
                {auth.role === "admin" && (
                   <button
                   className={style.removeCardtn}
                   onClick={() => handleDelete(item.id)}

                   >
                   x
                  </button>
                  )}
                <div className={`${style.grade} ${style[item.type]}`}>
                  
                  <h4>{item.grade}</h4>
                </div>
                <div className={style.classInfo}>
                  <div className={style.teacherInfo}>
                    <h2>{item.title}</h2>
                    <h3>{item.teacher}</h3>
                  </div>

                  <div className={style.dateInfo}>
                    <h4>{item.persian_date}</h4>
                    <h4>{item.location} </h4>
                    <div className={style.differenceTime}>
                      <h6>
                        <TimeRemaining 
                          eventDate={item.date} 
                          eventDuration={item.duration || 90}
                        />
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>هیچ کلاسی برای نمایش وجود ندارد.</p>
          )}
        </div>
      </div>
      <AddModalClass
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onAdd={(newClass) => {
          axios
            .post("http://localhost:8000/training", newClass)
            .then((res) => {
              setCalendar([...calendar, res.data]);
            })
            .catch((err) => console.error("خطا در ذخیره کلاس:", err));
        }}
      />
    </div>
  );
}

export default Calendar;