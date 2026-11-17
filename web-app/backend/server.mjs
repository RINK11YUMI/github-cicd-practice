import express from 'express'

const app = express()
app.use(express.json())

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', time: new Date().toISOString() })
})

// 简单计算接口：用于演示参数校验与测试
app.post('/api/calc', (req, res) => {
  const { a, b, op } = req.body ?? {}
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(422).json({ error: 'a、b 必须是数字' })
  }
  switch (op) {
    case 'add': return res.json({ result: a + b })
    case 'sub': return res.json({ result: a - b })
    case 'mul': return res.json({ result: a * b })
    default: return res.status(422).json({ error: 'op 仅支持 add/sub/mul' })
  }
})

// 直接运行时才监听；被测试导入时不监听
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`backend listening on ${port}`))
}

export default app
