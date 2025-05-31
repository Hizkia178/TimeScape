import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Main.css';

const Main = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backgroundImage, setBackgroundImage] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [nextTimeChange, setNextTimeChange] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      offset: 50
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    
    let currentPeriod = '';
    let nextChangeTime = '';
    
    if (hour >= 5 && hour < 12) {
      currentPeriod = 'morning';
      nextChangeTime = '12:00 (Afternoon)';
    } else if (hour >= 12 && hour < 17) {
      currentPeriod = 'afternoon';
      nextChangeTime = '17:00 (Evening)';
    } else if (hour >= 17 && hour < 21) {
      currentPeriod = 'evening';
      nextChangeTime = '21:00 (Night)';
    } else {
      currentPeriod = 'night';
      nextChangeTime = '05:00 (Morning)';
    }
    
    setTimeOfDay(currentPeriod);
    setNextTimeChange(nextChangeTime);
    setBackgroundImage(`/assets/${currentPeriod}.jpg`);
  }, [currentTime]);

  const timeString = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const dateString = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const dayName = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long'
  });


  const getTimeUntilNext = () => {
    const now = new Date();
    const hour = now.getHours();
    let nextHour;
    
    if (hour >= 5 && hour < 12) nextHour = 12;
    else if (hour >= 12 && hour < 17) nextHour = 17;
    else if (hour >= 17 && hour < 21) nextHour = 21;
    else if (hour >= 21 || hour < 5) nextHour = hour < 5 ? 5 : 29; // 29 means 5 AM next day
    
    const target = new Date();
    if (nextHour === 29) {
      target.setDate(target.getDate() + 1);
      target.setHours(5, 0, 0, 0);
    } else {
      target.setHours(nextHour, 0, 0, 0);
    }
    
    const diff = target - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <div 
        className="main-container overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      > 
        <div className="overlay"></div>
        
        <div className="content-wrapper">
        

        
          <div className="time-container" data-aos="fade-up">
            <div className="time-header">
              <i className='bx bx-time-five time-icon'></i>
              <span className="current-period">{timeOfDay.toUpperCase()}</span>
            </div>
            
            <div className="current-time" data-aos="zoom-in" data-aos-delay="200">
              <h1 className="time-display">{timeString}</h1>
            </div>
            
            <div className="date-container" data-aos="fade-up" data-aos-delay="400">
              <div className="day-section">
                <i className='bx bx-calendar day-icon'></i>
                <h2 className="day-display">{dayName}</h2>
              </div>
              <p className="date-display">{dateString}</p>
            </div>

            <div className="timer-section" data-aos="fade-up" data-aos-delay="600">
              <div className="timer-card">
                <div className="timer-header">
                  <i className='bx bx-timer timer-icon'></i>
                  <span className="timer-label">Next Change</span>
                </div>
                <div className="timer-info">
                  <div className="next-period">
                    <i className='bx bx-right-arrow-alt arrow-icon'></i>
                    <span>{nextTimeChange}</span>
                  </div>
                  <div className="countdown">
                    <i className='bx bx-stopwatch countdown-icon'></i>
                    <span className="countdown-text">{getTimeUntilNext()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

       
        </div>
      </div>
    </>
  );
};

export default Main;