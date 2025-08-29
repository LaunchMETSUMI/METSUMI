import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'

const RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
const MINT = new PublicKey(process.env.NEXT_PUBLIC_METSUMI_MINT!)
const TREASURY = new PublicKey(process.env.NEXT_PUBLIC_TREASURY!)
const DECIMALS = 9
const REQUIRED = (BigInt(10) ** BigInt(DECIMALS)) * BigInt(500)

export async function POST(req: NextRequest){
  const body = await req.json().catch(()=> ({} as any))
  if (body.signature && body.payer){
    const ok = await verifyPayment(body.signature as string, body.payer as string)
    if(!ok) return NextResponse.json({ ok:false, error:'Payment not verified' }, { status: 400 })
    return NextResponse.json({ ok:true, verified:true })
  }
  if (body.launch){
    if (process.env.LAUNCH_WEBHOOK_URL){
      const res = await fetch(process.env.LAUNCH_WEBHOOK_URL, {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
          'x-launch-secret': process.env.LAUNCH_WEBHOOK_SECRET || ''
        }, body: JSON.stringify(body.launch)
      }).catch(()=> null)
      return NextResponse.json({ ok: !!res?.ok, forwarded: true })
    }
    return NextResponse.json({ ok:true, forwarded:false, note:'No LAUNCH_WEBHOOK_URL configured. Implement Invent call here.' })
  }
  return NextResponse.json({ ok:false, error:'Bad request' }, { status: 400 })
}

async function verifyPayment(signature: string, payer: string){
  if (process.env.DEBUG_BYPASS_VERIFY === '1') return true // LOCAL DEV ONLY
  const connection = new Connection(RPC, 'confirmed')
  const tx = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0 })
  if (!tx || !tx.meta) return false
  const postTokenBalances = tx.meta.postTokenBalances || []
  const preTokenBalances  = tx.meta.preTokenBalances || []
  const payerPre  = preTokenBalances.find(b => b.owner === payer && b.mint === MINT.toBase58())
  const payerPost = postTokenBalances.find(b => b.owner === payer && b.mint === MINT.toBase58())
  const trePre    = preTokenBalances.find(b => b.owner === TREASURY.toBase58() && b.mint === MINT.toBase58())
  const trePost   = postTokenBalances.find(b => b.owner === TREASURY.toBase58() && b.mint === MINT.toBase58())
  if (!payerPre || !payerPost || !trePost) return false
  const deltaPayer = BigInt(payerPre.uiTokenAmount.amount) - BigInt(payerPost.uiTokenAmount.amount)
  const deltaTreas = BigInt(trePost.uiTokenAmount.amount) - BigInt((trePre?.uiTokenAmount.amount) || '0')
  return deltaPayer === REQUIRED && deltaTreas === REQUIRED
}
