'use client'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token'
import { useEffect, useState } from 'react'

const MINT = new PublicKey(process.env.NEXT_PUBLIC_METSUMI_MINT!)
const DECIMALS = 9 // change if METSUMI decimals differ
const REQUIRED = (BigInt(10) ** BigInt(DECIMALS)) * BigInt(500) // 500 * 10^decimals

export default function PayGate({ onVerified }: { onVerified: (sig: string) => void }){
  const { connection } = useConnection()
  const { publicKey, signTransaction, connected } = useWallet()
  const [busy, setBusy] = useState(false)
  const [okSig, setOkSig] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [hasEnough, setHasEnough] = useState<boolean>(false)
  const TREASURY = new PublicKey(process.env.NEXT_PUBLIC_TREASURY!)

  useEffect(() => {
    (async () => {
      if (!connected || !publicKey) return
      try {
        const ata = await getAssociatedTokenAddress(MINT, publicKey, false)
        const bal = await connection.getTokenAccountBalance(ata).catch(()=>null)
        const amt = BigInt(bal?.value?.amount || '0')
        setHasEnough(amt >= REQUIRED)
      } catch { setHasEnough(false) }
    })()
  }, [connected, publicKey, connection])

  const pay = async () => {
    setErr(null)
    if (!publicKey || !signTransaction) { setErr('Connect wallet'); return }
    try {
      setBusy(true)
      const fromATA = await getAssociatedTokenAddress(MINT, publicKey, false)
      const toATA   = await getAssociatedTokenAddress(MINT, TREASURY, true)
      const ix = createTransferInstruction(fromATA, toATA, publicKey, Number(REQUIRED))
      const tx = new Transaction().add(ix)
      tx.feePayer = publicKey
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      const signed = await signTransaction(tx)
      const sig = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false })
      await connection.confirmTransaction(sig, 'confirmed')
      setOkSig(sig)

      const res = await fetch('/api/verify-and-launch', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: sig, payer: publicKey.toBase58() })
      })
      if (!res.ok) throw new Error('Server rejected payment')
      onVerified(sig)
    } catch (e:any) {
      setErr(e.message || 'Payment failed')
    } finally { setBusy(false) }
  }

  return (
    <div className="card p-4 space-y-3">
      <div className="text-sm opacity-80">Pay <b>500 $METSUMI</b> to unlock token launch on Meteora (DBC).</div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="tag">Mint: {process.env.NEXT_PUBLIC_METSUMI_MINT}</span>
        <span className="tag">Treasury: {process.env.NEXT_PUBLIC_TREASURY}</span>
      </div>
      {!connected && <div className="text-rose-300 text-sm">Connect a wallet to continue.</div>}
      {connected && !hasEnough && <div className="text-amber-300 text-sm">You don’t have 500 $METSUMI. Buy on /enter, then retry.</div>}
      <button disabled={!connected || !hasEnough || busy} className="btn" onClick={pay}>
        {busy ? 'Processing…' : 'Pay 500 $METSUMI'}
      </button>
      {okSig && <div className="text-emerald-300 text-sm">Payment confirmed: {okSig}</div>}
      {err && <div className="text-rose-300 text-sm">{err}</div>}
    </div>
  )
}
