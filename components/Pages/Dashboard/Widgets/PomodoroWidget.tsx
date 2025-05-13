import { useEffect, useState } from "react";

export default function PomodoroWidget() {
  // Pomodoro states
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Duration settings in seconds
  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;
  
  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
    setProgress(0);
  }, [mode]);
  
  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          // Calculate progress percentage (0-100)
          const duration = mode === 'work' ? workDuration : breakDuration;
          const newProgress = Math.floor(((duration - newTime) / duration) * 100);
          setProgress(newProgress);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      // Switch modes when timer ends
      setMode(prev => prev === 'work' ? 'break' : 'work');
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);
  
  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle timer
  const toggleTimer = () => {
    setIsActive(prev => !prev);
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
    setProgress(0);
  };
  
  // Get class name for wave level
  const getWaveClass = () => {
    if (progress < 33) return "_0";
    if (progress < 66) return "_50";
    return "_100";
  };
  
  return (
    <div className="pomodoro-widget">
      <div className="pomodoro-widget-header">
        <p className="pomodoro-widget-title">Pomodoro</p>
        <p className="pomodoro-widget-subtitle">
          {mode === 'work' ? 'Focus on your tasks and complete them.' : 'Take a short break.'}
        </p>
      </div>
      <div className="pomodoro-widget-body">
        <div className="circle-container" onClick={toggleTimer}>
          <div className="circle"></div>
          <div className={`wave ${getWaveClass()}`} style={{
            animationPlayState: isActive ? 'running' : 'paused'
          }}></div>
          <div className={`wave ${getWaveClass()}`} style={{
            animationPlayState: isActive ? 'running' : 'paused'
          }}></div>
          <div className={`wave ${getWaveClass()}`} style={{
            animationPlayState: isActive ? 'running' : 'paused'
          }}></div>
          <div className={`wave-below ${getWaveClass()}`}></div>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            textAlign: 'center',
            width: '100%',
            color: mode === 'work' ? '#7c4dff' : '#4caf50'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 500 }}>{formatTime(timeLeft)}</div>
            <div style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{isActive ? 'Pause' : 'Start'}</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#888' }}>{mode.toUpperCase()}</div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginTop: '1rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => { setMode('work'); resetTimer(); }}
            style={{
              backgroundColor: mode === 'work' ? '#7c4dff' : 'transparent',
              color: mode === 'work' ? 'white' : '#888',
              border: `1px solid ${mode === 'work' ? '#7c4dff' : '#424242'}`,
              borderRadius: '5px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Work
          </button>
          <button
            onClick={() => { setMode('break'); resetTimer(); }}
            style={{
              backgroundColor: mode === 'break' ? '#4caf50' : 'transparent',
              color: mode === 'break' ? 'white' : '#888',
              border: `1px solid ${mode === 'break' ? '#4caf50' : '#424242'}`,
              borderRadius: '5px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Break
          </button>
          <button
            onClick={resetTimer}
            style={{
              backgroundColor: 'transparent',
              color: '#ff5252',
              border: '1px solid #ff5252',
              borderRadius: '5px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
