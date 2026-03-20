import React, { useState, useEffect } from 'react';

// ==========================================
// 1. 建立語言字典 (將血肉與骨架分離)
// ==========================================
const translations = {
  zh: {
    setupTitle: "設定你的生命時鐘",
    privacyNote: "資料僅儲存於您的本機瀏覽器，完全保障隱私。",
    selectDateLabel: "請選擇出生日期",
    generateBtn: "生成我的生命計時表",
    changeDateBtn: "更改生日",
    mainTitle: "你的 90 年人生週數表",
    from: "從",
    to: "至",
    today: "今日",
    passed: "已經度過",
    remaining: "剩下空白",
    progress: "當前進度",
    weeksUnit: "週",
    week1: "第 1 週",
    yearHas52: "一年有 52 週",
    week52: "第 52 週",
    past: "過去",
    current: "本週",
    future: "未來",
  },
  en: {
    setupTitle: "Set Your Life Clock",
    privacyNote: "Data is stored locally in your browser. 100% private.",
    selectDateLabel: "Select your birth date",
    generateBtn: "Generate my Life Clock",
    changeDateBtn: "Change Date",
    mainTitle: "Your 90-Year Life in Weeks",
    from: "From",
    to: "to",
    today: "Today",
    passed: "Time Passed",
    remaining: "Time Remaining",
    progress: "Progress",
    weeksUnit: "weeks",
    week1: "Week 1",
    yearHas52: "52 weeks in a year",
    week52: "Week 52",
    past: "Past",
    current: "Current",
    future: "Future",
  }
};

const App = () => {
  // 狀態管理：加入語言設定 (預設為中文)
  const [lang, setLang] = useState('zh');
  const [userBirthDate, setUserBirthDate] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  const [weeksPassed, setWeeksPassed] = useState(0);
  const [currentDateStr, setCurrentDateStr] = useState('');

  // 核心參數
  const TOTAL_YEARS = 90;
  const WEEKS_PER_YEAR = 52;
  const TOTAL_WEEKS = TOTAL_YEARS * WEEKS_PER_YEAR;

  // 系統啟動時：嘗試從瀏覽器記憶中讀取生日與語言
  useEffect(() => {
    const savedDate = localStorage.getItem('lifeClockBirthDate');
    const savedLang = localStorage.getItem('lifeClockLanguage');
    
    if (savedLang) setLang(savedLang);
    
    if (savedDate) {
      setUserBirthDate(savedDate);
      setIsConfigured(true);
    }
  }, []);

  // 時間計算引擎
  useEffect(() => {
    if (!isConfigured || !userBirthDate) return;

    const calculateTime = () => {
      const birth = new Date(userBirthDate + 'T00:00:00');
      const current = new Date(); 
      
      const timeDiff = current.getTime() - birth.getTime();
      const exactWeeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
      
      setWeeksPassed(Math.max(0, Math.min(exactWeeks, TOTAL_WEEKS)));
      
      // 根據當前語言動態改變日期的顯示格式
      setCurrentDateStr(current.toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }));
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000 * 60 * 60 * 24);
    return () => clearInterval(timer);
  }, [isConfigured, userBirthDate, lang]); // 語言改變時也會重新計算日期格式

  // 儲存設定
  const handleSave = (e) => {
    e.preventDefault();
    if (userBirthDate) {
      localStorage.setItem('lifeClockBirthDate', userBirthDate);
      setIsConfigured(true);
    }
  };

  // 重設/更改生日
  const handleReset = () => {
    localStorage.removeItem('lifeClockBirthDate');
    setIsConfigured(false);
    setUserBirthDate('');
  };

  // 切換語言函數
  const toggleLanguage = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    localStorage.setItem('lifeClockLanguage', newLang);
  };

  // 取得當前語言的字典
  const t = translations[lang];

  // ==========================================
  // 畫面 A：尚未設定生日時的「歡迎設定畫面」
  // ==========================================
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-800 relative">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
          <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">{t.setupTitle}</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">{t.privacyNote}</p>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectDateLabel}</label>
              <input 
                type="date" 
                required
                value={userBirthDate}
                onChange={(e) => setUserBirthDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors mt-2"
            >
              {t.generateBtn}
            </button>
          </form>
          
          {/* 語言切換按鈕移動至此：位於生成按鈕正下方 */}
          <div className="mt-6 text-center">
            <button 
              onClick={toggleLanguage}
              className="text-sm font-medium text-gray-400 hover:text-gray-800 transition-colors underline-offset-4 hover:underline flex items-center justify-center w-full gap-2"
            >
              {lang === 'zh' ? '🌐 Switch to English' : '🌐 切換為中文'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 畫面 B：正式的人生週數表
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans text-gray-800 relative">
      
      {/* 頂部按鈕區 (切換語言 + 更改生日) */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={toggleLanguage}
          className="text-xs font-medium text-gray-500 hover:text-gray-900 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 transition-colors"
        >
          {lang === 'zh' ? 'English' : '中文'}
        </button>
        <button 
          onClick={handleReset}
          className="text-xs font-medium text-gray-500 hover:text-gray-900 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 transition-colors"
        >
          {t.changeDateBtn}
        </button>
      </div>

      {/* 標題與數據看板 */}
      <div className="max-w-4xl w-full mb-10 text-center mt-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider text-gray-900">
          {t.mainTitle}
        </h1>
        <p className="text-gray-500 mb-6">
          {t.from} {userBirthDate} {t.to} {currentDateStr || t.today}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-400 font-medium mb-1">{t.passed}</span>
            <span className="text-3xl font-bold text-gray-900">{weeksPassed} <span className="text-lg font-normal text-gray-500">{t.weeksUnit}</span></span>
          </div>
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-400 font-medium mb-1">{t.remaining}</span>
            <span className="text-3xl font-bold text-gray-900">{Math.max(0, TOTAL_WEEKS - weeksPassed)} <span className="text-lg font-normal text-gray-500">{t.weeksUnit}</span></span>
          </div>
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-400 font-medium mb-1">{t.progress}</span>
            <span className="text-3xl font-bold text-gray-900">
              {((weeksPassed / TOTAL_WEEKS) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 網格圖表區 */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto w-full max-w-5xl">
        <div className="min-w-[600px]">
          
          <div className="flex mb-2 ml-8 text-xs text-gray-400">
            <div className="flex-1 flex justify-between px-1">
              <span>{t.week1}</span>
              <span>{t.yearHas52}</span>
              <span>{t.week52}</span>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col justify-between w-8 text-xs text-gray-400 py-1 pr-2 text-right">
              {[...Array(10)].map((_, i) => (
                <span key={i} style={{ marginTop: i === 0 ? '-4px' : '', marginBottom: i === 9 ? '-4px' : ''}}>
                  {i * 10}
                </span>
              ))}
            </div>

            <div 
              className="flex-1"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(52, minmax(0, 1fr))',
                gap: '3px',
                padding: '2px'
              }}
            >
              {[...Array(TOTAL_WEEKS)].map((_, index) => {
                const isPassed = index < weeksPassed;
                const isCurrentWeek = index === weeksPassed;
                
                return (
                  <div
                    key={index}
                    className={`
                      aspect-square rounded-[1px]
                      ${isPassed ? 'bg-gray-800' : 'bg-white border border-gray-300'}
                      ${isCurrentWeek ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-500 z-10 scale-125' : ''}
                    `}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* 圖例 */}
        <div className="mt-8 flex justify-center items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
            <span>{t.past}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 ring-2 ring-blue-500 ring-offset-1 rounded-sm scale-125"></div>
            <span>{t.current}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm"></div>
            <span>{t.future}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;