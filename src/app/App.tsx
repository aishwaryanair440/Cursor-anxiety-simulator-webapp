import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [currentSection, setCurrentSection] = useState(0); // 0=intro, 1-13=sections, 14=reflection
  const [anxietyLevel, setAnxietyLevel] = useState(0); // 0-100
  const [sectionAnxiety, setSectionAnxiety] = useState(0); // Anxiety added in current section
  const [showImproved, setShowImproved] = useState(false);

  // Interaction tracking
  const [stats, setStats] = useState({
    totalClicks: 0,
    hesitations: 0,
    retries: 0,
    timeSpent: 0,
    distractions: 0,
    pressureResponses: 0,
    missedClicks: 0,
    rageClicks: 0,
    cursorHesitations: 0,
  });

  // Behavior tracking
  const lastMouseMove = useRef(Date.now());
  const lastClickTime = useRef(0);
  const lastClickedElement = useRef<string | null>(null);
  const clickTimestamps = useRef<number[]>([]);
  const mouseIdleTimer = useRef<NodeJS.Timeout | null>(null);

  // Section 1 - Delayed Feedback
  const [section1Status, setSection1Status] = useState('');
  const [section1Processing, setSection1Processing] = useState(false);
  const [section1Completed, setSection1Completed] = useState(false);
  const [section1Clicks, setSection1Clicks] = useState(0);
  const [section1Progress, setSection1Progress] = useState(0);
  const [section1RetryHint, setSection1RetryHint] = useState('');

  // Section 2 - Confusing Button States
  const [section2Feedback, setSection2Feedback] = useState('');
  const [section2Attempts, setSection2Attempts] = useState(0);
  const [section2Completed, setSection2Completed] = useState(false);
  const [section2Tooltip, setSection2Tooltip] = useState('');

  // Section 3 - Unstable Click Area
  const [section3ButtonPos, setSection3ButtonPos] = useState({ x: 0, y: 0 });
  const [section3Attempts, setSection3Attempts] = useState(0);
  const [section3Completed, setSection3Completed] = useState(false);
  const [section3Hovering, setSection3Hovering] = useState(false);
  const [section3StatusLabel, setSection3StatusLabel] = useState('Ready');
  const [section3HelperText, setSection3HelperText] = useState('Position your cursor over the button');

  // Section 4 - Cognitive Overload
  const [section4Selections, setSection4Selections] = useState<string[]>([]);
  const [section4Toggles, setSection4Toggles] = useState<Record<string, boolean>>({});
  const [section4Dropdown, setSection4Dropdown] = useState('');
  const [section4Status, setSection4Status] = useState('');
  const [section4Completed, setSection4Completed] = useState(false);
  const [section4Summary, setSection4Summary] = useState('No preferences selected');

  // Section 5 - Interruptions & Distractions
  const [section5Toast, setSection5Toast] = useState(false);
  const [section5Modal, setSection5Modal] = useState(false);
  const [section5Banner, setSection5Banner] = useState(true);
  const [section5Footer, setSection5Footer] = useState(true);
  const [section5Completed, setSection5Completed] = useState(false);
  const [section5TaskInput, setSection5TaskInput] = useState('');
  const [section5InterruptCount, setSection5InterruptCount] = useState(0);

  // Section 6 - Pressure & Micro-stress
  const [section6Timer, setSection6Timer] = useState(30);
  const [section6Agreement, setSection6Agreement] = useState(false);
  const [section6NewsletterOptOut, setSection6NewsletterOptOut] = useState(true);
  const [section6Completed, setSection6Completed] = useState(false);

  // Section 7 - False Progress Feedback
  const [section7Progress, setSection7Progress] = useState(0);
  const [section7Waiting, setSection7Waiting] = useState(false);
  const [section7Completed, setSection7Completed] = useState(false);
  const [section7Clicks, setSection7Clicks] = useState(0);
  const [section7WaitTime, setSection7WaitTime] = useState(0);

  // Section 8 - Ambiguous CTA
  const [section8Hovering, setSection8Hovering] = useState('');
  const [section8Completed, setSection8Completed] = useState(false);
  const [section8Attempts, setSection8Attempts] = useState(0);

  // Section 9 - Delayed Error Disclosure
  const [section9FormData, setSection9FormData] = useState({ field1: '', field2: '', field3: '' });
  const [section9Error, setSection9Error] = useState('');
  const [section9Attempts, setSection9Attempts] = useState(0);
  const [section9Completed, setSection9Completed] = useState(false);
  const [section9FieldEdits, setSection9FieldEdits] = useState(0);

  // Section 10 - Hover Deception
  const [section10Attempts, setSection10Attempts] = useState(0);
  const [section10Completed, setSection10Completed] = useState(false);
  const [section10HoverLoops, setSection10HoverLoops] = useState(0);

  // Section 11 - Tiny Click Target
  const [section11MissedClicks, setSection11MissedClicks] = useState(0);
  const [section11Completed, setSection11Completed] = useState(false);

  // Section 12 - Moving Target
  const [section12ButtonPos, setSection12ButtonPos] = useState(0);
  const [section12Attempts, setSection12Attempts] = useState(0);
  const [section12Completed, setSection12Completed] = useState(false);

  // Section 13 - Auto-Advancing Content
  const [section13CurrentSlide, setSection13CurrentSlide] = useState(0);
  const [section13ScrollReversals, setSection13ScrollReversals] = useState(0);
  const [section13Completed, setSection13Completed] = useState(false);
  const [section13ReadTime, setSection13ReadTime] = useState(0);

  const startTime = useRef(Date.now());

  // Anxiety meter text
  const getAnxietyState = () => {
    if (anxietyLevel < 25) return 'Calm';
    if (anxietyLevel < 50) return 'Tense';
    if (anxietyLevel < 75) return 'Frustrated';
    return 'Overloaded';
  };

  const increaseAnxiety = (amount: number) => {
    // Cap per-section anxiety increase at 15
    const newSectionAnxiety = sectionAnxiety + amount;
    if (newSectionAnxiety <= 15) {
      setSectionAnxiety(newSectionAnxiety);
      setAnxietyLevel(prev => Math.min(100, prev + amount));
    }
  };

  // Reset section anxiety when section changes
  useEffect(() => {
    if (currentSection > 0 && currentSection < 14) {
      setSectionAnxiety(0);
    }
  }, [currentSection]);

  const trackClick = () => {
    setStats(prev => ({ ...prev, totalClicks: prev.totalClicks + 1 }));
  };

  const trackHesitation = () => {
    setStats(prev => ({ ...prev, hesitations: prev.hesitations + 1 }));
  };

  const trackRetry = () => {
    setStats(prev => ({ ...prev, retries: prev.retries + 1 }));
    increaseAnxiety(3); // Retry after failure
  };

  const trackDistraction = () => {
    setStats(prev => ({ ...prev, distractions: prev.distractions + 1 }));
  };

  const trackPressure = () => {
    setStats(prev => ({ ...prev, pressureResponses: prev.pressureResponses + 1 }));
  };

  const trackMissedClick = () => {
    setStats(prev => ({ ...prev, missedClicks: prev.missedClicks + 1 }));
    increaseAnxiety(2); // Missed click
  };

  const trackCursorHesitation = () => {
    setStats(prev => ({ ...prev, cursorHesitations: prev.cursorHesitations + 1 }));
    increaseAnxiety(1); // Cursor hesitation
  };

  // Detect rage clicking (rapid clicks)
  const detectRageClick = () => {
    const now = Date.now();
    clickTimestamps.current.push(now);

    // Keep only clicks from last 1 second
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 1000);

    // If 4+ clicks in 1 second, it's rage clicking
    if (clickTimestamps.current.length >= 4) {
      setStats(prev => ({ ...prev, rageClicks: prev.rageClicks + 1 }));
      increaseAnxiety(5); // Rage clicking
      clickTimestamps.current = []; // Reset
      return true;
    }
    return false;
  };

  // Detect repeated clicks on same element
  const detectRepeatedClick = (elementId: string) => {
    const now = Date.now();
    if (lastClickedElement.current === elementId && now - lastClickTime.current < 2000) {
      increaseAnxiety(3); // Repeated clicks on same element
    }
    lastClickedElement.current = elementId;
    lastClickTime.current = now;
  };

  // Track mouse movement and detect hesitation
  useEffect(() => {
    if (currentSection > 0 && currentSection < 14) {
      const handleMouseMove = () => {
        lastMouseMove.current = Date.now();

        // Clear existing timer
        if (mouseIdleTimer.current) {
          clearTimeout(mouseIdleTimer.current);
        }

        // Set new timer for 2 seconds
        mouseIdleTimer.current = setTimeout(() => {
          trackCursorHesitation();
        }, 2000);
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (mouseIdleTimer.current) {
          clearTimeout(mouseIdleTimer.current);
        }
      };
    }
  }, [currentSection]);

  // Section 1: Delayed Feedback
  const handleSection1Primary = () => {
    if (section1Processing) {
      setSection1Clicks(prev => prev + 1);
      trackClick();
      trackRetry();
      detectRageClick();
      setSection1RetryHint('Already processing... please wait');
      setTimeout(() => setSection1RetryHint(''), 1500);
      return;
    }

    trackClick();
    detectRepeatedClick('section1-primary');
    setSection1Processing(true);
    setSection1Status('Processing...');
    setSection1Progress(0);

    const interval = setInterval(() => {
      setSection1Progress(prev => {
        if (prev < 40) return prev + 2;
        if (prev < 75) return prev + 0.5;
        return prev;
      });
    }, 200);

    setTimeout(() => {
      setSection1Status('Still working...');
    }, 2000);

    setTimeout(() => {
      setSection1Status('Almost there...');
    }, 4000);

    setTimeout(() => {
      setSection1Status('Complete!');
      setSection1Completed(true);
      setSection1Processing(false);
      setSection1Progress(100);
      clearInterval(interval);
    }, 6000);
  };

  const handleSection1Secondary = () => {
    trackClick();
    trackHesitation();
    detectRepeatedClick('section1-secondary');
    increaseAnxiety(1);
  };

  const handleSection1Tertiary = () => {
    trackClick();
    detectRepeatedClick('section1-tertiary');
  };

  // Section 2: Confusing Button States
  const handleSection2Button = (buttonId: number) => {
    trackClick();
    detectRageClick();
    detectRepeatedClick(`section2-button-${buttonId}`);
    setSection2Attempts(prev => prev + 1);

    if (buttonId === 3) {
      setSection2Feedback('Success! Moving to next section...');
      setSection2Completed(true);
      setTimeout(() => setCurrentSection(3), 1500);
    } else {
      setSection2Feedback('This button is not responding. Try another one.');
      trackRetry();
      setTimeout(() => setSection2Feedback(''), 2000);
    }
  };

  const showTooltip = (text: string) => {
    setSection2Tooltip(text);
    setTimeout(() => setSection2Tooltip(''), 1000);
  };

  // Section 3: Unstable Click Area
  const handleSection3Hover = () => {
    if (!section3Completed) {
      setSection3Hovering(true);
      const newX = (Math.random() - 0.5) * 100;
      const newY = (Math.random() - 0.5) * 60;
      setSection3ButtonPos({ x: newX, y: newY });
      setSection3StatusLabel('Target moved');
      setSection3HelperText('Button has shifted position');
      trackHesitation();
      increaseAnxiety(2);
    }
  };

  const handleSection3Click = () => {
    trackClick();
    detectRepeatedClick('section3-main');
    setSection3Attempts(prev => prev + 1);

    if (section3Attempts >= 2) {
      setSection3Completed(true);
      setSection3StatusLabel('Success');
      setSection3HelperText('You successfully clicked the button!');
    } else {
      trackRetry();
      setSection3StatusLabel('Try again');
      setSection3HelperText(`Attempt ${section3Attempts + 1} failed. Keep trying...`);
    }
  };

  // Section 4: Cognitive Overload
  const handleSection4Checkbox = (option: string) => {
    trackClick();
    detectRepeatedClick(`section4-checkbox-${option}`);
    const newSelections = section4Selections.includes(option)
      ? section4Selections.filter(o => o !== option)
      : [...section4Selections, option];
    setSection4Selections(newSelections);

    // Update summary
    setSection4Summary(
      newSelections.length === 0
        ? 'No preferences selected'
        : `${newSelections.length} option${newSelections.length > 1 ? 's' : ''} selected`
    );

    increaseAnxiety(1);
  };

  const handleSection4Toggle = (key: string) => {
    trackClick();
    detectRepeatedClick(`section4-toggle-${key}`);
    setSection4Toggles(prev => ({ ...prev, [key]: !prev[key] }));
    increaseAnxiety(1);

    // Auto-changing status
    const messages = [
      'Settings updating...',
      'Recalculating preferences...',
      'Syncing across devices...',
      'Validating selections...',
    ];
    setSection4Status(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => setSection4Status(''), 2000);
  };

  const handleSection4Submit = () => {
    trackClick();
    detectRepeatedClick('section4-submit');
    if (section4Selections.length < 3) {
      setSection4Status('Please select at least 3 options to continue');
      trackRetry();
    } else {
      setSection4Status('Preferences saved!');
      setSection4Completed(true);
    }
  };

  // Section 5: Interruptions & Distractions
  useEffect(() => {
    if (currentSection === 5 && !section5Completed) {
      // Toast appears after 2 seconds
      const toastTimer = setTimeout(() => {
        setSection5Toast(true);
        trackDistraction();
        increaseAnxiety(3);
        setTimeout(() => setSection5Toast(false), 4000);
      }, 2000);

      // Modal appears after 5 seconds
      const modalTimer = setTimeout(() => {
        setSection5Modal(true);
        setSection5InterruptCount(prev => prev + 1);
        trackDistraction();
        increaseAnxiety(4);
      }, 5000);

      return () => {
        clearTimeout(toastTimer);
        clearTimeout(modalTimer);
      };
    }
  }, [currentSection, section5Completed]);

  const handleSection5Complete = () => {
    if (section5TaskInput.length < 5) {
      trackRetry();
      return;
    }
    trackClick();
    setSection5Completed(true);
  };

  // Section 6: Pressure & Micro-stress
  useEffect(() => {
    if (currentSection === 6 && section6Timer > 0 && !section6Completed) {
      const interval = setInterval(() => {
        setSection6Timer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          if (prev === 10) increaseAnxiety(3);
          if (prev === 5) increaseAnxiety(4);
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentSection, section6Completed, section6Timer]);

  const handleSection6Submit = () => {
    trackClick();
    trackPressure();
    detectRepeatedClick('section6-submit');
    if (!section6Agreement) {
      trackRetry();
      return;
    }
    setSection6Completed(true);
  };

  // Section 7: False Progress Feedback
  const handleSection7Start = () => {
    if (section7Waiting) {
      setSection7Clicks(prev => prev + 1);
      detectRageClick();
      detectRepeatedClick('section7-progress');
      return;
    }

    trackClick();
    setSection7Waiting(true);
    setSection7Progress(0);
    const startTime = Date.now();

    // Fast progress to 85%
    const fastInterval = setInterval(() => {
      setSection7Progress(prev => {
        if (prev >= 85) {
          clearInterval(fastInterval);
          // Then slow crawl
          const slowInterval = setInterval(() => {
            setSection7Progress(p => {
              if (p >= 90) {
                clearInterval(slowInterval);
                // Pause at 90%
                setTimeout(() => {
                  setSection7Progress(100);
                  setSection7Completed(true);
                  setSection7Waiting(false);
                }, 3000);
                return p;
              }
              return p + 0.5;
            });
          }, 500);
          return 85;
        }
        return prev + 5;
      });
    }, 100);

    // Track wait time
    const waitTimer = setInterval(() => {
      setSection7WaitTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    setTimeout(() => clearInterval(waitTimer), 10000);
  };

  // Section 8: Ambiguous CTA
  const handleSection8Button = (buttonId: string) => {
    trackClick();
    detectRepeatedClick(`section8-${buttonId}`);
    setSection8Attempts(prev => prev + 1);

    if (buttonId === 'proceed') {
      setSection8Completed(true);
    } else {
      trackRetry();
      trackHesitation();
    }
  };

  // Section 9: Delayed Error Disclosure
  const handleSection9Submit = () => {
    trackClick();
    detectRepeatedClick('section9-submit');
    setSection9Attempts(prev => prev + 1);

    // Always show error on first submit
    if (section9Attempts === 0 || !section9FormData.field1 || !section9FormData.field2 || !section9FormData.field3) {
      setSection9Error('Something is wrong. Please check your entries.');
      trackRetry();
      increaseAnxiety(2);
      setTimeout(() => setSection9Error(''), 3000);
    } else {
      setSection9Completed(true);
    }
  };

  // Section 10: Hover Deception
  const handleSection10Click = () => {
    trackClick();
    detectRageClick();
    detectRepeatedClick('section10-fake');
    setSection10Attempts(prev => prev + 1);
    setSection10HoverLoops(prev => prev + 1);

    // Add delay to response
    setTimeout(() => {
      if (section10Attempts >= 2) {
        setSection10Completed(true);
      } else {
        trackRetry();
      }
    }, 1000);
  };

  // Section 11: Tiny Click Target
  const handleSection11AreaClick = () => {
    setSection11MissedClicks(prev => prev + 1);
    trackMissedClick();
    detectRageClick();
  };

  const handleSection11Success = () => {
    trackClick();
    setSection11Completed(true);
  };

  // Section 12: Moving Target
  const handleSection12Hover = () => {
    if (!section12Completed && section12Attempts < 3) {
      const newPos = section12ButtonPos === 0 ? 150 : section12ButtonPos === 150 ? -150 : 0;
      setSection12ButtonPos(newPos);
      increaseAnxiety(2);
    }
  };

  const handleSection12Click = () => {
    trackClick();
    detectRepeatedClick('section12-moving');
    setSection12Attempts(prev => prev + 1);

    if (section12Attempts >= 2) {
      setSection12Completed(true);
    } else {
      trackRetry();
    }
  };

  // Section 13: Auto-Advancing Content
  useEffect(() => {
    if (currentSection === 13 && !section13Completed) {
      const timer = setInterval(() => {
        setSection13CurrentSlide(prev => {
          if (prev >= 3) {
            setSection13Completed(true);
            return prev;
          }
          return prev + 1;
        });
      }, 3000); // Auto-advance every 3 seconds

      const readTimer = setInterval(() => {
        setSection13ReadTime(prev => prev + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
        clearInterval(readTimer);
      };
    }
  }, [currentSection, section13Completed]);

  const handleRestart = () => {
    setCurrentSection(0);
    setAnxietyLevel(0);
    setSectionAnxiety(0);
    setShowImproved(false);
    setStats({
      totalClicks: 0,
      hesitations: 0,
      retries: 0,
      timeSpent: 0,
      distractions: 0,
      pressureResponses: 0,
      missedClicks: 0,
      rageClicks: 0,
      cursorHesitations: 0,
    });
    clickTimestamps.current = [];
    lastClickedElement.current = null;

    // Reset all section states
    setSection1Status('');
    setSection1Processing(false);
    setSection1Completed(false);
    setSection1Clicks(0);
    setSection1Progress(0);
    setSection1RetryHint('');
    setSection2Feedback('');
    setSection2Attempts(0);
    setSection2Completed(false);
    setSection2Tooltip('');
    setSection3ButtonPos({ x: 0, y: 0 });
    setSection3Attempts(0);
    setSection3Completed(false);
    setSection3Hovering(false);
    setSection3StatusLabel('Ready');
    setSection3HelperText('Position your cursor over the button');
    setSection4Selections([]);
    setSection4Toggles({});
    setSection4Dropdown('');
    setSection4Status('');
    setSection4Completed(false);
    setSection4Summary('No preferences selected');
    setSection5Toast(false);
    setSection5Modal(false);
    setSection5Banner(true);
    setSection5Footer(true);
    setSection5Completed(false);
    setSection5TaskInput('');
    setSection5InterruptCount(0);
    setSection6Timer(30);
    setSection6Agreement(false);
    setSection6NewsletterOptOut(true);
    setSection6Completed(false);
    setSection7Progress(0);
    setSection7Waiting(false);
    setSection7Completed(false);
    setSection7Clicks(0);
    setSection7WaitTime(0);
    setSection8Hovering('');
    setSection8Completed(false);
    setSection8Attempts(0);
    setSection9FormData({ field1: '', field2: '', field3: '' });
    setSection9Error('');
    setSection9Attempts(0);
    setSection9Completed(false);
    setSection9FieldEdits(0);
    setSection10Attempts(0);
    setSection10Completed(false);
    setSection10HoverLoops(0);
    setSection11MissedClicks(0);
    setSection11Completed(false);
    setSection12ButtonPos(0);
    setSection12Attempts(0);
    setSection12Completed(false);
    setSection13CurrentSlide(0);
    setSection13ScrollReversals(0);
    setSection13Completed(false);
    setSection13ReadTime(0);
    startTime.current = Date.now();
  };

  useEffect(() => {
    if (currentSection === 14) {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      setStats(prev => ({ ...prev, timeSpent: elapsed }));
    }
  }, [currentSection]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-500/20 px-4 py-8 md:py-12" style={{ fontFamily: '\"Plus Jakarta Sans\", \"Inter\", sans-serif' }}>

      {/* Global Progress Bar - Fixed at top */}
      {currentSection > 0 && currentSection < 14 && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200/50 z-[100] backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
            style={{ width: `${(currentSection / 13) * 100}%` }}
          />
        </div>
      )}

      {/* Premium Header */}
      {currentSection > 0 && currentSection < 14 && (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-5xl px-4 pointer-events-none">
          <div className="glass-panel px-6 py-3 flex items-center justify-between shadow-2xl pointer-events-auto border-white/40 ring-1 ring-black/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <span className="font-black text-xs">UX</span>
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight text-slate-800 uppercase">Friction Lab</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol {currentSection} / 13</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-xs mx-12 flex-col gap-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bio-Stress Level</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${anxietyLevel > 70 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                  {getAnxietyState()}
                </span>
              </div>
              <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{
                    width: `${anxietyLevel}%`,
                    background: anxietyLevel < 40 ? '#3b82f6' : anxietyLevel < 70 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all border-l border-slate-200 ml-4 pl-4 hover:scale-105"
            >
              Terminate
            </button>
          </div>
        </header>
      )}

      <div className={currentSection > 0 && currentSection < 14 ? 'pt-24 pb-20' : 'py-12'}>

        {/* Introduction Screen */}
        {currentSection === 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="glass-panel p-12 md:p-20 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 mb-10 shadow-2xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                <h1 className="text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-transparent transform transition-all">
                  The Anxiety Simulator
                </h1>

                <p className="text-2xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-normal">
                  An interactive deep-dive into the <span className="text-indigo-600 font-bold italic underline decoration-blue-500/30 underline-offset-8">Dark Patterns</span> that define the modern web.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-16">
                  {[
                    { title: "Behavioral Tracking", desc: "We monitor cursor velocity, hesitation, and rage-clicks.", icon: "🎯" },
                    { title: "Biological Stress", desc: "Experience the physical toll of poor interface design.", icon: "🧬" },
                    { title: "Hostile Patterns", desc: "13 curated sections of intentional digital obstruction.", icon: "⚔️" },
                    { title: "Final Exposure", desc: "Receive a full cognitive analysis of your performance.", icon: "📊" }
                  ].map((item, i) => (
                    <div key={i} className="glass-panel bg-white/50 border-white/80 p-6 flex gap-4 hover:shadow-xl transition-all duration-300">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSection(1)}
                  className="glass-button px-14 py-6 text-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all bg-blue-600 text-white relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Initialize Protocol
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </button>

                <p className="text-[10px] text-slate-400 mt-10 font-black uppercase tracking-[0.3em]">
                  Scientific Analysis in Progress
                </p>
              </div>
            </div>
          </div>
        )}


        {/* Section 1: Latency Frustration */}
        {currentSection === 1 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 01: Latency Frustration</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Delayed feedback and uncertain system states.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Feedback Gap
                </div>
              </div>

              <div className="space-y-10">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-12 text-center shadow-inner">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">System Handshake Required</h3>

                  <div className="flex flex-col items-center gap-8">
                    <button
                      onClick={handleSection1Primary}
                      disabled={section1Completed}
                      className={`min-w-[280px] px-10 py-5 rounded-2xl font-black text-xl transition-all duration-500 flex items-center justify-center gap-4 ${section1Completed
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 cursor-not-allowed'
                        : section1Processing
                          ? 'bg-amber-100 text-amber-700 border-2 border-amber-200'
                          : 'glass-button bg-blue-600 text-white shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95'
                        }`}
                    >
                      {section1Processing && (
                        <div className="w-5 h-5 border-[3px] border-amber-400 border-t-transparent rounded-full animate-spin" />
                      )}
                      {section1Completed ? 'Success Received ✓' : section1Processing ? 'Processing Batch...' : 'Establish Secure Connection'}
                    </button>

                    <button
                      onClick={handleSection1Secondary}
                      className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                      disabled={section1Processing || section1Completed}
                    >
                      Abort Operation
                    </button>
                  </div>

                  {section1Processing && (
                    <div className="mt-12 max-w-md mx-auto animate-in fade-in duration-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Syncing Data...</span>
                        <span className="text-xs font-black text-blue-600">{Math.floor(section1Progress)}%</span>
                      </div>
                      <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden p-0.5 border border-white/40 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          style={{ width: `${section1Progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {(section1Status || section1RetryHint) && (
                    <div className="mt-12 p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50 text-left animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 mb-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                        <span className="text-lg">⚡</span>
                        System Log
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed italic">{section1Status || section1RetryHint}</p>
                    </div>
                  )}
                </div>

                <div className="glass-panel bg-amber-500/5 border-l-4 border-l-amber-500 p-8 flex gap-6">
                  <div className="text-3xl text-amber-600">⚠️</div>
                  <div>
                    <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight mb-1">Behavioral Analysis: Uncertain Wait Times</h4>
                    <p className="text-sm text-amber-800/80 font-medium leading-relaxed">
                      Human psychology is hard-wired to find uncertainty stressful. When a system provides no feedback during high-latency events,
                      users lose their sense of agency, leading to <span className="font-bold underline">repetitive clicking</span>—a direct metabolic cost of poor design.
                    </p>
                  </div>
                </div>

                {section1Completed && (
                  <div className="flex justify-end pt-6 animate-in fade-in duration-500">
                    <button
                      onClick={() => setCurrentSection(2)}
                      className="glass-button px-10 py-4 font-black text-lg bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                    >
                      Continue Protocol 02 →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Section 2: Affordance Deception */}
        {currentSection === 2 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 02: Affordance Deception</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Unclear UI states and misleading visual cues.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Visual Ambiguity
                </div>
              </div>

              <div className="space-y-10">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-12 shadow-inner">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 text-center">Locate the functional affordance</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                      { id: 1, label: "Confirm Action", style: "opacity-40 cursor-not-allowed bg-slate-200", hint: "Looks disabled" },
                      { id: 2, label: "Next Step", style: "bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/20", hint: "Primary action?" },
                      { id: 3, label: "Skip", style: "border-2 border-slate-200 text-slate-400 italic font-medium", hint: "Secondary link" },
                      { id: 4, label: "Proceed →", style: "bg-green-600 text-white font-black shadow-lg shadow-green-500/20", hint: "Looks functional" },
                      { id: 5, label: "Cancel", style: "text-red-500 font-bold underline underline-offset-4", hint: "Destructive link" },
                      { id: 6, label: "Update Now", style: "bg-blue-500 text-white shadow-inner", hint: "System update" },
                      { id: 7, label: "⚙️", style: "w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center mx-auto", hint: "Settings gear" },
                      { id: 8, label: "Click to continue", style: "text-blue-600 font-black text-xs uppercase tracking-widest hover:underline", hint: "Text trigger" }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleSection2Button(btn.id)}
                        onMouseEnter={() => showTooltip(btn.hint)}
                        className={`p-4 rounded-xl transition-all duration-300 text-sm ${btn.style} ${section2Completed ? 'opacity-50 grayscale' : 'hover:scale-105 active:scale-95'}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-[60px] flex flex-col items-center justify-center gap-4">
                    {section2Tooltip && (
                      <div className="px-4 py-2 rounded-lg bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest animate-in zoom-in-95 duration-200">
                        {section2Tooltip}
                      </div>
                    )}

                    {section2Feedback && (
                      <div className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-3 animate-in fade-in duration-500 ${section2Completed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                        <span>{section2Feedback}</span>
                        {section2Completed && <span className="text-xl">✓</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="glass-panel bg-purple-500/5 border-l-4 border-l-purple-500 p-8 flex gap-6">
                  <div className="text-3xl text-purple-600">🧠</div>
                  <div>
                    <h4 className="font-black text-purple-900 text-sm uppercase tracking-tight mb-1">Pattern Analysis: False Affordance</h4>
                    <p className="text-sm text-purple-800/80 font-medium leading-relaxed">
                      Design creates <span className="italic font-bold">Expectations</span>. When an element looks inactive but works (or vice versa), it forces the user to interact via trial-and-error.
                      This erodes the mental model of the interface, turning navigation into a guessing game.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(1)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section2Completed && (
                    <button
                      onClick={() => setCurrentSection(3)}
                      className="glass-button px-10 py-4 font-black text-lg bg-purple-600 text-white shadow-xl shadow-purple-500/20"
                    >
                      Continue Protocol 03 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Kinetic Obstruction */}
        {currentSection === 3 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 03: Kinetic Obstruction</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Unstable targets and mechanical friction.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Target Shift
                </div>
              </div>

              <div className="space-y-10">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-12 shadow-inner relative overflow-hidden h-[400px]">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 text-center relative z-10">Capture the primary trigger</h3>

                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-700" />
                  </div>

                  <div
                    className="absolute z-20"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${section3ButtonPos.x}px), calc(-50% + ${section3ButtonPos.y}px))`,
                      transition: section3Completed ? 'all 0.5s ease-out' : 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <button
                      onMouseEnter={handleSection3Hover}
                      onMouseLeave={() => setSection3Hovering(false)}
                      onClick={handleSection3Click}
                      disabled={section3Completed}
                      className={`min-w-[240px] px-8 py-5 rounded-2xl font-black text-lg transition-all duration-300 ${section3Completed
                        ? 'bg-green-500 text-white shadow-2xl shadow-green-500/30'
                        : 'glass-button bg-blue-600 text-white shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95'
                        }`}
                    >
                      {section3Completed ? 'Target Captured ✓' : 'Establish Link'}
                    </button>
                  </div>

                  {!section3Completed && (
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                      <button className="absolute top-[20%] left-[25%] p-4 rounded-xl border border-slate-200 text-slate-300 text-xs font-bold pointer-events-auto cursor-not-allowed">Settings</button>
                      <button className="absolute bottom-[20%] right-[25%] p-4 rounded-xl border border-slate-200 text-slate-300 text-xs font-bold pointer-events-auto cursor-not-allowed">Profile</button>
                    </div>
                  )}

                  <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center px-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Velocity</span>
                        <span className="text-xs font-bold text-slate-600">Adaptive</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attempts</span>
                        <span className={`text-xs font-bold ${section3Attempts > 2 ? 'text-red-500' : 'text-slate-600'}`}>{section3Attempts}</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                      {section3Hovering && !section3Completed ? 'Target Evading...' : ''}
                    </div>
                  </div>
                </div>

                <div className="glass-panel bg-pink-500/5 border-l-4 border-l-pink-500 p-8 flex gap-6">
                  <div className="text-3xl text-pink-600">⚙️</div>
                  <div>
                    <h4 className="font-black text-pink-900 text-sm uppercase tracking-tight mb-1">Behavioral Analysis: Mechanical Friction</h4>
                    <p className="text-sm text-pink-800/80 font-medium leading-relaxed">
                      Kinetic obstruction subverts the user's motor planning. When an interface element moves <span className="italic">at the moment of intent</span>,
                      it creates a profound sense of powerlessness and irritation. This pattern is commonly used in intrusive ads to force accidental clicks on surrounding elements.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(2)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section3Completed && (
                    <button
                      onClick={() => setCurrentSection(4)}
                      className="glass-button px-10 py-4 font-black text-lg bg-pink-600 text-white shadow-xl shadow-pink-500/20"
                    >
                      Continue Protocol 04 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Cognitive Paralysis */}
        {currentSection === 4 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 04: Cognitive Paralysis</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Decision fatigue through excessive configuration.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Choice Overload
                </div>
              </div>

              <div className="space-y-10">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-10 shadow-inner">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 pb-6">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Status Report</h3>
                      <p className="text-sm font-bold text-slate-600">{section4Summary}</p>
                    </div>
                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      Live Sync Active
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Primary Permissions</h4>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {[
                          { label: 'Enable automatic updates', info: 'Recommended' },
                          { label: 'Receive promotional emails', info: null },
                          { label: 'Share usage analytics', info: 'Helps improve service' },
                          { label: 'Allow cookies for personalization', info: 'Required' },
                          { label: 'Enable experimental features', info: 'Unstable' },
                          { label: 'Sync settings across devices', info: null },
                          { label: 'Participate in beta testing', info: null },
                          { label: 'Send crash reports', info: 'Anonymous' },
                          { label: 'Allow location tracking', info: 'Personalized' },
                          { label: 'Enable push notifications', info: null },
                        ].map((option, idx) => (
                          <label key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/60 transition-colors cursor-pointer group">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={section4Selections.includes(option.label)}
                                onChange={() => handleSection4Checkbox(option.label)}
                                className="w-5 h-5 rounded-md border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 group-hover:border-indigo-400 transition-colors"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-700">{option.label}</p>
                              {option.info && <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{option.info}</p>}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Parameters</h4>
                        <div className="glass-panel bg-slate-50 border-slate-200/60 p-6 space-y-4">
                          {['Public Profile', 'Matrix Sync', 'De-identified Tracking'].map((setting) => (
                            <div key={setting} className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-600">{setting}</span>
                              <button
                                onClick={() => handleSection4Toggle(setting)}
                                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${section4Toggles[setting] ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-slate-300'
                                  }`}
                              >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${section4Toggles[setting] ? 'translate-x-6' : 'translate-x-0'
                                  }`} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Interaction Frequency</h4>
                        <select
                          value={section4Dropdown}
                          onChange={(e) => setSection4Dropdown(e.target.value)}
                          className="w-full bg-white/50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        >
                          <option value="">Select frequency...</option>
                          <option value="realtime">Real-time / Instant</option>
                          <option value="hourly">Hourly Digest</option>
                          <option value="daily">Daily Summary</option>
                          <option value="never">Manual Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {section4Status && (
                    <div className="mt-10 p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold animate-in slide-in-from-bottom-2 duration-300">
                      {section4Status}
                    </div>
                  )}
                </div>

                <div className="glass-panel bg-indigo-500/5 border-l-4 border-l-indigo-500 p-8 flex gap-6">
                  <div className="text-3xl text-indigo-600">🧠</div>
                  <div>
                    <h4 className="font-black text-indigo-900 text-sm uppercase tracking-tight mb-1">Behavioral Analysis: Decision Fatigue</h4>
                    <p className="text-sm text-indigo-800/80 font-medium leading-relaxed">
                      This pattern creates "Decision Fatigue" by presenting too many non-essential choices.
                      When overwhelmed, users often abandon the process or revert to defaults, which are often configured to benefit the platform rather than the user (the "Default Effect").
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(3)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <div className="flex gap-4">
                    <button
                      onClick={() => increaseAnxiety(5)}
                      className="px-6 py-3 border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                      Reset Defaults
                    </button>
                    <button
                      onClick={handleSection4Submit}
                      disabled={section4Completed}
                      className={`glass-button px-10 py-4 font-black transition-all ${section4Completed
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                        }`}
                    >
                      {section4Completed ? 'Confirmed ✓' : 'Commit Configuration'}
                    </button>
                  </div>
                </div>
                {section4Completed && (
                  <div className="flex justify-end pt-4 animate-in fade-in duration-500">
                    <button
                      onClick={() => setCurrentSection(5)}
                      className="glass-button px-10 py-4 font-black text-lg bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                    >
                      Continue Protocol 05 →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Interruptions & Distractions */}
        {currentSection === 5 && (
          <div className="max-w-5xl mx-auto px-6">
            {section5Banner && (
              <div className="glass-panel bg-orange-500/90 text-white p-4 mb-6 flex items-center justify-between shadow-lg backdrop-blur-md animate-in slide-in-from-top-5 duration-500">
                <div className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  Limited Time Offer: Upgrade now and save 50%! Expires in 2 hours.
                </div>
                <button
                  onClick={() => {
                    setSection5Banner(false);
                    trackClick();
                    trackDistraction();
                    increaseAnxiety(2);
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="glass-panel p-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Section 5: Interruptions & Distractions</h2>
                  <p className="text-muted-foreground">Complete the task while managing interruptions</p>
                </div>
                <div className="text-xs font-medium text-purple-700 bg-purple-100/50 px-3 py-1 rounded-full border border-purple-200/50 backdrop-blur-sm">
                  Pattern: Attention Hijacking
                </div>
              </div>

              <div className="border-t border-gray-200/30 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  Try to complete the task below. You will be interrupted by various UI elements designed to break your focus.
                </p>

                <div className="bg-white/40 border border-white/50 rounded-xl p-8 mb-6 shadow-sm backdrop-blur-md">
                  <h3 className="text-sm font-semibold mb-4 text-foreground/80 uppercase tracking-wider">Simple Task: User Feedback</h3>

                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Your thoughts on the experiment so far?</label>
                    <textarea
                      value={section5TaskInput}
                      onChange={(e) => setSection5TaskInput(e.target.value)}
                      className="glass-input w-full p-4 text-sm h-32"
                      placeholder="Start typing..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs font-bold text-muted-foreground">
                        Require at least 15 characters: {section5TaskInput.length} / 15
                      </div>
                      <div className="text-[10px] uppercase tracking-widest font-black text-orange-600">
                        Interruptions: {section5InterruptCount}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={() => setCurrentSection(4)}
                    className="px-6 py-3 border border-gray-300 bg-white/50 hover:bg-white rounded-lg transition-colors font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSection5Complete}
                    disabled={section5Completed}
                    className={`glass-button px-10 py-3 font-bold ${section5Completed ? 'bg-green-500 text-white' : ''}`}
                  >
                    {section5Completed ? 'Task Complete ✓' : 'Submit Response'}
                  </button>
                </div>

              </div>

              {section5Footer && (
                <div className="glass-panel mt-6 p-6 flex items-center justify-between shadow-2xl border-l-4 border-l-orange-500 animate-in slide-in-from-bottom-5">
                  <div className="text-sm flex items-center gap-4 text-slate-700 font-medium">
                    <span className="text-2xl">🍪</span>
                    <span>We use "essential" cookies to monitor your behavioral deviations.</span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => { increaseAnxiety(1); }} className="px-5 py-2 text-[10px] font-black hover:bg-slate-100 rounded-xl transition-all uppercase tracking-[0.2em] text-slate-400">Settings</button>
                    <button
                      onClick={() => { setSection5Footer(false); trackDistraction(); }}
                      className="glass-button bg-slate-900 text-white px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 6: Pressure & Scarcity */}
        {currentSection === 6 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className={`text-2xl px-8 py-4 rounded-2xl font-black border backdrop-blur-xl transition-all duration-500 shadow-2xl ${section6Timer > 15
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : section6Timer > 5
                    ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse'
                    : 'bg-red-50 text-red-600 border-red-200 animate-[bounce_1s_infinite]'
                  }`}>
                  {section6Timer > 0 ? `⏱ 00:${section6Timer.toString().padStart(2, '0')}` : '⚠️ SESSION EXPIRED'}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 06: Pressure & Scarcity</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Artificial urgency and social-proof manipulation.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Temporal Pressure
                </div>
              </div>

              <div className="space-y-10">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-10 shadow-inner">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Final Compliance Verification</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-3">
                        {[11, 12, 13, 14, 15].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/100?img=${i}`} alt="active user" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse ml-2">
                        124 Users viewing now
                      </span>
                    </div>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-6">
                    <label className="flex items-start gap-5 p-6 rounded-2xl bg-white/50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group">
                      <div className="relative flex items-center h-6">
                        <input
                          type="checkbox"
                          className="w-6 h-6 rounded-lg border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                          checked={section6Agreement}
                          onChange={(e) => { setSection6Agreement(e.target.checked); trackClick(); }}
                        />
                      </div>
                      <span className="text-sm font-bold leading-relaxed text-slate-700">
                        I hereby acknowledge the <span className="underline decoration-indigo-500/30 underline-offset-4 text-indigo-600 cursor-help">Mandatory Arbitration Clause</span> and agree to the perpetual auto-renewal of all sub-licensed data processing scripts.
                      </span>
                    </label>

                    <label className="flex items-start gap-5 p-6 rounded-2xl bg-white/50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer group">
                      <div className="relative flex items-center h-6">
                        <input
                          type="checkbox"
                          className="w-6 h-6 rounded-lg border-2 border-slate-300 text-red-600 focus:ring-red-500 transition-all cursor-pointer"
                          checked={!section6NewsletterOptOut}
                          onChange={(e) => { setSection6NewsletterOptOut(!e.target.checked); trackClick(); }}
                        />
                      </div>
                      <span className="text-sm font-bold leading-relaxed text-slate-700">
                        Do <span className="text-red-600 font-black italic underline decoration-red-500/20 underline-offset-4">not</span> unsubscribe me from the three-times-daily marketing pulse, partner data-shares, and experimental psychological updates.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel bg-red-500/5 border-l-4 border-l-red-500 p-8 flex gap-6">
                    <div className="text-3xl text-red-600">⏱</div>
                    <div>
                      <h4 className="font-black text-red-900 text-sm uppercase tracking-tight mb-1">Pattern: Artificial Scarcity</h4>
                      <p className="text-sm text-red-800/80 font-medium leading-relaxed">
                        Countdown timers and "low stock" indicators bypass the rational prefrontal cortex, triggering a "fight or flight" response that forces quick, uncritical decisions.
                      </p>
                    </div>
                  </div>
                  <div className="glass-panel bg-blue-500/5 border-l-4 border-l-blue-500 p-8 flex gap-6">
                    <div className="text-3xl text-blue-600">🔀</div>
                    <div>
                      <h4 className="font-black text-blue-900 text-sm uppercase tracking-tight mb-1">Pattern: Double Negatives</h4>
                      <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                        Linguistic ambiguity (e.g. "Do not unsubscribe") subverts the user's intent, leading to accidental consent. This is a primary tool for "dark" subscription growth.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(5)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSection6Submit}
                    disabled={section6Completed}
                    className={`glass-button px-10 py-4 font-black transition-all ${section6Completed
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:-translate-y-1'
                      }`}
                  >
                    {section6Completed ? 'Compliance Validated ✓' : 'Complete Action'}
                  </button>
                </div>
              </div>

              {section6Completed && (
                <div className="flex justify-end pt-8">
                  <button
                    onClick={() => setCurrentSection(7)}
                    className="glass-button px-12 py-5 font-black text-xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 hover:scale-105 transition-all"
                  >
                    Proceed to Protocol 07 →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 7: False Progress Feedback */}
        {currentSection === 7 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 07: False Progress Feedback</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Analyzing the psychological impact of non-linear wait times.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Deceptive Progress
                </div>
              </div>

              <div className="space-y-12">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-12 text-center shadow-inner">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">System Synchronization Laboratory</h3>

                  <div className="flex justify-center mb-12">
                    <button
                      onClick={handleSection7Start}
                      disabled={section7Waiting || section7Completed}
                      className={`glass-button px-12 py-5 font-black text-lg transition-all ${section7Waiting || section7Completed
                        ? 'opacity-50 cursor-not-allowed grayscale'
                        : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:-translate-y-1'
                        }`}
                    >
                      {section7Completed ? 'Synchronization Complete ✓' : section7Waiting ? 'Calibrating Data Streams...' : 'Initialize Secure Sync'}
                    </button>
                  </div>

                  {(section7Waiting || section7Completed) && (
                    <div className="max-w-xl mx-auto space-y-6">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Task Status: {section7Progress >= 100 ? 'Verified' : 'Active'}</span>
                        <span className="text-indigo-600">Integrity: {Math.floor(section7Progress)}%</span>
                      </div>

                      <div className="w-full h-4 bg-slate-200/50 rounded-2xl overflow-hidden p-1 border border-slate-200/60">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl transition-all relative overflow-hidden"
                          style={{
                            width: `${section7Progress}%`,
                            transitionDuration: section7Progress < 85 ? '300ms' : '2000ms'
                          }}
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:40px_40px] animate-[shimmer_2s_linear_infinite]" />
                        </div>
                      </div>

                      {section7Waiting && section7Progress >= 85 && section7Progress < 100 && (
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                          <span className="text-xl">⚠️</span>
                          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-normal">
                            Congestion detected in the synaptic layer... optimizing handshake packets.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel bg-blue-500/5 border-l-4 border-l-blue-500 p-8 flex gap-6">
                    <div className="text-3xl text-blue-600">🧠</div>
                    <div>
                      <h4 className="font-black text-blue-900 text-sm uppercase tracking-tight mb-1">Behavioral Analysis: Waiting Anxiety</h4>
                      <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                        Non-linear progress bars exploit the "End-Peak Rule." When a task slows down at 99%, it creates significant psychological friction, making the last 1% feel more taxing than the preceding 99%.
                      </p>
                    </div>
                  </div>
                  <div className="glass-panel bg-slate-500/5 border-l-4 border-l-slate-400 p-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Metrics</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-500">Wait Duration:</span>
                        <span className="text-2xl font-black text-slate-800">{section7WaitTime.toFixed(1)}s</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-500">Frustration Events:</span>
                        <span className="text-2xl font-black text-red-600">{section7Clicks}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(6)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section7Completed && (
                    <button
                      onClick={() => setCurrentSection(8)}
                      className="glass-button px-10 py-4 font-black bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                    >
                      Protocol 08 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 8: Ambiguous CTA */}
        {currentSection === 8 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 08: Ambiguous CTA</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Measuring decision latency through vague affordances.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Unclear Intent
                </div>
              </div>

              <div className="space-y-12">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-16 text-center shadow-inner">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-12">Decision Matrix: Select Primary Action</h3>

                  <div className="flex flex-wrap gap-8 justify-center items-center mb-12">
                    {['Continue', 'Proceed', 'Next'].map((label) => (
                      <button
                        key={label}
                        onClick={() => handleSection8Button(label.toLowerCase())}
                        onMouseEnter={() => setSection8Hovering(label.toLowerCase())}
                        onMouseLeave={() => setSection8Hovering('')}
                        disabled={section8Completed}
                        className={`glass-button px-12 py-6 text-xl font-black min-w-[220px] transition-all duration-300 ${section8Hovering === label.toLowerCase()
                          ? 'scale-110 shadow-2xl ring-4 ring-indigo-500/20 bg-indigo-50 text-indigo-700'
                          : 'bg-white text-slate-700'
                          } ${section8Completed ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="h-10 flex items-center justify-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                      {section8Hovering ? `Potential State: ${section8Hovering.toUpperCase()}` : 'SYSTEM WAITING FOR INPUT...'}
                    </span>
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-200/60">
                    <div className="flex justify-center items-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Decision Latency Events: <span className="text-slate-900">{section8Attempts}</span></span>
                      <span>Confidence Score: <span className="text-slate-900">{section8Completed ? '9% (Low)' : '---'}</span></span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel bg-orange-500/5 border-l-4 border-l-orange-500 p-10 flex gap-8">
                  <div className="text-4xl text-orange-600">⚖️</div>
                  <div>
                    <h4 className="font-black text-orange-900 text-sm uppercase tracking-tight mb-2">Behavioral Analysis: The Illusion of Choice</h4>
                    <p className="text-sm text-orange-800/80 font-medium leading-relaxed">
                      When multiple interactive elements share identical visual weight and vague labeling (e.g., "Continue", "Proceed"), the user experiences "Hick's Law" overload. This decision paralysis increases cognitive strain, often leading the user to click almost at random, subverting deliberate intent.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(7)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section8Completed && (
                    <button
                      onClick={() => setCurrentSection(9)}
                      className="glass-button px-12 py-5 font-black bg-slate-900 text-white shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all"
                    >
                      Protocol 09 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 9: Delayed Feedback */}
        {currentSection === 9 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 09: Delayed Feedback</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Obscuring validation errors to increase temporal cost.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Post-Action Validation
                </div>
              </div>

              <div className="space-y-12">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-12 shadow-inner">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10 text-center">Identity Verification Schema</h3>

                  <div className="max-w-xl mx-auto space-y-8">
                    {['field1', 'field2', 'field3'].map((field, idx) => (
                      <div key={field} className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                          Profile Identifier 0{idx + 1}
                        </label>
                        <input
                          type={field === 'field3' ? 'password' : 'text'}
                          value={section9FormData[field as keyof typeof section9FormData]}
                          onChange={(e) => {
                            setSection9FormData(prev => ({ ...prev, [field]: e.target.value }));
                            setSection9FieldEdits(prev => prev + 1);
                          }}
                          className="glass-input w-full p-5 text-base font-bold bg-white/50 focus:bg-white transition-all shadow-sm"
                          placeholder="REQUIRED_INPUT_FIELD"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-10 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Schema Mutations: <span className="text-indigo-600">{section9FieldEdits}</span></span>
                      <span>Retry Cycles: <span className="text-red-600">{section9Attempts}</span></span>
                    </div>
                    <button
                      onClick={handleSection9Submit}
                      disabled={section9Completed}
                      className={`glass-button px-12 py-5 font-black text-lg transition-all ${section9Completed
                        ? 'bg-green-500 text-white shadow-xl shadow-green-500/20'
                        : 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:-translate-y-1'
                        }`}
                    >
                      {section9Completed ? 'Payload Accepted ✓' : 'Process Verification'}
                    </button>
                  </div>

                  {section9Error && (
                    <div className="mt-8 p-6 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4 animate-in slide-in-from-top-4">
                      <span className="text-2xl">❌</span>
                      <div className="text-xs font-black text-red-600 uppercase tracking-widest leading-normal">
                        System Error: {section9Error}
                      </div>
                    </div>
                  )}
                </div>

                <div className="glass-panel bg-red-500/5 border-l-4 border-l-red-500 p-10 flex gap-8">
                  <div className="text-4xl text-red-600">⚠️</div>
                  <div>
                    <h4 className="font-black text-red-900 text-sm uppercase tracking-tight mb-2">Behavioral Analysis: Reactive Validation</h4>
                    <p className="text-sm text-red-800/80 font-medium leading-relaxed">
                      Post-action validation (only showing errors after submission) is a high-friction pattern that increases user anxiety and cognitive load. By withholding real-time feedback, the system forces users into a "Trial and Error" loop, making them feel incompetent and frustrated.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(8)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section9Completed && (
                    <button
                      onClick={() => setCurrentSection(10)}
                      className="glass-button px-12 py-5 font-black bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all"
                    >
                      Protocol 10 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 10: Interaction Deception */}
        {currentSection === 10 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 10: Interaction Deception</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Conflicting affordances and behavioral glitching.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Affordance Conflict
                </div>
              </div>

              <div className="space-y-12">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-20 flex flex-col items-center justify-center shadow-inner backdrop-blur-md min-h-[450px]">
                  <button
                    onClick={handleSection10Click}
                    disabled={section10Completed}
                    className={`px-24 py-12 text-3xl font-black border-4 transition-all duration-700 rounded-[2.5rem] shadow-2xl relative group ${section10Completed
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 cursor-default scale-95'
                      : 'bg-white/50 text-slate-300 border-slate-200/50 cursor-not-allowed hover:cursor-pointer hover:border-indigo-500/30 hover:text-indigo-600/40 hover:bg-indigo-50/30'
                      }`}
                  >
                    <span className="relative z-10">{section10Completed ? 'Authorization Success ✓' : 'Engage Secondary Layer'}</span>
                    {!section10Completed && (
                      <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-all duration-700 rounded-[2.3rem]" />
                    )}
                  </button>

                  <div className="mt-16 text-center space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                      Synaptic Loop State: <span className={section10HoverLoops > 0 ? 'text-indigo-600 animate-pulse' : ''}>{section10HoverLoops > 0 ? 'ACTIVE_CONFLICT_RECOVERED' : 'IDLE_WAITING'}</span>
                    </div>
                    <div className="flex gap-8 justify-center items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Rage Events: <span className="text-red-500">{section10Attempts}</span></span>
                      <span>Loop Iterations: <span className="text-indigo-600">{section10HoverLoops}</span></span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel bg-indigo-500/5 border-l-4 border-l-indigo-600 p-10 flex gap-8">
                  <div className="text-4xl text-indigo-600">💡</div>
                  <div>
                    <h4 className="font-black text-indigo-900 text-sm uppercase tracking-tight mb-2">Behavioral Analysis: False Affordances</h4>
                    <p className="text-sm text-indigo-800/80 font-medium leading-relaxed">
                      By presenting a `not-allowed` cursor alongside positive hover states (color shifts, scaling), the UI induces a specialized type of cognitive dissonance. The visual brain recognizes an interactive element, but the functional brain is told it's disabled. This conflict inevitably leads to "Rage Clicking" as users attempt to bypass the perceived system error.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(9)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section10Completed && (
                    <button
                      onClick={() => setCurrentSection(11)}
                      className="glass-button px-12 py-5 font-black bg-slate-900 text-white shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all"
                    >
                      Protocol 11 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 11: Precision Targeting */}
        {currentSection === 11 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 11: Precision Targeting</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Testing neuromuscular control via micro-hit areas.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Tiny Click Target
                </div>
              </div>

              <div className="space-y-12">
                <div
                  className="glass-panel bg-white/40 border-slate-200/60 p-20 flex flex-col items-center justify-center shadow-inner backdrop-blur-md min-h-[450px] cursor-crosshair relative overflow-hidden"
                  onClick={handleSection11AreaClick}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />

                  <div className="relative w-full max-w-sm z-10">
                    {!section11Completed ? (
                      <div className="glass-panel bg-white/80 border-white p-10 pr-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-500 relative ring-1 ring-black/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Priority Alert</h4>
                        </div>
                        <p className="text-base font-bold text-slate-700 leading-relaxed mb-6">
                          High-velocity data stream detected. Please acknowledge the synaptic update to prevent session termination.
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSection11Success();
                          }}
                          className="absolute top-4 right-4 w-5 h-5 rounded bg-slate-100 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center text-[10px] border border-slate-200 hover:border-red-400 group"
                        >
                          <span className="group-hover:rotate-90 transition-transform">✕</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-6 animate-in fade-in zoom-in-90 duration-700">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                          <span className="text-4xl text-emerald-600">✓</span>
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-800 tracking-tight">Handshake Verified</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Protocol Metrics Logged</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                    <span>Precision Deviations: <span className="text-red-500">{section11MissedClicks}</span></span>
                    <span>Target Resolution: <span className="text-blue-600">4px</span></span>
                  </div>
                </div>

                <div className="glass-panel bg-blue-500/5 border-l-4 border-l-blue-600 p-10 flex gap-8">
                  <div className="text-4xl text-blue-600">🎯</div>
                  <div>
                    <h4 className="font-black text-blue-900 text-sm uppercase tracking-tight mb-2">Behavioral Analysis: Fitts's Law Disruption</h4>
                    <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                      Fitts's Law states that the time to acquire a target is a function of the distance to and size of the target. By intentionally minimizing click targets (like small 'X' buttons), interfaces dramatically increase the "error rate" and time cost, often used to discourage users from dismissing intrusive elements.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(10)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section11Completed && (
                    <button
                      onClick={() => setCurrentSection(12)}
                      className="glass-button px-12 py-5 font-black bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                    >
                      Protocol 12 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 12: Shifting Targets */}
        {currentSection === 12 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 12: Shifting Targets</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Measuring kinetic frustration via layout instability.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Layout Shift
                </div>
              </div>

              <div className="space-y-12">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-16 mb-8 relative shadow-inner backdrop-blur-md overflow-hidden min-h-[450px] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)]" />

                  <div
                    style={{
                      transform: `translate(${section12ButtonPos}px, 0)`,
                      transition: 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    className="relative z-10"
                  >
                    <button
                      onMouseEnter={handleSection12Hover}
                      onClick={handleSection12Click}
                      disabled={section12Completed}
                      className={`glass-button px-16 py-8 text-2xl font-black shadow-2xl transition-all duration-300 ${section12Completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-700 hover:ring-8 hover:ring-indigo-500/10 active:scale-90'
                        }`}
                    >
                      {section12Completed ? 'Interface Captured ✓' : 'Engage Static Layer'}
                    </button>
                  </div>

                  <div className="absolute bottom-10 flex gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Evasion Events: <span className="text-red-500">{section12Attempts}</span></span>
                    <span>Kinetic Friction: <span className="text-indigo-600">{section12Attempts > 0 ? 'HIGH' : 'LOW'}</span></span>
                  </div>
                </div>

                <div className="glass-panel bg-pink-500/5 border-l-4 border-l-pink-600 p-10 flex gap-8">
                  <div className="text-4xl text-pink-600">🏃</div>
                  <div>
                    <h4 className="font-black text-pink-900 text-sm uppercase tracking-tight mb-2">Behavioral Analysis: Kinetic Obstruction</h4>
                    <p className="text-sm text-pink-800/80 font-medium leading-relaxed">
                      Layout shifts—intentional or accidental—break the user's "mental map" of the interface. When targets shift just before a click (kinetic obstruction), it triggers an immediate stress response and erodes system trust. This pattern is commonly seen in ad-heavy layouts that load content asynchronously to force accidental clicks.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(11)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section12Completed && (
                    <button
                      onClick={() => setCurrentSection(13)}
                      className="glass-button px-12 py-5 font-black bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                    >
                      Protocol 13 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 13: Forced Pacing */}
        {currentSection === 13 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-10 md:p-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Protocol 13: Forced Pacing</h2>
                  <p className="text-lg text-slate-500 font-medium italic">Measuring temporal subversion via gated content streams.</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest self-start md:self-center">
                  Pattern: Content Gating
                </div>
              </div>

              <div className="space-y-12">
                <div className="glass-panel bg-white/40 border-slate-200/60 p-12 mb-8 shadow-inner backdrop-blur-md min-h-[500px] flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-200/60">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Protocol Documentation Stream</h3>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-12 h-1.5 rounded-full overflow-hidden bg-slate-200/50"
                          >
                            {i === section13CurrentSlide && (
                              <div className="h-full bg-indigo-600 animate-[progress_5s_linear_forwards]" />
                            )}
                            {i < section13CurrentSlide && (
                              <div className="h-full bg-indigo-600/30" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="animate-in slide-in-from-right-8 duration-700 max-w-3xl mx-auto">
                      {section13CurrentSlide === 0 && (
                        <div className="space-y-6">
                          <h4 className="text-3xl font-black text-slate-800 tracking-tight">Phase 01: Synaptic Tuning</h4>
                          <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            To ensure optimal parity, the interface must calibrate its response latency to your specific neural patterns. This process is mandatory and cannot be bypassed.
                          </p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 animate-pulse">
                            Status: Initializing handshake...
                          </div>
                        </div>
                      )}

                      {section13CurrentSlide === 1 && (
                        <div className="space-y-6">
                          <h4 className="text-3xl font-black text-slate-800 tracking-tight">Phase 02: Payload Verification</h4>
                          <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            Verifying incoming data packets across multiple shards. Forced serialization ensures that every byte is accounted for before the interface becomes interactive.
                          </p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 animate-pulse">
                            Status: Running checksums v2.4...
                          </div>
                        </div>
                      )}

                      {section13CurrentSlide === 2 && (
                        <div className="space-y-6">
                          <h4 className="text-3xl font-black text-slate-800 tracking-tight">Phase 03: State Resolution</h4>
                          <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            Committing experimental findings to the persistent ledger. This involves complex merging of behavioral matrices to ensure future sessions are appropriately difficult.
                          </p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 animate-pulse">
                            Status: Merging persistent state...
                          </div>
                        </div>
                      )}

                      {section13CurrentSlide >= 3 && (
                        <div className="text-center space-y-8 py-12">
                          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600 text-4xl shadow-xl border border-emerald-500/20 animate-bounce">
                            ✓
                          </div>
                          <div>
                            <h4 className="text-4xl font-black text-slate-800 tracking-tight">Sequence Complete</h4>
                            <p className="text-xl text-slate-500 font-medium mt-4">The gated content has been successfully processed.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-200/60 flex items-center justify-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-2 bg-slate-50 rounded-full border border-slate-100">
                      Temporal Resistance: <span className="text-indigo-600">{section13ReadTime}s</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel bg-orange-500/5 border-l-4 border-l-orange-500 p-10 flex gap-8">
                  <div className="text-4xl text-orange-600">⌛</div>
                  <div>
                    <h4 className="font-black text-orange-900 text-sm uppercase tracking-tight mb-2">Behavioral Analysis: Subverted Autonomy</h4>
                    <p className="text-sm text-orange-800/80 font-medium leading-relaxed">
                      Forced pacing (or "Railroading") intentionally breaks the user's natural reading and processing speed. By withholding the "Next" button or forcing a timed slide transition, the UI asserts dominance over the user's time, often used to hide critical information or force engagement with secondary content.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    onClick={() => setCurrentSection(12)}
                    className="px-6 py-3 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  {section13Completed && (
                    <button
                      onClick={() => setCurrentSection(14)}
                      className="glass-button px-12 py-5 font-black bg-slate-900 text-white shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                    >
                      Final Results →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 14: Final Reflection */}
        {currentSection === 14 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="mb-12">
                  <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tighter">
                    Experiment Conclusion
                  </h1>
                  <p className="text-3xl text-slate-800 font-bold tracking-tight">This is the biological cost of friction.</p>
                  <p className="text-xl text-slate-400 italic mt-6 font-medium border-l-4 border-indigo-500/20 pl-8 leading-relaxed max-w-2xl">
                    Anxiety level is calculated based on micro-interactions, missed targets, and hesitation loops detected throughout the 13 investigative protocols.
                  </p>
                </div>

                <div className="glass-panel bg-white p-12 mb-12 shadow-xl border-slate-200/60 ring-1 ring-black/5">
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Behavioral Anxiety Matrix</h3>
                      <div className="text-2xl font-black text-slate-800">System Resonance State</div>
                    </div>
                    <div className="text-7xl font-black text-indigo-600 tracking-tighter">{anxietyLevel}<span className="text-3xl text-slate-300 ml-1">/100</span></div>
                  </div>

                  <div className="w-full h-10 bg-slate-100 rounded-2xl overflow-hidden mb-10 p-1.5 border border-slate-200/60">
                    <div
                      className="h-full transition-all duration-2000 ease-out rounded-xl relative shadow-[0_0_40px_rgba(79,70,229,0.3)]"
                      style={{
                        width: `${anxietyLevel}%`,
                        background: `linear-gradient(90deg, #4f46e5, #9333ea, #db2777)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:50px_50px] animate-[pulse_3s_infinite]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">
                    <div className={anxietyLevel < 25 ? 'text-indigo-600 scale-110 transition-transform' : ''}>Quiescent</div>
                    <div className={anxietyLevel >= 25 && anxietyLevel < 50 ? 'text-purple-600 scale-110 transition-transform' : ''}>Elevated</div>
                    <div className={anxietyLevel >= 50 && anxietyLevel < 75 ? 'text-orange-600 scale-110 transition-transform' : ''}>Distressed</div>
                    <div className={anxietyLevel >= 75 ? 'text-pink-600 scale-110 transition-transform' : ''}>Critical</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {[
                    { label: 'Total Interaction Events', value: stats.totalClicks, color: 'text-indigo-600', icon: '🖱️' },
                    { label: 'Cognitive Hesitations', value: stats.hesitations + stats.cursorHesitations, color: 'text-purple-600', icon: '❓' },
                    { label: 'Goal Obstructions', value: stats.retries, color: 'text-orange-500', icon: '🚫' },
                    { label: 'Temporal Investment', value: `${stats.timeSpent}s`, color: 'text-blue-600', icon: '⏳' },
                    { label: 'Precision Failures', value: stats.missedClicks, color: 'text-pink-600', icon: '🎯' },
                    { label: 'Reactive Frustration', value: stats.rageClicks, color: 'text-red-600', icon: '💢' },
                  ].map((stat, i) => (
                    <div key={i} className="glass-panel bg-white/50 border-white hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 p-10 group shadow-sm">
                      <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500">{stat.icon}</div>
                      <div className={`text-5xl font-black mb-3 ${stat.color} tracking-tighter`}>{stat.value}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="glass-panel bg-slate-900 border-none p-16 mb-16 shadow-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <div className="text-[200px] leading-none text-white italic tracking-tighter font-serif">"</div>
                  </div>
                  <p className="text-4xl leading-[1.1] mb-12 text-white font-black max-w-4xl relative z-10 tracking-tight">
                    "Friction isn't just a hurdle; it's a tax on the human spirit. Every missed click and every
                    forced delay erodes the user's sense of agency, transforming a tool into an adversary."
                  </p>
                  <div className="h-1 w-24 bg-indigo-500 mb-12" />
                  <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl relative z-10">
                    The results confirm that interaction design is fundamentally an ethical practice. Every pixel either respects the user's intent or actively subverts it. Human-centric design is the aggressive reduction of friction.
                  </p>
                </div>

                <div className="flex flex-wrap gap-8 items-center justify-between">
                  <div className="flex gap-6">
                    <button
                      onClick={handleRestart}
                      className="glass-button px-14 py-7 text-2xl font-black bg-indigo-600 text-white shadow-3xl shadow-indigo-500/30 hover:scale-105 transition-all active:scale-95"
                    >
                      Reset Experiment
                    </button>
                    <button
                      onClick={() => setCurrentSection(1)}
                      className="px-12 py-6 border-2 border-slate-200 bg-white/50 hover:bg-white rounded-[2rem] transition-all font-black text-xl backdrop-blur-md shadow-xl text-slate-800"
                    >
                      Review Protocols
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Simulated Environment</div>
                    <div className="text-sm font-bold text-slate-600">Protocol 14: Final_Reflection_v1.0.4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

