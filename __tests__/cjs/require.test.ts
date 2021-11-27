import path from 'path'
import { requireFromString } from '../../src/index'

it('should work with `module.exports`', () => {
  const res = requireFromString("module.exports = 'hi'")
  expect(res).toBe('hi')
})

it('should work with exports shortcut', () => {
  const res = requireFromString("exports.hello = 'hello'\nexports.hi = 'hi'")
  expect(res.hello).toBe('hello')
  expect(res.hi).toBe('hi')
})

it('should work with relative path import', () => {
  const modulePath = './fixtures/defaultExport.js'
  const res = requireFromString(`module.exports = require('${modulePath}')`)
  expect(res).toBe('hi')
})

it('should resolve correctly if option `dirPath` is provided', () => {
  const modulePath = './cjs/fixtures/namedExport.js'
  const res = requireFromString(`exports.greet = require('${modulePath}').greet`, {
    dirname: path.dirname(__dirname)
  })
  expect(res.greet).toBe('hi')
})

it('should work with absolute path import', () => {
  const modulePath = path.join(__dirname, 'fixtures/defaultExport.js')
  const res = requireFromString(`module.exports = require('${modulePath}')`)
  expect(res).toBe('hi')
})

it('should work with require external module', () => {
  const code = `const { transformSync } = require('esbuild')
const { code } = transformSync('enum Greet { Hi }', { loader: 'ts' })
exports.greet = code
`
  const res = requireFromString(code)
  expect(res.greet).toMatchInlineSnapshot(`
    "var Greet = /* @__PURE__ */ ((Greet2) => {
      Greet2[Greet2[\\"Hi\\"] = 0] = \\"Hi\\";
      return Greet2;
    })(Greet || {});
    "
  `)
})

it('should work with provided globals', () => {
  const res = requireFromString('module.exports = process.cwd()', {
    globals: { process }
  })
  expect(res).toBe(process.cwd())
})
