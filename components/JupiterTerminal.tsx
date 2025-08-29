'use client'
import { useEffect, useRef, useState } from 'react'

const MINT_METSUMI = 'J3Mpjvkc31hn58z4uKN6svrPYwpNaewVTkBZCbekjupx'
const MINT_SOL     = 'So11111111111111111111111111111111111111112'
const MINT_USDC    = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

export default function JupiterTerminal(){
  const ref = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<'SOL'|'USDC'>('SOL')

  useEffect(() => {
    const load = () => new Promise<void>((resolve,reject)=>{
      if ((window as any).Jupiter) return resolve()
      const s = document.createElement('script'); s.src = 'https://terminal.jup.ag/main-v3.js';
      s.onload = () => resolve(); s.onerror = () => reject(new Error('Jupiter failed to load')); document.head.appendChild(s)
    })
    const init = async () => {
      await load(); if(!ref.current) return
      ref.current.innerHTML = ''
      const inputMint = input==='USDC'? MINT_USDC : MINT_SOL
      ;(window as any).Jupiter.init({
        displayMode: 'embedded',
        container: ref.current,
        defaultInputMint: inputMint,
        defaultOutputMint: MINT_METSUMI,
        strictTokenList: false,
      })
    }
    init()
  }, [input])

  return (
    <div className="grid gap-3">
      <div className="switchers flex gap-2 justify-center">
        <button className={`btn ${input==='SOL'?'active':''}`} onClick={()=>setInput('SOL')}>Buy with SOL</button>
        <button className={`btn ${input==='USDC'?'active':''}`} onClick={()=>setInput('USDC')}>Buy with USDC</button>
      </div>
      <div className="rounded-2xl overflow-hidden border" style={{borderColor:'var(--border)'}}>
        <div ref={ref} style={{minHeight:640}} />
      </div>
    </div>
  )
}
