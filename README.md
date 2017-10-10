<p align="center">
  <h3 align="center">fs-cash 💰</h3>
  <p align="center">A simple fs-persisted json cache.<p>
  <p align="center">
    <a href="https://www.npmjs.com/package/fs-cash">
      <img src="https://img.shields.io/npm/v/fs-cash.svg" alt="npm version">
    </a>
    <a href="https://travis-ci.org/Moeriki/fs-cash">
      <img src="https://travis-ci.org/Moeriki/fs-cash.svg?branch=master" alt="Build Status"></img>
    </a>
    <a href="https://coveralls.io/github/Moeriki/fs-cash?branch=master">
      <img src="https://coveralls.io/repos/github/Moeriki/fs-cash/badge.svg?branch=master" alt="Coverage Status"></img>
    </a>
    <a href="https://david-dm.org/moeriki/fs-cash">
      <img src="https://david-dm.org/moeriki/fs-cash/status.svg" alt="dependencies Status"></img>
    </a>
  </p>
</p>

## Quick start

```
npm install --save fs-cache
```

```js
const cache = require('fs-cash');
```

```js
cache.set('key', 'value').then(() => {
  // saved
});
```

Everything is persisted to `process.cwd()` / `.cash`

```js
cache.get('key').then((value) => {
  // value = key
});
```

## API

### `del( key:string ) :Promise`

Delete cached value.

### `get( key:string ) :Promise<*>`

Get cached value.

### `memoize( func:function [, serialize:function ] ) :function`

Memoize a function.

```js
const sqrt = cache.memoize(Math.sqrt);
sqrt(16).then((value) => { /* 4 */ });
```

### `set( key:string, value:* [, options:object] ) :Promise`

Set cached value.

#### `options.ttl :number`

Cached value will expire after `ttl` (time to live) milliseconds.

### `reset( key:string ) :Promise`

Reset cache and delete cache file.
