'use client';
import React from 'react';

export default function ThemeToggle() {
  const [label, setLabel] = React.useState('Auto');
  const [mode, setMode] = React.useState<'auto'|'light'|'dark'>('auto');

  React.useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('metsumi_theme')) || 'auto';
    setMode(saved as any);
    setLabel(saved === 'light' ? 'Light' : saved === 'dark' ? 'Dark' : 'Auto');
  }, []);

  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme') as 'auto'|'light'|'dark' || 'auto';
    const next = current === 'auto' ? 'dark' : (current === 'dark' ? 'light' : 'auto');
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('metsumi_theme', next);
    setMode(next);
    setLabel(next === 'light' ? 'Light' : next === 'dark' ? 'Dark' : 'Auto');
  };

  return (
    <button className="toggle" onClick={toggle} aria-label="Toggle color theme" type="button">
      {/* Keep DOM stable: render both icons and just hide/show via inline style */}
      <svg style={{display: mode === 'light' ? 'block' : 'none'}} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm10-7a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm12.364 6.364a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.415 1.414l-.708.707a1 1 0 0 1-1.414 0ZM4.514 6.636a1 1 0 0 1 0-1.414l.707-.707A1 1 0 1 1 6.636 6.93l-.707.707a1 1 0 0 1-1.415 0Zm13.435-1.415a1 1 0 0 1 1.415 0l.707.707A1 1 0 1 1 18.657 7.05l-.707-.707a1 1 0 0 1 0-1.414ZM5.222 18.364a1 1 0 0 1 1.414 0l.707.707A1 1 0 1 1 5.928 20.485l-.707-.707a1 1 0 0 1 0-1.414Z"/>
      </svg>
      <svg style={{display: mode === 'light' ? 'none' : 'block'}} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.75 14.5a9.5 9.5 0 1 1-9.25-12 8 8 0 0 0 9.25 12Z"/>
      </svg>
      <span id="modeLabel">{label}</span>
    </button>
  );
}
