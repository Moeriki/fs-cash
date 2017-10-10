'use strict';

const fs = require('fs');
const path = require('path');

const delay = require('delay');
const cash = require('../');

const FILEPATH = path.join(__dirname, '../.cash');

describe('fs-cash', () => {

  let cache;

  const setup = (data) => fs.writeFileSync(FILEPATH, JSON.stringify(data));

  beforeEach(() => {
    cache = cash();
  });

  it('should get nothing from new file', async () => {
    const hello = await cache.get('hello');
    expect(hello).toBe(undefined);
  });

  it('should get value from existing file', async () => {
    setup({ hello: { value: 'world' } });
    const hello = await cache.get('hello');
    expect(hello).toBe('world');
  });

  it('should set / get value', async () => {
    await cache.set('hello', 'world');
    const hello = await cache.get('hello');
    expect(hello).toBe('world');
  });

  it('should return value on set', async () => {
    const hello = await cache.set('hello', 'world');
    expect(hello).toBe('world');
  });

  it('should set / del / get nothing', async () => {
    await cache.set('hello', 'world');
    await cache.del('hello');
    const hello = await cache.get('hello');
    expect(hello).toBe(undefined);
  });

  it('should set / expire / get nothing', async () => {
    await cache.set('hello', 'world', { ttl: 1 });
    await delay(5);
    const hello = await cache.get('hello');
    expect(hello).toBe(undefined);
  });

  it('should memoize function', async () => {
    const sum = cache.memoize(
      (num1, num2) => num1 + num2,
      (num1, num2) => `${num1}+${num2}`
    );
    expect(await sum(3, 4)).toBe(7);
    expect(await sum(3, 4)).toBe(7);
    expect(await cache.get('3+4')).toBe(7);
  });

  it('should memoize function and auto serialize', async () => {
    const sqrt = cache.memoize(Math.sqrt);
    expect(await sqrt(16)).toBe(4);
    expect(await cache.get(16)).toBe(4);
  });

  afterEach(() => cache.reset());

});
