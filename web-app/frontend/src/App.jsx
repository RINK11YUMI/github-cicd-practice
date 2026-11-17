import { useState } from 'react'

export default function App() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(3)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function calc(op) {
    setError('')
    try {
      const r = await fetch('/api/calc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ a: Number(a), b: Number(b), op })
      })
      const d = await r.json()
      if (!r.ok) setError(d.error || '请求失败')
      else setResult(d.result)
    } catch {
      setError('无法连接后端')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>CI/CD 实验三 · React + Node</h1>
      <p>前后端分离工程：React (Vite) + Express，CI 流水线自动测试与构建。</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={a} onChange={e => setA(e.target.value)} style={{ width: 70 }} />
        <input value={b} onChange={e => setB(e.target.value)} style={{ width: 70 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => calc('add')}>加</button>
        <button onClick={() => calc('sub')}>减</button>
        <button onClick={() => calc('mul')}>乘</button>
      </div>
      {result !== null && <p>结果：<b>{result}</b></p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  )
}
