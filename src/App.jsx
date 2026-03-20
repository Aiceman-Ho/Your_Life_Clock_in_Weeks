import React, { useState, useEffect } from 'react';

const App = () => {
  // 狀態管理：使用者的生日與是否已設定
  const [userBirthDate, setUserBirthDate] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  const [weeksPassed, setWeeksPassed] = useState(0);
  const [currentDateStr, setCurrentDateStr] = useState('');

  // 核心參數
  const TOTAL_YEARS = 90;
  const WEEKS_PER_YEAR = 52;
  const TOTAL_WEEKS = TOTAL_YEARS * WEEKS_PER_YEAR;

  // 系統啟動時：嘗試從瀏覽器記憶中讀取生日
  useEffect(() => {
    const savedDate = localStorage.getItem('lifeClockBirthDate');
    if (savedDate) {
      setUserBirthDate(savedDate);
      setIsConfigured(true);
    }
  }, []);

  // 時間計算引擎（只有在設定好生日後才運作）
  useEffect(() => {
    if (!isConfigured || !userBirthDate) return;

    const calculateTime = () => {
      const birth = new Date(userBirthDate + 'T00:00:00');
      const current = new Date(); 
      
      const timeDiff = current.getTime() - birth.getTime();
      const exactWeeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
      
      // 防止產生負數或超過最大值
      setWeeksPassed(Math.max(0, Math.min(exactWeeks, TOTAL_WEEKS)));
      setCurrentDateStr(current.toLocaleDateString('zh-TW', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }));
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000 * 60 * 60 * 24);
    return () => clearInterval(timer);
  }, [isConfigured, userBirthDate]);

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

  // ==========================================
  // 畫面 A：尚未設定生日時的「歡迎設定畫面」
  // ==========================================
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
          <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">設定你的生命時鐘</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">資料僅儲存於您的本機瀏覽器，完全保障隱私。</p>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">請選擇出生日期</label>
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
              生成專屬週數表
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // 畫面 B：正式的人生週數表 (與原本相同，但加入重設按鈕)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans text-gray-800 relative">
      
      {/* 重新設定按鈕 */}
      <button 
        onClick={handleReset}
        className="absolute top-4 right-4 text-xs font-medium text-gray-500 hover:text-gray-900 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 transition-colors"
      >
        更改生日
      </button>

      {/* 標題與數據看板 */}
      <div className="max-w-4xl w-full mb-10 text-center mt-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider text-gray-900">
          你的 90 年人生週數表
        </h1>
        <p className="text-gray-500 mb-6">
          從 {userBirthDate} 至 {currentDateStr || '今日'}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-400 font-medium mb-1">已經度過</span>
            <span className="text-3xl font-bold text-gray-900">{weeksPassed} <span className="text-lg font-normal text-gray-500">週</span></span>
          </div>
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-400 font-medium mb-1">剩下空白</span>
            <span className="text-3xl font-bold text-gray-900">{Math.max(0, TOTAL_WEEKS - weeksPassed)} <span className="text-lg font-normal text-gray-500">週</span></span>
          </div>
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-gray-400 font-medium mb-1">當前進度</span>
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
              <span>第 1 週</span>
              <span>一年有 52 週</span>
              <span>第 52 週</span>
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
            <span>過去</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 ring-2 ring-blue-500 ring-offset-1 rounded-sm scale-125"></div>
            <span>本週</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm"></div>
            <span>未來</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
