import path from 'path'
import { fileURLToPath } from 'url'
import { requireFromString } from '../../src/index'

const dirname = path.dirname(fileURLToPath(new URL(import.meta.url)))

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
  const modulePath = '../cjs/fixtures/defaultExport.js'
  const res = requireFromString(`module.exports = require('${modulePath}')`)
  expect(res).toBe('hi')
})

it('should resolve correctly if option `dirPath` is provided', () => {
  const modulePath = './cjs/fixtures/namedExport.js'
  const res = requireFromString(`exports.greet = require('${modulePath}').greet`, {
    dirname: path.dirname(dirname)
  })
  expect(res.greet).toBe('hi')
})

it('should work with absolute path import', () => {
  const modulePath = path.join(dirname, '../cjs/fixtures/defaultExport.js')
  const res = requireFromString(`module.exports = require('${modulePath}')`)
  expect(res).toBe('hi')
})

it('should work with require external module', () => {
  const code = `const { transformSync } = require('esbuild')
const { code } = transformSync('enum Greet { Hi }', { loader: 'ts' })
exports.greet = code
`
  const transformedCode = `var Greet;
(function(Greet2) {
  Greet2[Greet2["Hi"] = 0] = "Hi";
})(Greet || (Greet = {}));
`
  const res = requireFromString(code)
  expect(res.greet).toBe(transformedCode)
})

it('should be able to use dynamic import', async () => {
  expect.assertions(1)
  const modulePath = './fixtures/defaultExport.js'
  const res = requireFromString(`module.exports = import('${modulePath}')`)
  expect((await res).default).toBe('hi')
})

it('should work with provided globals', () => {
  const res = requireFromString('exports.cwd = process.cwd()', {
    globals: { process }
  })
  expect(res.cwd).toBe(process.cwd())
})
