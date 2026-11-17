import { test } from 'node:test'
import assert from 'node:assert/strict'

// 先标记测试环境再导入，避免 server.mjs 自行监听 3000 端口
process.env.NODE_ENV = 'test'
const { default: app } = await import('./server.mjs')

const server = app.listen(0, '127.0.0.1')
await new Promise(resolve => server.once('listening', resolve))
const base = `http://127.0.0.1:${server.address().port}`

test('GET /api/health 返回 ok', async () => {
  const r = await fetch(`${base}/api/health`)
  assert.equal(r.status, 200)
  const d = await r.json()
  assert.equal(d.status, 'ok')
})

test('POST /api/calc 加法正确', async () => {
  const r = await fetch(`${base}/api/calc`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ a: 2, b: 3, op: 'add' })
  })
  assert.equal(r.status, 200)
  assert.equal((await r.json()).result, 5)
})

test('POST /api/calc 非数字参数返回 422', async () => {
  const r = await fetch(`${base}/api/calc`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ a: 'x', b: 3, op: 'add' })
  })
  assert.equal(r.status, 422)
})

test('POST /api/calc 未知运算符返回 422', async () => {
  const r = await fetch(`${base}/api/calc`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ a: 1, b: 2, op: 'pow' })
  })
  assert.equal(r.status, 422)
})

test.after?.(() => server.close())
process.on('exit', () => server.close())
