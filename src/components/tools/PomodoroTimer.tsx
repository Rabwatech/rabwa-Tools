import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings, Clock, Coffee, Target } from "lucide-react";

interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
}

type TimerState = 'work' | 'shortBreak' | 'longBreak' | 'paused' | 'stopped';

export const PomodoroTimer = () => {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsUntilLongBreak: 4,
  });
  
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState<TimerState>('stopped');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update timer when settings change and timer is stopped
  useEffect(() => {
    if (currentState === 'stopped') {
      setTimeLeft(settings.workMinutes * 60);
    }
  }, [settings.workMinutes, currentState]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (currentState === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      // Determine next break type
      if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
        setCurrentState('longBreak');
        setTimeLeft(settings.longBreakMinutes * 60);
      } else {
        setCurrentState('shortBreak');
        setTimeLeft(settings.shortBreakMinutes * 60);
      }
    } else {
      // Break completed, start work session
      setCurrentState('work');
      setTimeLeft(settings.workMinutes * 60);
    }

    // Play notification sound (if available)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoTUKzn6KdVEAsLONxHPJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmocBz2a2/LNeSsFJHfH8N2QQAoUXrTp66hVFAo=');
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  const startTimer = () => {
    if (currentState === 'stopped') {
      setCurrentState('work');
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setCurrentState('paused');
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentState('stopped');
    setTimeLeft(settings.workMinutes * 60);
  };

  const skipSession = () => {
    handleTimerComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateInfo = () => {
    switch (currentState) {
      case 'work':
        return { label: 'Work Session', icon: Target, color: 'text-primary', bgColor: 'bg-primary/5' };
      case 'shortBreak':
        return { label: 'Short Break', icon: Coffee, color: 'text-secondary', bgColor: 'bg-secondary/5' };
      case 'longBreak':
        return { label: 'Long Break', icon: Coffee, color: 'text-accent', bgColor: 'bg-accent/5' };
      case 'paused':
        return { label: 'Paused', icon: Pause, color: 'text-warning', bgColor: 'bg-warning/5' };
      default:
        return { label: 'Ready to Start', icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted/20' };
    }
  };

  const stateInfo = getStateInfo();
  const progress = currentState !== 'stopped' ? 
    (1 - timeLeft / (
      currentState === 'work' ? settings.workMinutes * 60 :
      currentState === 'shortBreak' ? settings.shortBreakMinutes * 60 :
      settings.longBreakMinutes * 60
    )) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className={`${stateInfo.bgColor} border border-border rounded-xl p-8 text-center`}>
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 ${stateInfo.color} mb-2`}>
            <stateInfo.icon className="w-5 h-5" />
            <span className="font-medium">{stateInfo.label}</span>
          </div>
          <div className="text-6xl font-bold text-foreground font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        {currentState !== 'stopped' && (
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                currentState === 'work' ? 'bg-primary' :
                currentState === 'shortBreak' ? 'bg-secondary' : 'bg-accent'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="btn-primary flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {currentState === 'stopped' ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="btn-secondary flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {currentState !== 'stopped' && (
            <button
              onClick={skipSession}
              className="btn-accent"
            >
              Skip
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{completedSessions}</div>
          <div className="text-sm text-muted-foreground">Completed Sessions</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-secondary">
            {Math.floor(completedSessions / settings.sessionsUntilLongBreak)}
          </div>
          <div className="text-sm text-muted-foreground">Long Breaks</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {Math.round(completedSessions * settings.workMinutes / 60 * 10) / 10}h
          </div>
          <div className="text-sm text-muted-foreground">Focus Time</div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" />
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>

        {showSettings && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-foreground">Timer Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.workMinutes}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    workMinutes: parseInt(e.target.value) || 25 
                  }))}
                  className="tool-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakMinutes}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    shortBreakMinutes: parseInt(e.target.value) || 5 
                  }))}
                  className="tool-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakMinutes}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    longBreakMinutes: parseInt(e.target.value) || 15 
                  }))}
                  className="tool-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Sessions Until Long Break
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={settings.sessionsUntilLongBreak}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    sessionsUntilLongBreak: parseInt(e.target.value) || 4 
                  }))}
                  className="tool-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About Pomodoro */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">About the Pomodoro Technique</h4>
        <p className="text-sm text-muted-foreground mb-3">
          The Pomodoro Technique is a time management method that uses a timer to break work into intervals, 
          traditionally 25 minutes in length, separated by short breaks.
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Work for 25 minutes with full focus</p>
          <p>• Take a 5-minute short break</p>
          <p>• After 4 work sessions, take a 15-30 minute long break</p>
          <p>• Repeat the cycle to maintain productivity</p>
        </div>
      </div>
    </div>
  );
};