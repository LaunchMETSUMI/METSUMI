'use client';

import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const contract = 'J3Mpjvkc31hn58z4uKN6svrPYwpNaewVTkBZCbekjupx';
  const [chain, setChain] = React.useState('SOLANA');
  const [copied, setCopied] = React.useState<'idle' | 'ok' | 'fail'>('idle');

  React.useEffect(() => {
    const c = (location.hash || '').replace('#', '').toUpperCase();
    if (c) setChain(c);
  }, []);

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(contract);
      setCopied('ok');
      setTimeout(() => setCopied('idle'), 1200);
    } catch {
      setCopied('fail');
      setTimeout(() => setCopied('idle'), 1600);
    }
  };

  return (
    <>
      <div className="stars" />
      <div className="twinkle" />

      <div className="wrap">
        {/* NAV */}
        <header className="nav">
          <div className="brand">
            <img className="logo" src="/metsumi.gif" alt="METSUMI logo" />
            METSUMI
          </div>
          <span className="tag">$METSUMI • Native Token</span>

          <div className="nav-right">
            <ThemeToggle />
            <a
              className="toggle"
              href="https://x.com/i/communities/1961012857719423098"
              target="_blank"
              rel="noopener"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2H21l-6.54 7.47L22.5 22h-6.91l-4.31-5.62L5.2 22H2.44l7.03-8.02L1.5 2h6.94l3.89 5.18L18.24 2Zm-1.21 18h1.87L7.04 4h-1.9l11.88 16Z" />
              </svg>
              X Community
            </a>
          </div>
        </header>

        {/* HERO */}
        <main className="hero">
          <section className="panel" aria-label="Intro">
            <div className="tminus">
              <span className="ping"></span>
              {contract}
            </div>

            <h1 className="headline">
              <span className="text-logo">
                <span className="glitch" data-text="METSUMI">
                  METSUMI
                </span>
              </span>
            </h1>

            <p className="sub">
              <strong>$METSUMI</strong> is for the builders and the degen poets fast, fun, and
              community-first. No bloat. Pure liftoff Native token.
            </p>

            {/* STATUS + FIXED TIME (no countdown) */}
            <div className="timer-wrap" role="status" aria-live="polite" aria-atomic="true">
              <div className="cell status">
                <div className="num">READY</div>
                <div className="label">STATUS</div>
              </div>
              <div className="cell">
                <div className="num">TEST</div>
                <div className="label">SPL</div>
              </div>
            </div>

            {/* CTAS */}
            <div className="actions">
              <a className="btn primary" href="/launch" id="enterMetsumi">
                ENTER METSUMI <span className="mono">↗</span>
              </a>
              <a
                className="btn"
                href="https://docs.meteora.ag/developer-guide/invent/actions"
                target="_blank"
                rel="noopener"
                id="readPaper"
              >
                READ PAPER
              </a>
              <a
                className="btn"
                href="https://x.com/i/communities/1961012857719423098"
                target="_blank"
                rel="noopener"
                id="join"
              >
                X COMMUNITY
              </a>
            </div>

            {/* CONTRACT / INFO */}
            <div className="contract">
              <span className="pill">
                Token: <strong>$METSUMI</strong>
              </span>
              <span className="pill" id="chain">
                Chain: <strong>{chain}</strong>
              </span>
              <span className="pill">
                Pool: <strong>DAMMv2</strong>
              </span>
              <span className="pill">
                Native: <strong>$METSUMI</strong>
              </span>
              <span className="copy" role="button" onClick={copyCA}>
                COPY CONTRACT
              </span>
              <span
                className="tiny"
                style={{
                  display: copied === 'idle' ? 'none' : 'inline',
                  color: copied === 'ok' ? '#9fffe7' : '#ffb3b3',
                }}
              >
                {copied === 'ok' ? 'copied ✓' : copied === 'fail' ? 'copy failed' : ''}
              </span>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer>
          <div className="tiny">© {new Date().getFullYear()} METSUMI</div>
          <div className="tiny">
            Palette: <span style={{ color: 'var(--accent)' }}>#7a3cff</span> /{' '}
            <span style={{ color: 'var(--accent-2)' }}>#ff7a18</span> /{' '}
            <span style={{ color: 'var(--teal)' }}>#10f0d0</span>
          </div>
        </footer>
      </div>
    </>
  );
}
