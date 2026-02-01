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
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      
      {/* Global Header */}
      {currentSection > 0 && currentSection < 14 && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-600">Cursor Anxiety Simulator</h3>
                <div className="text-xs text-gray-500 mt-1">
                  Step {currentSection} of 13
                </div>
              </div>
              
              {/* Anxiety Meter */}
              <div className="flex-1 max-w-md mx-12">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Anxiety Meter</span>
                  <span className="text-sm font-medium">{getAnxietyState()}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 border border-gray-300 rounded-sm overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${anxietyLevel}%`,
                      backgroundColor: anxietyLevel < 25 ? '#22c55e' : anxietyLevel < 50 ? '#eab308' : anxietyLevel < 75 ? '#f97316' : '#dc2626'
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Based on your behavior patterns
                </div>
              </div>
              
              <button
                onClick={handleRestart}
                className="px-4 py-2 text-sm border border-gray-400 bg-white hover:bg-gray-100"
              >
                Restart Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 5 Toast Notification */}
      {section5Toast && (
        <div className="fixed top-24 right-6 bg-blue-600 text-white p-4 border border-blue-700 shadow-lg z-50 max-w-xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm mb-1">New Message</div>
              <div className="text-xs">You have 3 unread notifications</div>
            </div>
            <button 
              onClick={() => {
                setSection5Toast(false);
                trackClick();
              }}
              className="text-white ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Section 5 Modal */}
      {section5Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 p-6 max-w-md shadow-xl">
            <h3 className="text-lg mb-3">Special Offer!</h3>
            <p className="text-sm text-gray-700 mb-4">
              Subscribe now to get exclusive updates and early access to new features. 
              Limited time offer - don't miss out!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSection5Modal(false);
                  trackClick();
                  increaseAnxiety(2);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Subscribe Now
              </button>
              <button
                onClick={() => {
                  setSection5Modal(false);
                  trackClick();
                }}
                className="px-4 py-2 text-sm text-gray-600 underline"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={currentSection > 0 && currentSection < 14 ? 'pt-24 pb-12' : 'py-12'}>
        
        {/* Introduction Screen */}
        {currentSection === 0 && (
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-12">
              <h1 className="text-4xl mb-3">Cursor Anxiety Simulator</h1>
              <p className="text-lg text-gray-600 mb-8">An experiment in subtle UX stress</p>
              
              <div className="space-y-4 mb-8 text-gray-800">
                <p className="leading-relaxed">
                  Welcome to an interactive study exploring how small interface design decisions 
                  create cumulative user stress. You'll experience thirteen common UI patterns that 
                  make digital interactions unnecessarily difficult.
                </p>
                <p className="leading-relaxed">
                  As you progress, an "Anxiety Meter" will track your frustration based on your actual behavior—
                  cursor hesitation, missed clicks, repeated attempts, and rage clicking. 
                  The meter responds only to what you do, not just time spent.
                </p>
                <p className="leading-relaxed">
                  This experiment takes approximately 6–8 minutes. You can restart at any time. 
                  There are no wrong answers—just honest reactions to intentionally problematic design.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-300 p-6 mb-8">
                <h3 className="text-sm mb-3 text-gray-700">What to Expect:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>13 interactive sections demonstrating common UX friction patterns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Behavior-based anxiety tracking (no auto-increase)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Delayed feedback, ambiguous buttons, deceptive interactions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Interruptions, pressure tactics, and cognitive overload</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Final reflection revealing how friction affected you</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentSection(1)}
                className="px-8 py-4 bg-black text-white hover:bg-gray-900 text-lg"
              >
                Begin Experiment
              </button>

              <p className="text-sm text-gray-600 mt-4">
                By continuing, you consent to having your interactions tracked for this experiment.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Delayed Feedback */}
        {currentSection === 1 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 1: Delayed Feedback</h2>
                  <p className="text-gray-600">Click the primary button to begin processing</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Uncertain Wait Times
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  In this section, you'll submit a request that requires server processing. 
                  Pay attention to how the interface communicates progress and status. 
                  Notice any impulses to click again while waiting.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
                  <h3 className="text-sm mb-4 text-gray-700">Processing Request</h3>
                  
                  <div className="flex gap-4 mb-6 flex-wrap">
                    <div className="relative">
                      <button
                        onClick={handleSection1Primary}
                        disabled={section1Completed}
                        className={`px-6 py-3 border flex items-center gap-2 ${
                          section1Completed
                            ? 'bg-green-100 text-green-800 border-green-400 cursor-not-allowed'
                            : section1Processing
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-400'
                            : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {section1Processing && (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        {section1Completed ? 'Completed ✓' : section1Processing ? 'Processing...' : 'Submit Request'}
                      </button>
                      <div className="absolute -bottom-6 left-0 text-xs text-gray-600 whitespace-nowrap">
                        Primary action
                      </div>
                    </div>

                    <button
                      onClick={handleSection1Secondary}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100 text-gray-800 opacity-60"
                      disabled={section1Processing}
                    >
                      Cancel Request
                    </button>

                    <button
                      onClick={handleSection1Tertiary}
                      className="px-4 py-3 text-sm text-gray-600 underline"
                    >
                      View Details
                    </button>
                  </div>

                  {section1Processing && (
                    <div className="mb-6 mt-8">
                      <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                        <span>Progress</span>
                        <span>{Math.floor(section1Progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-300 border border-gray-400 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-200"
                          style={{ width: `${section1Progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {section1Status && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-xs mt-0.5">ℹ️</span>
                      <span>{section1Status}</span>
                    </div>
                  )}

                  {section1RetryHint && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 text-sm text-orange-800">
                      {section1RetryHint}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-gray-200">
                    <span>⏱ Wait time may vary based on server load</span>
                    {section1Clicks > 0 && (
                      <span className="text-orange-600">⚠ Re-clicks detected: {section1Clicks}</span>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-300 p-4 mb-6">
                  <p className="text-sm text-yellow-800 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Note:</strong> This process cannot be interrupted once started. 
                      Please wait for confirmation before proceeding. This action may take longer than expected.
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 text-xs">
                  <div className="bg-gray-100 border border-gray-300 p-3">
                    <div className="text-gray-600 mb-1">Typical processing time</div>
                    <div className="text-gray-800">3–7 seconds</div>
                  </div>
                  <div className="bg-gray-100 border border-gray-300 p-3">
                    <div className="text-gray-600 mb-1">Server status</div>
                    <div className="text-green-700">● Online</div>
                  </div>
                  <div className="bg-gray-100 border border-gray-300 p-3">
                    <div className="text-gray-600 mb-1">Queue position</div>
                    <div className="text-gray-800">Loading...</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentSection(0)}
                    className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                  >
                    ← Back
                  </button>
                  {section1Completed && (
                    <button
                      onClick={() => setCurrentSection(2)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 2 →
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600 text-center">
              Anxiety increases based on your behavior, not time
            </div>
          </div>
        )}

        {/* Section 2: Confusing Button States */}
        {currentSection === 2 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 2: Confusing Button States</h2>
                  <p className="text-gray-600">Identify and click the active button</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Unclear Affordances
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  Multiple buttons appear below with varying visual states. Some look disabled but are clickable, 
                  others look active but don't respond. Find the button that actually works to proceed.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-8 mb-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <button
                      onClick={() => handleSection2Button(1)}
                      onMouseEnter={() => showTooltip('This might be the right button')}
                      className="px-4 py-2 bg-gray-300 text-gray-500 border border-gray-400 opacity-60"
                      title="This button appears disabled"
                    >
                      Option A
                    </button>

                    <button
                      onClick={() => handleSection2Button(2)}
                      onMouseEnter={() => showTooltip('Primary action')}
                      className="px-6 py-4 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"
                      title="Primary action"
                    >
                      Option B - Confirm
                    </button>

                    <button
                      onClick={() => handleSection2Button(3)}
                      className="px-3 py-2 bg-gray-200 text-gray-600 border border-gray-300 text-sm"
                      title="Secondary option"
                    >
                      Option C
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSection2Button(4)}
                        className="flex-1 px-5 py-3 bg-green-500 text-white border border-green-600"
                        title="Looks active"
                      >
                        Option D
                      </button>
                      <button
                        onClick={() => handleSection2Button(4)}
                        className="px-3 py-3 bg-green-500 text-white border border-green-600"
                        title="Icon button"
                      >
                        →
                      </button>
                    </div>

                    <button
                      onClick={() => handleSection2Button(5)}
                      className="px-4 py-2 bg-white text-gray-400 border border-gray-300"
                      title="Another option"
                    >
                      Option E
                    </button>

                    <button
                      onClick={() => handleSection2Button(6)}
                      className="px-4 py-3 bg-gray-100 text-gray-700 border border-gray-400 hover:bg-gray-200"
                      title="Try this one"
                    >
                      Option F - Continue
                    </button>

                    <button
                      onClick={() => handleSection2Button(7)}
                      className="px-2 py-2 border border-gray-400 bg-white text-gray-700 text-xs"
                    >
                      ⚙️
                    </button>

                    <div className="col-span-2">
                      <button
                        onClick={() => handleSection2Button(8)}
                        className="text-blue-600 underline text-sm"
                      >
                        Click here to proceed
                      </button>
                    </div>
                  </div>

                  {section2Tooltip && (
                    <div className="mb-4 p-2 bg-black text-white text-xs">
                      {section2Tooltip}
                    </div>
                  )}

                  {section2Feedback && (
                    <div className={`p-3 border text-sm mb-4 ${
                      section2Completed 
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-red-50 border-red-300 text-red-800'
                    }`}>
                      {section2Feedback}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-gray-200">
                    <span>💡 Hover over buttons for additional hints</span>
                    <span>Attempts: {section2Attempts}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 border border-blue-300 p-4">
                    <p className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-lg">ℹ️</span>
                      <span>
                        <strong>Hint:</strong> Visual appearance doesn't always indicate functionality. 
                        Some buttons may be styled to look inactive while remaining functional.
                      </span>
                    </p>
                  </div>

                  <div className="bg-orange-50 border border-orange-300 p-4">
                    <p className="text-sm text-orange-800 flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <span>
                        <strong>Warning:</strong> Clicking the wrong button may reset your progress in this section.
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentSection(1)}
                    className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                  >
                    ← Back
                  </button>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-xs">📊</span>
                    <span>Notice how uncertainty increases with each failed attempt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Unstable Click Area */}
        {currentSection === 3 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 3: Unstable Click Target</h2>
                  <p className="text-gray-600">Complete the action by clicking the button</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Moving Targets
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  This section demonstrates interfaces where click targets shift unexpectedly. 
                  Try to click the primary action button below. The button will stabilize after a few attempts.
                </p>

                <div className="mb-4 flex items-center justify-between bg-gray-100 border border-gray-300 p-3">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-700">
                      Status: <span className={`${section3StatusLabel === 'Success' ? 'text-green-700' : 'text-gray-800'}`}>{section3StatusLabel}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="text-xs text-gray-600">
                      {section3HelperText}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Auto-updates
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-300 p-12 mb-6 relative" style={{ minHeight: '300px' }}>
                  <div 
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${section3ButtonPos.x}px), calc(-50% + ${section3ButtonPos.y}px))`,
                      transition: section3Completed ? 'none' : 'transform 0.3s ease-out'
                    }}
                  >
                    <button
                      onMouseEnter={handleSection3Hover}
                      onMouseLeave={() => setSection3Hovering(false)}
                      onClick={handleSection3Click}
                      disabled={section3Completed}
                      className={`px-8 py-4 border ${
                        section3Completed
                          ? 'bg-green-600 text-white border-green-600 cursor-not-allowed'
                          : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {section3Completed ? 'Successfully Clicked ✓' : 'Click Here to Continue'}
                    </button>
                  </div>

                  {!section3Completed && (
                    <>
                      <button 
                        onClick={() => {
                          trackClick();
                          trackMissedClick();
                        }}
                        className="absolute top-4 left-4 p-2 text-xs border border-gray-400 bg-white hover:bg-gray-100"
                      >
                        ℹ️
                      </button>
                      <button 
                        onClick={() => {
                          trackClick();
                          trackMissedClick();
                        }}
                        className="absolute top-4 right-4 p-2 text-xs border border-gray-400 bg-white hover:bg-gray-100"
                      >
                        ⚙️
                      </button>
                    </>
                  )}

                  {!section3Completed && section3Attempts > 0 && (
                    <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-600 bg-white border border-gray-300 p-2">
                      Attempts: {section3Attempts} - {section3Attempts >= 2 ? 'Button will now stabilize' : 'Keep trying...'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-yellow-50 border border-yellow-300 p-4">
                    <p className="text-sm text-yellow-800 flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <span>
                        <strong>Retry Hint:</strong> The button may shift position when you approach it. 
                        This simulates ads that move as you try to close them.
                      </span>
                    </p>
                  </div>

                  <div className="bg-gray-100 border border-gray-300 p-4">
                    <div className="text-xs text-gray-600 mb-2">Quick Stats</div>
                    <div className="text-sm text-gray-800 space-y-1">
                      <div>Click attempts: {section3Attempts}</div>
                      <div>Status: {section3Completed ? 'Completed' : section3Hovering ? 'Hovering' : 'Ready'}</div>
                      <div className="text-xs text-gray-600 pt-1 border-t border-gray-200">
                        Position: {section3ButtonPos.x !== 0 ? 'Shifted' : 'Center'}
                      </div>
                    </div>
                  </div>
                </div>

                {section3Completed && (
                  <div className="flex justify-between items-center bg-green-50 border border-green-300 p-4 mb-4">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <span className="text-lg">✓</span>
                      <span>Success! You've experienced how moving interface elements create frustration.</span>
                    </p>
                    <button
                      onClick={() => setCurrentSection(4)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 4 →
                    </button>
                  </div>
                )}

                {!section3Completed && (
                  <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setCurrentSection(2)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <div className="text-gray-600 flex items-center gap-2">
                      <span className="text-xs">📝</span>
                      <span>Alternative: <button className="text-blue-600 underline" onClick={handleSection3Click}>Skip this section</button> if it becomes too frustrating</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Cognitive Overload */}
        {currentSection === 4 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 4: Cognitive Overload</h2>
                  <p className="text-gray-600">Configure your preferences to continue</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Excessive Choice
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  Make at least 3 selections from the options below. This section demonstrates how 
                  overwhelming users with choices and settings creates decision paralysis.
                </p>

                <div className="mb-4 bg-blue-50 border border-blue-300 p-3 flex items-center justify-between">
                  <div className="text-sm text-blue-800">{section4Summary}</div>
                  <div className="text-xs text-blue-600">Updates automatically</div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Left column - Checkboxes */}
                  <div className="border border-gray-300 p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm text-gray-700">Feature Preferences</h3>
                      <span className="text-xs text-gray-500">ℹ️ Required</span>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {[
                        { label: 'Enable automatic updates', info: 'Recommended' },
                        { label: 'Receive promotional emails', info: null },
                        { label: 'Share usage analytics', info: 'Helps improve service' },
                        { label: 'Allow cookies for personalization', info: 'Required for features' },
                        { label: 'Enable experimental features', info: 'May be unstable' },
                        { label: 'Sync settings across devices', info: null },
                        { label: 'Participate in beta testing', info: null },
                        { label: 'Send crash reports', info: 'Anonymous' },
                        { label: 'Enable advanced security', info: 'Recommended' },
                        { label: 'Allow location tracking', info: 'For personalized content' },
                        { label: 'Enable push notifications', info: null },
                        { label: 'Share data with partners', info: 'Optional' },
                        { label: 'Enable two-factor authentication', info: 'Strongly recommended' },
                        { label: 'Allow background data usage', info: null },
                        { label: 'Participate in surveys', info: null },
                      ].map((option, idx) => (
                        <label key={idx} className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 p-2 -m-2">
                          <input
                            type="checkbox"
                            checked={section4Selections.includes(option.label)}
                            onChange={() => handleSection4Checkbox(option.label)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <span className="text-sm text-gray-800">{option.label}</span>
                            {option.info && (
                              <div className="text-xs text-gray-500 mt-0.5">{option.info}</div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                      Scroll for more options
                    </div>
                  </div>

                  {/* Right column - Toggles and Dropdown */}
                  <div className="space-y-4">
                    <div className="border border-gray-300 p-6 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm text-gray-700">Privacy Settings</h3>
                        <span className="text-xs text-gray-500">⚠️ Affects all devices</span>
                      </div>
                      <div className="space-y-4">
                        {['Public Profile', 'Location Services', 'Personalized Ads', 'Data Collection', 'Third-party Access', 'Usage Tracking'].map((setting, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-800">{setting}</span>
                              <button 
                                onClick={() => {
                                  trackClick();
                                  increaseAnxiety(1);
                                }}
                                className="text-xs text-gray-500"
                              >
                                ℹ️
                              </button>
                            </div>
                            <button
                              onClick={() => handleSection4Toggle(setting)}
                              className={`w-12 h-6 rounded-full border transition-colors ${
                                section4Toggles[setting]
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'bg-gray-300 border-gray-400'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                  section4Toggles[setting] ? 'translate-x-6' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-300 p-6 bg-gray-50">
                      <h3 className="text-sm mb-4 text-gray-700">Notification Frequency</h3>
                      <select
                        value={section4Dropdown}
                        onChange={(e) => {
                          setSection4Dropdown(e.target.value);
                          trackClick();
                          increaseAnxiety(1);
                        }}
                        className="w-full border border-gray-400 p-2 bg-white text-sm mb-2"
                      >
                        <option value="">Select frequency...</option>
                        <option value="realtime">Real-time (as they happen)</option>
                        <option value="hourly">Hourly digest</option>
                        <option value="daily">Daily summary</option>
                        <option value="weekly">Weekly roundup</option>
                        <option value="never">Never notify me</option>
                      </select>
                      <div className="text-xs text-gray-500">
                        Some options may override previous selections
                      </div>
                    </div>

                    <div className="border border-gray-300 p-6 bg-gray-50">
                      <h3 className="text-sm mb-4 text-gray-700">Advanced Options</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="radio" name="mode" defaultChecked />
                          Standard Mode
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="radio" name="mode" />
                          Power User Mode
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="radio" name="mode" />
                          Minimal Mode
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {section4Status && (
                  <div className={`p-3 border text-sm mb-4 flex items-start gap-2 ${
                    section4Completed
                      ? 'bg-green-50 border-green-300 text-green-800'
                      : 'bg-orange-50 border-orange-300 text-orange-800'
                  }`}>
                    <span className="text-lg">{section4Completed ? '✓' : '⚠️'}</span>
                    <span>{section4Status}</span>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-300 p-4 mb-6">
                  <p className="text-sm text-yellow-800 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Warning:</strong> Some settings may affect others. Changes are auto-saved and 
                      cannot be easily undone. Review carefully before confirming. Privacy settings will sync 
                      across all your devices immediately.
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-sm text-gray-600">
                    <div>Selections: {section4Selections.length} / 3 minimum required</div>
                    <div className="text-xs text-gray-500 mt-1">Toggle states: {Object.keys(section4Toggles).filter(k => section4Toggles[k]).length} active</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        trackClick();
                        detectRepeatedClick('section4-reset');
                        increaseAnxiety(1);
                      }}
                      className="px-4 py-2 text-sm border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      Reset to Defaults
                    </button>
                    <button
                      onClick={handleSection4Submit}
                      disabled={section4Completed}
                      className={`px-6 py-3 border ${
                        section4Completed
                          ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                          : 'bg-black text-white border-black hover:bg-gray-900'
                      }`}
                    >
                      {section4Completed ? 'Saved ✓' : 'Save Preferences'}
                    </button>
                  </div>
                </div>

                {section4Completed && (
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentSection(3)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentSection(5)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 5 →
                    </button>
                  </div>
                )}
                {!section4Completed && (
                  <div className="mt-6 flex justify-start">
                    <button
                      onClick={() => setCurrentSection(3)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
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
              <div className="bg-orange-500 text-white p-3 mb-4 flex items-center justify-between">
                <div className="text-sm">
                  🎉 Limited Time Offer: Upgrade now and save 50%! Expires in 2 hours.
                </div>
                <button 
                  onClick={() => {
                    setSection5Banner(false);
                    trackClick();
                    trackDistraction();
                    increaseAnxiety(2);
                  }}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 5: Interruptions & Distractions</h2>
                  <p className="text-gray-600">Complete the task while managing interruptions</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Attention Hijacking
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  Try to complete a simple task below. However, the interface will interrupt you with 
                  popups, notifications, and distractions—simulating common patterns in modern web applications.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
                  <h3 className="text-sm mb-4 text-gray-700">Main Task</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Enter your feedback about this experience in the text field below. Write at least 5 characters.
                  </p>

                  <div className="mb-4">
                    <label className="text-sm text-gray-700 mb-2 block">Your Feedback</label>
                    <textarea
                      value={section5TaskInput}
                      onChange={(e) => setSection5TaskInput(e.target.value)}
                      className="w-full border border-gray-400 p-3 bg-white text-sm"
                      rows={4}
                      placeholder="Type your feedback here..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Characters: {section5TaskInput.length} / 5 minimum
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      Interruptions encountered: {section5InterruptCount}
                    </div>
                    <button
                      onClick={handleSection5Complete}
                      disabled={section5Completed}
                      className={`px-6 py-3 border ${
                        section5Completed
                          ? 'bg-green-100 text-green-800 border-green-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {section5Completed ? 'Submitted ✓' : 'Submit Feedback'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-300 p-4">
                    <p className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-lg">ℹ️</span>
                      <span>
                        <strong>Observation:</strong> Notice how interruptions break your focus and 
                        increase cognitive load, even for simple tasks.
                      </span>
                    </p>
                  </div>

                  <div className="bg-gray-100 border border-gray-300 p-4">
                    <div className="text-xs text-gray-600 mb-2">Distraction Metrics</div>
                    <div className="text-sm text-gray-800 space-y-1">
                      <div>Modal popups: {section5Modal ? 1 : 0} shown</div>
                      <div>Toast notifications: {section5Toast ? 1 : 0} active</div>
                      <div>Banner ads: {section5Banner ? 1 : 0} visible</div>
                    </div>
                  </div>
                </div>

                {section5Completed && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(4)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentSection(6)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 6 →
                    </button>
                  </div>
                )}
                {!section5Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(4)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>

            {section5Footer && (
              <div className="bg-gray-800 text-white p-4 mt-4 flex items-center justify-between sticky bottom-0">
                <div className="text-sm flex items-center gap-4">
                  <span>🍪 We use cookies to enhance your experience.</span>
                  <button 
                    onClick={() => {
                      trackClick();
                      increaseAnxiety(1);
                    }}
                    className="underline text-xs"
                  >
                    Learn more
                  </button>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      trackClick();
                      increaseAnxiety(1);
                    }}
                    className="px-4 py-2 text-sm border border-gray-500 hover:bg-gray-700"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => {
                      setSection5Footer(false);
                      trackClick();
                      trackDistraction();
                    }}
                    className="px-4 py-2 text-sm bg-white text-gray-900 hover:bg-gray-100"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 6: Pressure & Micro-stress */}
        {currentSection === 6 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 6: Pressure & Micro-stress</h2>
                  <p className="text-gray-600">Complete the form before time runs out</p>
                </div>
                <div className={`text-lg px-4 py-2 border ${
                  section6Timer > 10 ? 'bg-gray-100 border-gray-300 text-gray-700' :
                  section6Timer > 5 ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                  'bg-red-100 border-red-300 text-red-800'
                }`}>
                  {section6Timer > 0 ? `⏱ ${section6Timer}s remaining` : '⏱ Time expired'}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {section6Timer <= 10 && section6Timer > 0 && (
                  <div className="bg-red-50 border border-red-300 p-4 mb-6">
                    <p className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <span>
                        <strong>Hurry!</strong> Limited time remaining. Complete this form now or lose your progress.
                      </span>
                    </p>
                  </div>
                )}

                <p className="text-gray-800 mb-6 leading-relaxed">
                  This section demonstrates how artificial time pressure and guilt-based messaging 
                  create unnecessary stress. Complete the form to proceed, but notice how the countdown affects your behavior.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
                  <h3 className="text-sm mb-4 text-gray-700">Required Information</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block flex items-center gap-2">
                        Email Address
                        <span className="text-red-600">*</span>
                        <span className="text-xs text-gray-500">(Required)</span>
                      </label>
                      <input 
                        type="email"
                        className="w-full border border-gray-400 p-2 bg-white text-sm"
                        placeholder="you@example.com"
                        onChange={() => {
                          trackClick();
                          increaseAnxiety(1);
                        }}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        We'll never share your email. Promise! 🤞
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-3">
                        <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 p-2 -m-2">
                          <input
                            type="checkbox"
                            checked={section6Agreement}
                            onChange={(e) => {
                              setSection6Agreement(e.target.checked);
                              trackClick();
                              increaseAnxiety(1);
                            }}
                            className="mt-1"
                          />
                          <div className="text-sm text-gray-800">
                            I agree to the <button className="text-blue-600 underline">Terms of Service</button> and <button className="text-blue-600 underline">Privacy Policy</button>
                            <span className="text-red-600 ml-1">*</span>
                            <div className="text-xs text-gray-500 mt-1">
                              (By checking this, you consent to everything. It's a long document we know you won't read.)
                            </div>
                          </div>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 p-2 -m-2 bg-yellow-50">
                          <input
                            type="checkbox"
                            checked={section6NewsletterOptOut}
                            onChange={(e) => {
                              setSection6NewsletterOptOut(e.target.checked);
                              trackClick();
                              increaseAnxiety(1);
                            }}
                            className="mt-1"
                          />
                          <div className="text-sm text-gray-800">
                            I don't want to receive helpful tips, exclusive offers, and important updates
                            <div className="text-xs text-gray-500 mt-1">
                              (Are you sure? You'll miss out on amazing content!)
                            </div>
                          </div>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 p-2 -m-2">
                          <input
                            type="checkbox"
                            defaultChecked
                            onChange={() => {
                              trackClick();
                              increaseAnxiety(1);
                            }}
                            className="mt-1"
                          />
                          <div className="text-sm text-gray-800">
                            Share my data with trusted partners for personalized experiences
                            <div className="text-xs text-gray-500 mt-1">
                              (Pre-selected for your convenience)
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-300 p-4">
                      <p className="text-sm text-orange-800">
                        <strong>⚡ Special Offer:</strong> Only 3 spots left at this price! 127 people are viewing this page right now.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      {!section6Agreement && 'You must agree to the terms to continue'}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          trackClick();
                          trackRetry();
                        }}
                        className="px-4 py-2 text-sm text-gray-600 underline"
                      >
                        No thanks, I'll pass
                      </button>
                      <button
                        onClick={handleSection6Submit}
                        disabled={section6Completed}
                        className={`px-6 py-3 border ${
                          section6Completed
                            ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                            : 'bg-black text-white border-black hover:bg-gray-900'
                        }`}
                      >
                        {section6Completed ? 'Submitted ✓' : 'Complete Registration'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 border border-red-300 p-4">
                    <p className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <span>
                        <strong>Scarcity Messaging:</strong> Creating false urgency increases pressure and 
                        forces hasty decisions without proper consideration.
                      </span>
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-300 p-4">
                    <p className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <span>
                        <strong>Dark Pattern:</strong> Pre-selected checkboxes and confusing opt-out wording 
                        manipulate users into unwanted agreements.
                      </span>
                    </p>
                  </div>
                </div>

                {section6Completed && (
                  <div className="flex justify-between items-center bg-green-50 border border-green-300 p-4">
                    <button
                      onClick={() => setCurrentSection(5)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <p className="text-sm text-green-700">
                      Section complete. Continue to explore more friction patterns.
                    </p>
                    <button
                      onClick={() => setCurrentSection(7)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 7 →
                    </button>
                  </div>
                )}
                {!section6Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(5)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 7: False Progress Feedback */}
        {currentSection === 7 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 7: False Progress Feedback</h2>
                  <p className="text-gray-600">Start the loading process</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Deceptive Progress
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  This section shows how progress bars can deceive users. The bar will move quickly at first, 
                  then slow down dramatically without explanation.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
                  <h3 className="text-sm mb-4 text-gray-700">Loading Process</h3>
                  
                  <button
                    onClick={handleSection7Start}
                    disabled={section7Waiting || section7Completed}
                    className={`px-6 py-3 border mb-6 ${
                      section7Completed
                        ? 'bg-green-100 text-green-800 border-green-400 cursor-not-allowed'
                        : section7Waiting
                        ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {section7Completed ? 'Complete ✓' : section7Waiting ? 'Loading...' : 'Start Loading'}
                  </button>

                  {(section7Waiting || section7Completed) && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-700">Progress</span>
                        <span className="text-gray-700">{Math.floor(section7Progress)}%</span>
                      </div>
                      <div className="w-full h-4 bg-gray-300 border border-gray-400 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all"
                          style={{ 
                            width: `${section7Progress}%`,
                            transitionDuration: section7Progress < 85 ? '0.1s' : '0.5s'
                          }}
                        />
                      </div>
                      {section7Waiting && section7Progress >= 85 && section7Progress < 100 && (
                        <div className="text-xs text-gray-600 mt-2">
                          Processing... this may take a moment
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-gray-200">
                    <span>Wait time: {section7WaitTime}s</span>
                    {section7Clicks > 0 && (
                      <span className="text-orange-600">Clicks during loading: {section7Clicks}</span>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-300 p-4 mb-6">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <span className="text-lg">ℹ️</span>
                    <span>
                      <strong>Pattern:</strong> Progress bars that move quickly to 80-90% then slow dramatically 
                      create false expectations and increase waiting anxiety.
                    </span>
                  </p>
                </div>

                {section7Completed && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(6)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentSection(8)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 8 →
                    </button>
                  </div>
                )}
                {!section7Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(6)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 8: Ambiguous CTA */}
        {currentSection === 8 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 8: Ambiguous Call-to-Action</h2>
                  <p className="text-gray-600">Choose an option to continue</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Unclear Intent
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  This section demonstrates buttons with vague labels that don't clearly explain what will happen. 
                  All buttons look equally important, creating hesitation.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-8 mb-6">
                  <h3 className="text-sm mb-6 text-gray-700">Select an Action</h3>
                  
                  <div className="flex gap-4 justify-center items-center mb-6">
                    <button
                      onClick={() => handleSection8Button('continue')}
                      onMouseEnter={() => setSection8Hovering('continue')}
                      onMouseLeave={() => setSection8Hovering('')}
                      disabled={section8Completed}
                      className="px-8 py-4 border border-gray-400 bg-white hover:bg-gray-100 text-gray-800"
                    >
                      Continue
                    </button>

                    <button
                      onClick={() => handleSection8Button('proceed')}
                      onMouseEnter={() => setSection8Hovering('proceed')}
                      onMouseLeave={() => setSection8Hovering('')}
                      disabled={section8Completed}
                      className="px-8 py-4 border border-gray-400 bg-white hover:bg-gray-100 text-gray-800"
                    >
                      Proceed
                    </button>

                    <button
                      onClick={() => handleSection8Button('next')}
                      onMouseEnter={() => setSection8Hovering('next')}
                      onMouseLeave={() => setSection8Hovering('')}
                      disabled={section8Completed}
                      className="px-8 py-4 border border-gray-400 bg-white hover:bg-gray-100 text-gray-800"
                    >
                      Next
                    </button>
                  </div>

                  <div className="text-center text-xs text-gray-500 mb-4">
                    {section8Hovering ? `Hovering over: ${section8Hovering}` : 'Hover to see... nothing helpful'}
                  </div>

                  {section8Completed && (
                    <div className="p-3 bg-green-50 border border-green-300 text-sm text-green-800 text-center">
                      Success! Notice how long it took to decide without clear labels.
                    </div>
                  )}

                  <div className="text-xs text-gray-600 pt-4 border-t border-gray-200 text-center">
                    Attempts: {section8Attempts}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-300 p-4 mb-6">
                  <p className="text-sm text-yellow-800 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Observation:</strong> Buttons labeled "Continue," "Proceed," or "Next" without 
                      context force users to guess, increasing cognitive load and hesitation.
                    </span>
                  </p>
                </div>

                {section8Completed && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(7)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentSection(9)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 9 →
                    </button>
                  </div>
                )}
                {!section8Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(7)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 9: Delayed Error Disclosure */}
        {currentSection === 9 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 9: Delayed Error Disclosure</h2>
                  <p className="text-gray-600">Fill out the form correctly</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Late Validation
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  This form won't tell you what's wrong until after you submit. 
                  Even then, the error messages are vague and unhelpful.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
                  <h3 className="text-sm mb-4 text-gray-700">Registration Form</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={section9FormData.field1}
                        onChange={(e) => {
                          setSection9FormData(prev => ({ ...prev, field1: e.target.value }));
                          setSection9FieldEdits(prev => prev + 1);
                        }}
                        className="w-full border border-gray-400 p-2 bg-white text-sm"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Username</label>
                      <input
                        type="text"
                        value={section9FormData.field2}
                        onChange={(e) => {
                          setSection9FormData(prev => ({ ...prev, field2: e.target.value }));
                          setSection9FieldEdits(prev => prev + 1);
                        }}
                        className="w-full border border-gray-400 p-2 bg-white text-sm"
                        placeholder="Choose a username"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Password</label>
                      <input
                        type="password"
                        value={section9FormData.field3}
                        onChange={(e) => {
                          setSection9FormData(prev => ({ ...prev, field3: e.target.value }));
                          setSection9FieldEdits(prev => prev + 1);
                        }}
                        className="w-full border border-gray-400 p-2 bg-white text-sm"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>

                  {section9Error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-300 text-sm text-red-800">
                      {section9Error}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      Field edits: {section9FieldEdits} | Submit attempts: {section9Attempts}
                    </div>
                    <button
                      onClick={handleSection9Submit}
                      disabled={section9Completed}
                      className={`px-6 py-3 border ${
                        section9Completed
                          ? 'bg-green-100 text-green-800 border-green-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {section9Completed ? 'Submitted ✓' : 'Submit Form'}
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-300 p-4 mb-6">
                  <p className="text-sm text-orange-800 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Pattern:</strong> Forms that only show errors after submission—with generic messages 
                      like "Something is wrong"—force users to guess which fields are problematic.
                    </span>
                  </p>
                </div>

                {section9Completed && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(8)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentSection(10)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 10 →
                    </button>
                  </div>
                )}
                {!section9Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(8)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 10: Hover Deception */}
        {currentSection === 10 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 10: Hover Deception</h2>
                  <p className="text-gray-600">Click the interactive element</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: False Affordance
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  This element looks clickable when you hover over it, but clicking produces no immediate response. 
                  The feedback is delayed, making you question whether it worked.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-12 mb-6 flex items-center justify-center" style={{ minHeight: '250px' }}>
                  <div className="text-center">
                    <button
                      onClick={handleSection10Click}
                      disabled={section10Completed}
                      className={`px-12 py-6 border text-lg cursor-pointer hover:border-blue-600 hover:text-blue-600 transition-colors ${
                        section10Completed
                          ? 'bg-green-100 text-green-800 border-green-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-400'
                      }`}
                    >
                      {section10Completed ? 'Activated ✓' : 'Click Me'}
                    </button>
                    <div className="text-xs text-gray-600 mt-4">
                      Hover-click loops: {section10HoverLoops} | Attempts: {section10Attempts}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-300 p-4 mb-6">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <span className="text-lg">ℹ️</span>
                    <span>
                      <strong>Pattern:</strong> Elements that appear clickable on hover but don't respond immediately 
                      create confusion and repeated attempts.
                    </span>
                  </p>
                </div>

                {section10Completed && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(9)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentSection(11)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 11 →
                    </button>
                  </div>
                )}
                {!section10Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(9)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 11: Tiny Click Target */}
        {currentSection === 11 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 11: Tiny Click Target</h2>
                  <p className="text-gray-600">Close the notification</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Small Hit Area
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  Try to close the notification below by clicking the small X icon. 
                  The hit area is intentionally small and unforgiving.
                </p>

                <div 
                  className="bg-gray-50 border border-gray-300 p-12 mb-6 relative flex items-center justify-center cursor-pointer" 
                  style={{ minHeight: '250px' }}
                  onClick={handleSection11AreaClick}
                >
                  {!section11Completed ? (
                    <div className="bg-blue-600 text-white p-4 border border-blue-700 max-w-md relative">
                      <p className="text-sm pr-8">
                        This is an important notification. Click the X to dismiss it.
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSection11Success();
                        }}
                        className="absolute top-1 right-1 text-white text-xs w-4 h-4 flex items-center justify-center hover:bg-blue-700"
                        style={{ fontSize: '10px' }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-green-700 text-lg mb-2">✓ Notification Closed</div>
                      <div className="text-sm text-gray-600">After {section11MissedClicks} missed clicks</div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-300 p-4 mb-6">
                  <p className="text-sm text-yellow-800 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Pattern:</strong> Tiny close buttons on modals, ads, and notifications 
                      require precision and create frustration, especially on mobile devices.
                    </span>
                  </p>
                </div>

                <div className="text-xs text-gray-600 text-center mb-6">
                  Missed clicks: {section11MissedClicks}
                </div>

                {section11Completed && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(10)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentSection(12)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 12 →
                    </button>
                  </div>
                )}
                {!section11Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(10)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 12: Moving Target */}
        {currentSection === 12 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 12: Moving Target</h2>
                  <p className="text-gray-600">Click the shifting button</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Shifty Elements
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  This button shifts position slightly when you hover or focus on it. 
                  The movement is subtle but enough to cause missed clicks.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-12 mb-6 relative" style={{ minHeight: '300px' }}>
                  <div 
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${section12ButtonPos}px), -50%)`,
                      transition: 'transform 0.2s ease-out'
                    }}
                  >
                    <button
                      onMouseEnter={handleSection12Hover}
                      onClick={handleSection12Click}
                      disabled={section12Completed}
                      className={`px-8 py-4 border ${
                        section12Completed
                          ? 'bg-green-600 text-white border-green-600 cursor-not-allowed'
                          : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {section12Completed ? 'Success ✓' : 'Click to Continue'}
                    </button>
                  </div>

                  {!section12Completed && section12Attempts > 0 && (
                    <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-600 bg-white border border-gray-300 p-2">
                      Failed attempts: {section12Attempts} - {section12Attempts >= 2 ? 'Button will stabilize now' : 'Try again'}
                    </div>
                  )}
                </div>

                <div className="bg-red-50 border border-red-300 p-4 mb-6">
                  <p className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Pattern:</strong> Buttons that shift when hovered or focused violate user expectations 
                      and are especially common in ads designed to generate accidental clicks.
                    </span>
                  </p>
                </div>

                {section12Completed && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentSection(11)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setCurrentSection(13)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      Continue to Section 13 →
                    </button>
                  </div>
                )}
                {!section12Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(11)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 13: Auto-Advancing Content */}
        {currentSection === 13 && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Section 13: Auto-Advancing Content</h2>
                  <p className="text-gray-600">Try to read the content before it changes</p>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 border border-gray-300">
                  Pattern: Forced Pace
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-800 mb-6 leading-relaxed">
                  This content automatically advances to the next slide every few seconds, 
                  regardless of whether you've finished reading. There's no pause button.
                </p>

                <div className="bg-gray-50 border border-gray-300 p-8 mb-6" style={{ minHeight: '300px' }}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm text-gray-700">Auto-Advancing Tutorial</h3>
                    <div className="text-xs text-gray-500">
                      Slide {section13CurrentSlide + 1} of 4
                    </div>
                  </div>

                  <div className="prose">
                    {section13CurrentSlide === 0 && (
                      <div>
                        <h4 className="text-lg mb-3">Step 1: Understanding the Basics</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          Welcome to this tutorial. Before you can fully read and understand this content, 
                          it will automatically advance to the next slide. This pattern is common in 
                          slideshow ads, onboarding flows, and carousel interfaces.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Notice how you feel rushed to finish reading before the content disappears. 
                          This creates unnecessary cognitive pressure and reduces comprehension.
                        </p>
                      </div>
                    )}
                    
                    {section13CurrentSlide === 1 && (
                      <div>
                        <h4 className="text-lg mb-3">Step 2: Advanced Concepts</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          The previous slide likely changed before you finished reading it. 
                          Now you're on a new topic without being ready. This disrupts the natural 
                          learning flow and forces you to adapt to the interface's pace rather than your own.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Users often try to scroll back or look for a pause button, only to find none exists.
                        </p>
                      </div>
                    )}
                    
                    {section13CurrentSlide === 2 && (
                      <div>
                        <h4 className="text-lg mb-3">Step 3: Implementation Details</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          By now you may have missed important information from previous slides. 
                          Auto-advancing content prioritizes the designer's pacing over user needs, 
                          often resulting in confusion and frustration.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          This pattern is especially problematic for users who read at different speeds 
                          or need time to process complex information.
                        </p>
                      </div>
                    )}
                    
                    {section13CurrentSlide >= 3 && (
                      <div>
                        <h4 className="text-lg mb-3 text-green-700">Complete</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          The slideshow has ended. You spent {section13ReadTime} seconds trying to keep up 
                          with content that advanced automatically. Did you feel in control of your learning?
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Good interfaces let users control the pace. Bad interfaces control users.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-center gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === section13CurrentSlide ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-300 p-4 mb-6">
                  <p className="text-sm text-orange-800 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>
                      <strong>Pattern:</strong> Auto-advancing content removes user control and creates anxiety. 
                      Users can't pause to think, can't go back to review, and can't progress at their own pace.
                    </span>
                  </p>
                </div>

                {section13Completed && (
                  <div className="flex justify-between items-center bg-green-50 border border-green-300 p-4">
                    <button
                      onClick={() => setCurrentSection(12)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                    <p className="text-sm text-green-700">
                      You've completed all friction sections. See your results.
                    </p>
                    <button
                      onClick={() => setCurrentSection(14)}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-900"
                    >
                      View Results →
                    </button>
                  </div>
                )}
                {!section13Completed && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setCurrentSection(12)}
                      className="px-6 py-3 border border-gray-400 bg-white hover:bg-gray-100"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Final Reflection Screen */}
        {currentSection === 14 && (
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white border border-gray-300 p-12">
              <h1 className="text-4xl mb-3">Experiment Complete</h1>
              <p className="text-xl text-gray-600 mb-2">This is how users feel on badly designed websites.</p>
              <p className="text-lg text-gray-500 mb-8 italic">Anxiety based entirely on your behavior—not time spent.</p>

              <div className="bg-red-50 border-2 border-red-400 p-6 mb-8">
                <h3 className="text-lg mb-3">Your Final Anxiety Level: {anxietyLevel}/100 — {getAnxietyState()}</h3>
                <div className="w-full h-4 bg-gray-200 border border-gray-300 rounded-sm overflow-hidden mb-3">
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${anxietyLevel}%`,
                      backgroundColor: anxietyLevel < 25 ? '#22c55e' : anxietyLevel < 50 ? '#eab308' : anxietyLevel < 75 ? '#f97316' : '#dc2626'
                    }}
                  />
                </div>
                <p className="text-sm text-red-800">
                  Different users will end with different anxiety levels. Yours was shaped by your hesitations, 
                  repeated clicks, missed targets, and moments of frustration—not by the clock.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg mb-4">What Your Behavior Revealed:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {stats.cursorHesitations > 5 && (
                    <div className="flex items-start bg-gray-50 border border-gray-200 p-3">
                      <span className="mr-3 text-lg">⏸️</span>
                      <span className="text-sm">You hesitated frequently—your cursor stopped {stats.cursorHesitations} times for more than 2 seconds, showing uncertainty.</span>
                    </div>
                  )}
                  
                  {stats.retries > 3 && (
                    <div className="flex items-start bg-gray-50 border border-gray-200 p-3">
                      <span className="mr-3 text-lg">🔄</span>
                      <span className="text-sm">You retried actions {stats.retries} times—repeatedly attempting failed interactions shows lost confidence.</span>
                    </div>
                  )}
                  
                  {stats.missedClicks > 0 && (
                    <div className="flex items-start bg-gray-50 border border-gray-200 p-3">
                      <span className="mr-3 text-lg">🎯</span>
                      <span className="text-sm">You missed {stats.missedClicks} click targets, indicating poor interface affordances.</span>
                    </div>
                  )}
                  
                  {stats.rageClicks > 0 && (
                    <div className="flex items-start bg-gray-50 border border-gray-200 p-3">
                      <span className="mr-3 text-lg">💢</span>
                      <span className="text-sm">You rage-clicked {stats.rageClicks} times—clicking rapidly out of frustration when things didn't work.</span>
                    </div>
                  )}
                  
                  {stats.distractions > 0 && (
                    <div className="flex items-start bg-gray-50 border border-gray-200 p-3">
                      <span className="mr-3 text-lg">🚨</span>
                      <span className="text-sm">You were interrupted {stats.distractions} times, breaking your focus and forcing context switches.</span>
                    </div>
                  )}

                  {stats.pressureResponses > 0 && (
                    <div className="flex items-start bg-gray-50 border border-gray-200 p-3">
                      <span className="mr-3 text-lg">⏰</span>
                      <span className="text-sm">You made {stats.pressureResponses} decisions under artificial pressure and time constraints.</span>
                    </div>
                  )}

                  {anxietyLevel < 30 && (
                    <div className="flex items-start bg-gray-50 border border-gray-200 p-3">
                      <span className="mr-3 text-lg">😌</span>
                      <span className="text-sm">You stayed relatively calm—completing tasks smoothly with few mistakes or hesitations.</span>
                    </div>
                  )}

                  {anxietyLevel >= 70 && (
                    <div className="flex items-start bg-gray-50 border border-gray-200 p-3">
                      <span className="mr-3 text-lg">😤</span>
                      <span className="text-sm">Your anxiety peaked high—indicating significant friction, confusion, and repeated failures throughout.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="border border-gray-300 p-6 bg-gray-50">
                  <div className="text-3xl mb-2">{stats.totalClicks}</div>
                  <div className="text-sm text-gray-600 mb-1">Total Clicks</div>
                  <div className="text-xs text-gray-500">All interactions tracked</div>
                </div>
                <div className="border border-gray-300 p-6 bg-gray-50">
                  <div className="text-3xl mb-2">{stats.hesitations + stats.cursorHesitations}</div>
                  <div className="text-sm text-gray-600 mb-1">Hesitations</div>
                  <div className="text-xs text-gray-500">Pauses and uncertainty</div>
                </div>
                <div className="border border-gray-300 p-6 bg-gray-50">
                  <div className="text-3xl mb-2">{stats.retries}</div>
                  <div className="text-sm text-gray-600 mb-1">Retries</div>
                  <div className="text-xs text-gray-500">Failed attempts</div>
                </div>
                <div className="border border-gray-300 p-6 bg-gray-50">
                  <div className="text-3xl mb-2">{stats.timeSpent}s</div>
                  <div className="text-sm text-gray-600 mb-1">Time Spent</div>
                  <div className="text-xs text-gray-500">Total duration</div>
                </div>
                <div className="border border-gray-300 p-6 bg-gray-50">
                  <div className="text-3xl mb-2">{stats.missedClicks}</div>
                  <div className="text-sm text-gray-600 mb-1">Missed Clicks</div>
                  <div className="text-xs text-gray-500">Outside targets</div>
                </div>
                <div className="border border-gray-300 p-6 bg-gray-50">
                  <div className="text-3xl mb-2">{stats.rageClicks}</div>
                  <div className="text-sm text-gray-600 mb-1">Rage Clicks</div>
                  <div className="text-xs text-gray-500">Rapid frustration</div>
                </div>
              </div>

              <div className="border-t-2 border-gray-900 pt-8 mb-8">
                <h3 className="text-lg mb-4">The Friction Patterns You Experienced:</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">⏳</span>
                      <span>Delayed Feedback</span>
                    </h4>
                    <p className="text-sm text-gray-700">Uncertain wait times without clear progress indicators.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span>Unclear Affordances</span>
                    </h4>
                    <p className="text-sm text-gray-700">Buttons that don't look or behave as expected.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <span>Unstable Interfaces</span>
                    </h4>
                    <p className="text-sm text-gray-700">Moving targets and shifting layouts.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🧠</span>
                      <span>Cognitive Overload</span>
                    </h4>
                    <p className="text-sm text-gray-700">Too many choices without clear guidance.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🔔</span>
                      <span>Interruptions</span>
                    </h4>
                    <p className="text-sm text-gray-700">Constant notifications breaking focus.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">⏰</span>
                      <span>Artificial Pressure</span>
                    </h4>
                    <p className="text-sm text-gray-700">Fake scarcity and countdown timers.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      <span>False Progress</span>
                    </h4>
                    <p className="text-sm text-gray-700">Progress bars that mislead and stall.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">❓</span>
                      <span>Ambiguous CTAs</span>
                    </h4>
                    <p className="text-sm text-gray-700">Buttons with unclear intent and labels.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">❌</span>
                      <span>Delayed Errors</span>
                    </h4>
                    <p className="text-sm text-gray-700">Late validation with vague messages.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">👻</span>
                      <span>Hover Deception</span>
                    </h4>
                    <p className="text-sm text-gray-700">Elements that look clickable but aren't.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      <span>Tiny Targets</span>
                    </h4>
                    <p className="text-sm text-gray-700">Small hit areas requiring precision.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">↔️</span>
                      <span>Moving Targets</span>
                    </h4>
                    <p className="text-sm text-gray-700">Buttons that shift on hover or focus.</p>
                  </div>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <h4 className="mb-2 flex items-center gap-2">
                      <span className="text-lg">⏭️</span>
                      <span>Auto-Advancing</span>
                    </h4>
                    <p className="text-sm text-gray-700">Content that changes before you finish.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 text-white p-8 mb-8">
                <p className="text-lg leading-relaxed mb-4">
                  "These patterns exist in real products every day. Users abandon shopping carts, 
                  quit signup flows, and delete apps—not because they don't want the product, 
                  but because the interface makes them feel stupid, frustrated, and exhausted."
                </p>
                <p className="text-sm text-gray-400">
                  The cumulative effect of these "small" design decisions creates massive user churn and 
                  damages brand trust. What feels like friction to designers is experienced as genuine stress by users.
                </p>
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleRestart}
                  className="px-8 py-4 bg-black text-white hover:bg-gray-900"
                >
                  Restart Experiment
                </button>
                <button
                  onClick={() => setCurrentSection(1)}
                  className="px-8 py-4 border border-gray-400 bg-white hover:bg-gray-100"
                >
                  Replay Sections
                </button>
                <button
                  className="px-8 py-4 border border-gray-400 bg-white hover:bg-gray-100"
                  onClick={() => {
                    trackClick();
                    alert('Results copied to clipboard! (Simulated)');
                  }}
                >
                  Share Results
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-300 p-4">
                <p className="text-sm text-blue-800">
                  <strong>📚 Learn More:</strong> This experiment was designed to make invisible friction visible. 
                  Share it with designers, developers, and product managers to spark conversations about user experience 
                  and the real impact of design decisions.
                </p>
              </div>

              <div className="mt-8 text-sm text-gray-600 border-t border-gray-200 pt-6">
                <p className="mb-2">Want to dive deeper? Explore these resources:</p>
                <div className="flex gap-4 text-blue-600">
                  <button className="underline">UX Research Papers</button>
                  <button className="underline">Dark Patterns Database</button>
                  <button className="underline">Design Ethics Guidelines</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
