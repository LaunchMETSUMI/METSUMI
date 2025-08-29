'use client';

import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import {
  Connection, PublicKey, SystemProgram, Transaction, Keypair,
} from '@solana/web3.js';
import {
  getMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction, getAccount, MINT_SIZE,
  createInitializeMintInstruction, createMintToInstruction,
} from '@solana/spl-token';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com';
const METSUMI_MINT = new PublicKey('J3Mpjvkc31hn58z4uKN6svrPYwpNaewVTkBZCbekjupx');
const TREASURY = new PublicKey('Xv2hK594scUGZs9V7tqhavkfcUyEBHfUt7RNC29HHyN');

type Wallet = {
  publicKey?: PublicKey;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
};

declare global { interface Window { solana?: Wallet; } }

export default function Launch() {
  const connection = React.useMemo(() => new Connection(RPC_URL, 'confirmed'), []);
  const [pubkey, setPubkey] = React.useState<PublicKey | null>(null);
  const [paid, setPaid] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [sig, setSig] = React.useState('');

  // form
  const [name, setName] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [decimals, setDecimals] = React.useState<number>(6);
  const [supply, setSupply] = React.useState<string>('1000000');
  const [logoUrl, setLogoUrl] = React.useState('');

  const banner = 'Global $METSUMI Pad Launch: 7 September 2025';

  const connect = async () => {
    if (!window.solana) { alert('Install Phantom or a Solana wallet'); return; }
    const res = await window.solana.connect();
    setPubkey(res.publicKey);
  };
  const disconnect = async () => { try{ await window.solana?.disconnect(); }catch{} setPubkey(null); setPaid(false); setSig(''); };

  async function ensureAta(payer: PublicKey, owner: PublicKey, mint: PublicKey, tx: Transaction) {
    const ata = await getAssociatedTokenAddress(mint, owner, false);
    try { await getAccount(connection, ata); }
    catch { tx.add(createAssociatedTokenAccountInstruction(payer, ata, owner, mint)); }
    return ata;
  }

  const payFee = async () => {
    if (!pubkey || !window.solana) return;
    setStatus('Checking METSUMI mint…');
    const mintInfo = await getMint(connection, METSUMI_MINT);
    const dec = mintInfo.decimals;
    const amount = BigInt(500) * BigInt(10 ** dec);

    const tx = new Transaction();
    const userAta = await ensureAta(pubkey, pubkey, METSUMI_MINT, tx);
    const treaAta = await ensureAta(pubkey, TREASURY, METSUMI_MINT, tx);

    tx.add(createTransferCheckedInstruction(userAta, METSUMI_MINT, treaAta, pubkey, amount, dec));
    tx.feePayer = pubkey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    setStatus('Sign 500 $METSUMI transfer…');
    const res = await window.solana.signAndSendTransaction(tx);
    setStatus('Confirming…');
    await connection.confirmTransaction(res.signature, 'confirmed');

    setSig(res.signature);
    setPaid(true);
    setStatus('✅ Fee paid. You can create your token.');
  };

  const createToken = async () => {
    if (!pubkey || !window.solana) return;
    if (!name || !symbol) { alert('Fill name & symbol'); return; }

    const dec = Number(decimals);
    const total = BigInt(supply || '0');
    if (isNaN(dec) || dec < 0 || dec > 9) { alert('Decimals must be 0–9'); return; }
    if (total <= 0n) { alert('Supply must be > 0'); return; }

    const tx = new Transaction();
    const mint = new Keypair();

    const rent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
    tx.add(SystemProgram.createAccount({
      fromPubkey: pubkey,
      newAccountPubkey: mint.publicKey,
      lamports: rent,
      space: MINT_SIZE,
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    }));

    tx.add(createInitializeMintInstruction(mint.publicKey, dec, pubkey, pubkey));

    const userAta = await getAssociatedTokenAddress(mint.publicKey, pubkey, false);
    try { await getAccount(connection, userAta); }
    catch { tx.add(createAssociatedTokenAccountInstruction(pubkey, userAta, pubkey, mint.publicKey)); }

    const amount = total * BigInt(10 ** dec);
    tx.add(createMintToInstruction(mint.publicKey, userAta, pubkey, amount));

    tx.feePayer = pubkey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.partialSign(mint);

    setStatus('Creating mint…');
    const res = await window.solana.signAndSendTransaction(tx);
    await connection.confirmTransaction(res.signature, 'confirmed');
    // NEW
setStatus(
  `✅ Token created: ${mint.publicKey.toBase58()}

confirmation of SPL mint has been done 500 $METSUMI charged for this you confirm you are in $METSUMI [REDACTED] , $METSUMI is building the NATIVE $METSUMI token for it's launchpad ; come back again at 7.9.2025 , check our github file in bottom of the page, BIG THINGS are coming!`
);


    // Offer DBC config scaffold
    const cfg = {
      token: { name, symbol, decimals: dec, logo: logoUrl, mint: mint.publicKey.toBase58(), owner: pubkey.toBase58() },
      feePaidSignature: sig || res.signature,
      dbc: {
        pool_config_key: "REPLACE_WITH_YOUR_DBC_CONFIG_KEY",
        rpc_url: RPC_URL,
      },
    };
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${symbol || 'token'}-dbc-config.json`; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1500);
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
          <span className="tag">$METSUMI • Launch</span>

          <div className="nav-right">
            <ThemeToggle />
            <a className="toggle" href="/" aria-label="Back">← Back</a>
            <a className="toggle" href="https://docs.meteora.ag/developer-guide/invent/actions" target="_blank" rel="noopener">Docs</a>
            {!pubkey ? (
              <button className="toggle" onClick={connect}>Connect Wallet</button>
            ) : (
              <button className="toggle" onClick={disconnect}>
                {pubkey.toBase58().slice(0,4)}…{pubkey.toBase58().slice(-4)} · Disconnect
              </button>
            )}
          </div>
        </header>

        {/* LAUNCH */}
        <main className="hero">
          <section className="panel" aria-label="Launch">
            <div className="tminus"><span className="ping"></span>{banner}</div>

            <h1 className="headline">
              <span className="text-logo">
                <span className="glitch" data-text="LAUNCH">LAUNCH</span>
              </span>
            </h1>

            <p className="sub">Pay <strong>500 $METSUMI</strong>, then create your Meme token (name, symbol, supply). A ready-to-edit <code>DBC</code> config will download for Meteora Invent.</p>

            {/* Step A */}
            <div className="panel" style={{marginTop:16}}>
              <h3 style={{marginTop:0}}>Step A — Pay the Launch Fee (500 $METSUMI)</h3>
              <p className="tiny">Treasury: <code>{TREASURY.toBase58()}</code></p>
              {!pubkey ? <p>Connect your wallet to continue.</p> :
                paid ? <p>✅ Paid {sig && <>· <a href={`https://solscan.io/tx/${sig}`} target="_blank" rel="noopener">view</a></>}</p> :
                <button className="btn primary" onClick={payFee}>Pay 500 $METSUMI</button>}
            </div>

            {/* Step B */}
            <div className="panel" style={{marginTop:16}}>
              <h3 style={{marginTop:0}}>Step B — Create Your MEME TOKEN</h3>
              <div style={{display:'grid', gap:12, maxWidth:560, margin:'0 auto'}}>
                <label>Token Name <input className="pill" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. METSUPUP" /></label>
                <label>Symbol <input className="pill" value={symbol} onChange={e=>setSymbol(e.target.value)} placeholder="e.g. MSP" /></label>
                <label>Decimals <input className="pill" type="number" min={0} max={9} value={decimals} onChange={e=>setDecimals(parseInt(e.target.value||'0'))} /></label>
                <label>Total Supply (whole units) <input className="pill" type="number" min={1} value={supply} onChange={e=>setSupply(e.target.value)} /></label>
                <label>Logo URL (optional) <input className="pill" value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="https://..." /></label>
              </div>
              <div className="actions" style={{marginTop:12}}>
                <button className="btn" onClick={()=>{ setName('METSUMI TEST'); setSymbol('MTEST'); setDecimals(6); setSupply('1000000'); }}>Quick Fill</button>
                <button className="btn primary" onClick={createToken} disabled={!pubkey || !paid}>Create Token</button>
              </div>
              {!paid && <p className="tiny" style={{marginTop:8}}>Pay the fee first to enable token creation.</p>}
            </div>

            {/* Documents */}
            <div className="panel" style={{marginTop:16}}>
              <h3 style={{marginTop:0}}>Documents</h3>
              <div className="actions" style={{marginTop:8}}>
                <a className="btn" href="https://github.com/MeteoraAg/meteora-invent" target="_blank" rel="noopener">Meteora Invent Repo</a>
                <a className="btn" href="https://docs.meteora.ag/developer-guide/invent/actions" target="_blank" rel="noopener">DBC Actions Docs</a>
                <a className="btn primary" href="https://github.com/LaunchMETSUMI" target="_blank" rel="noopener">METSUMI Launchpad</a>
              </div>
            </div>

            {status && <p className="tiny" style={{marginTop:12}}>{status}</p>}
          </section>
        </main>

        {/* FOOTER */}
        <footer>
          <div className="tiny">© {new Date().getFullYear()} METSUMI — Launch</div>
          <div className="tiny">Palette: <span style={{color:'var(--accent)'}}>#7a3cff</span> / <span style={{color:'var(--accent-2)'}}>#ff7a18</span> / <span style={{color:'var(--teal)'}}>#10f0d0</span></div>
        </footer>
      </div>
    </>
  );
}
