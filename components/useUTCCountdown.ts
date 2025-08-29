'use client'
import { useEffect, useMemo, useState } from 'react'
export function useUTCCountdown(targetHour = 23, targetMin = 30){
  const [left, setLeft] = useState<number>(0)
  const deadline = useMemo(() => {
    const now = new Date()
    const y = now.getUTCFullYear(), m = now.getUTCMonth(), d = now.getUTCDate()
    let t = new Date(Date.UTC(y, m, d, targetHour, targetMin, 0))
    if (now.getTime() >= t.getTime()) t = new Date(Date.UTC(y, m, d + 1, targetHour, targetMin, 0))
    return t
  }, [targetHour, targetMin])
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, deadline.getTime() - Date.now())), 1000)
    setLeft(Math.max(0, deadline.getTime() - Date.now()))
    return () => clearInterval(id)
  }, [deadline])
  const sec = Math.floor(left/1000)
  const days = Math.floor(sec / (3600*24))
  const hours = Math.floor((sec % (3600*24)) / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = sec % 60
  return { left, days, hours, minutes, seconds, done: left<=0 }
}
