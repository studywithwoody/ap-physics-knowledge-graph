/// <reference types="node" />
import assert from 'node:assert/strict'
import { renderLatex, renderMathHtml } from '../lib/mathText'

const kinetic = renderMathHtml('f_k = μk F_N')
assert.ok(kinetic.includes('katex'))
assert.equal(kinetic.includes('katex-error'), false)

const stat = renderMathHtml('f_s,max = μs F_N')
assert.ok(stat.includes('katex'))
assert.equal(stat.includes('katex-error'), false)

assert.equal(renderMathHtml('prefixes scale SI units'), 'prefixes scale SI units')
assert.equal(renderMathHtml('average velocity = displacement / time').includes('katex'), false)
assert.equal(renderMathHtml('SI/CGS/BE systems').includes('katex'), false)

const mixed = renderMathHtml('with magnitude f_k = μ_k F_N.')
assert.ok(mixed.startsWith('with magnitude '))
assert.ok(mixed.includes('katex'))
assert.ok(mixed.endsWith('.'))

const delimited = renderMathHtml('energy $E=mc^2$ now')
assert.ok(delimited.includes('katex'))
assert.ok(delimited.startsWith('energy '))
assert.ok(delimited.endsWith(' now'))

const broken = renderMathHtml('see $\\frac{$ next')
assert.equal(broken.includes('katex-error'), false)
assert.ok(broken.includes('$'))

const display = renderLatex('\\frac{a}{b}', true)
assert.ok(display?.includes('katex-display'))
assert.equal(renderLatex('\\frac{', true), null)

assert.ok(renderMathHtml('MR = MC').includes('katex'))
assert.ok(renderMathHtml('P = MC').includes('katex'))
assert.equal(
  renderMathHtml('The demand curve slopes downward because of diminishing marginal utility.').includes('katex'),
  false,
)
const price = renderMathHtml('so $4.99 seems much cheaper than $5.00.')
assert.equal(price.includes('katex'), false)
assert.ok(price.includes('$4.99'))
assert.ok(price.includes('$5.00'))
const ie = renderMathHtml('produce at P = MC = ATC, i.e., at the efficient scale')
assert.ok(ie.includes('katex'))
assert.ok(ie.includes('i.e.'))
const too = renderMathHtml('P > MC ⇒ too little output')
assert.ok(too.includes('katex'))
assert.ok(too.includes('too little output'))
const elasticity = renderLatex(
  '\\text{Price Elasticity of Demand}=\\frac{\\%\\text{ change in quantity demanded}}{\\%\\text{ change in price}}',
  true,
)
assert.ok(elasticity?.includes('katex-display'))

console.log('math text tests passed')
