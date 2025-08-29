'use client'
import JupiterTerminal from '@/components/JupiterTerminal'

export default function Enter(){
  return (
    <main className="hero px-4 md:px-8 py-8">
      <section className="panel card p-6" aria-label="Swap $METSUMI">
        <h1 className="headline">Enter <span style={{color:'var(--teal)'}}>$METSUMI</span></h1>
        <p className="sub">Swap on Solana via Jupiter. Connect your wallet in the terminal.</p>
        <div className="meta flex flex-wrap justify-center gap-2 my-3">
          <span className="pill">Chain: <strong>SOLANA</strong></span>
          <span className="pill">Pool: <strong>DAMMv2</strong></span>
          <span className="pill">Token: <strong>$METSUMI</strong></span>
        </div>
        <JupiterTerminal />
      </section>
    </main>
  )
}
