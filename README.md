<h1 align="center">module-from-string</h1>

<p align="center">
> Load module from string, require and import.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/module-from-string">
<img alt="npm" src="https://img.shields.io/npm/v/module-from-string">
</a>
<a href="https://github.com/exuanbo/module-from-string/actions?query=workflow">
<img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/exuanbo/module-from-string/Node.js%20CI/main">
</a>
<a href="https://liberamanifesto.com">
<img alt="The Libera Manifesto" src="https://img.shields.io/badge/libera-manifesto-lightgrey.svg">
</a>
</p>

## Install

```sh
npm install module-from-string
```

## Usage

```js
const { requireFromString, importFromString } = require('module-from-string')

requireFromString("module.exports = 'hi'") // => 'hi'
requireFromString("exports.salute = 'hi'") // => { salute: 'hi' }

;(async () => {
  await importFromString({ code: "export default 'hi'" }) // => { default: 'hi' }
  await importFromString({ code: "export const salute = 'hi'" }) // => { salute: 'hi' }
})()
```

## API

```ts
import { TransformOptions } from 'esbuild'

declare const requireFromString: (
  code: string,
  globals?: Record<string, unknown>
) => any

interface ImprotOptions {
  code: string
  transformOptions?: TransformOptions
  globals?: Record<string, unknown>
}
declare const importFromString: ({
  code,
  transformOptions,
  globals
}: ImprotOptions) => Promise<any>
declare const importFromStringSync: ({
  code,
  transformOptions,
  globals
}: ImprotOptions) => any

export { importFromString, importFromStringSync, requireFromString }
```

### globals?

Underneath the hood, `module-from-string` uses Node.js built-in `vm` module to execute code.

```ts
const _module = new Module(String(new Date().valueOf()))

const context = vm.createContext({
  exports: _module.exports,
  module: _module,
  require,
  ...globals
})

vm.runInContext(code, context)
```

By default, only above variables are passed into the `contextObject`. In order to use other global objects you need to add them to option `globals`.

```js
requireFromString('module.exports = process.cwd()', { process })

importFromStringSync({
  code: 'export default process.cwd()',
  globals: { process }
})
```

### transformOptions?

As bundled `index.d.ts` above, `importFromString` uses esbuild to transform ES Module syntax to CommonJS. So it can do much more by providing transform options to esbuild. See [esbuild Transform API](https://esbuild.github.io/api/#transform-api) for documentation.

```js
const { salute } = importFromStringSync({
  code: "export const salute: string = () => 'hi'",
  transformOptions: { loader: 'ts' }
})

salute() // => 'hi'
```

## License

[MIT License](https://github.com/exuanbo/module-from-string/blob/main/LICENSE) © 2020 [Exuanbo](https://github.com/exuanbo)
