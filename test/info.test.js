/**
 * Integration test for GET /info.
 * Validates the merged info object from helpers.
 */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

describe('GET /info', () => {
  it('returns app info', async () => {
    const res = await request(app).get('/info')
    expect(res.status).toBe(200)
    expect(typeof res.body.name).toBe('string')
    expect(typeof res.body.version).toBe('string')
    expect(typeof res.body.node).toBe('string')
    expect(typeof res.body.uptime).toBe('number')
  })

  it('has plausible node version & non-negative uptime', async () => {
    const res = await request(app).get('/info')
    expect(res.body.node).toMatch(/^v\d+\.\d+\.\d+/)
    expect(res.body.uptime).toBeGreaterThanOrEqual(0)
  })

  it('returns name and version from package.json', async () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
    const res = await request(app).get('/info')

    expect(res.status).toBe(200)
    expect(res.body.name).toBe(pkg.name)
    expect(res.body.version).toBe(pkg.version)
  })
})
