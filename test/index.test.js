'use strict';

const fs = require('fs');
const path = require('path');

const delay = require('delay');
const cash = require('../');

const FILEPATH = path.join(__dirname, '../.cash');

process.env.NODE_ENV = 'production'; // default dev mode to false

describe('fs-cash', () => {

  let cache;

  const read = () => fs.readFileSync(FILEPATH, { encoding: 'utf8' });
  const write = (data) => fs.writeFileSync(FILEPATH, JSON.stringify(data));

  beforeEach(() => {
    cache = cash();
  });

  it('should get nothing from new file', async () => {
    const hello = await cache.get('hello');
    expect(hello).toBe(undefined);
  });

  it('should get value from existing file', async () => {
    write({ hello: { value: 'world' } });
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
    const sqrt = cache.memoize(Math.sqrt);
    expect(await sqrt(16)).toBe(4);
    expect(await cache.get(16)).toBe(4);
  });

  it('should memoize function with custom serialize', async () => {
    const sum = cache.memoize(
      (num1, num2) => num1 + num2,
      { serialize: (num1, num2) => `${num1}+${num2}` }
    );
    expect(await sum(3, 4)).toBe(7);
    expect(await sum(3, 4)).toBe(7);
    expect(await cache.get('3+4')).toBe(7);
  });

  it('should memoize function with ttl', async () => {
    const sqrt = cache.memoize(Math.sqrt, { ttl: 1 });
    expect(await sqrt(16)).toBe(4);
    expect(await cache.get(16)).toBe(4);
    await delay(5);
    expect(await cache.get(16)).toBe(undefined);
  });

  it('should memoize function with dynamic ttl', async () => {
    const sqrt = cache.memoize(Math.sqrt, {
      ttl: (result) => result,
    });
    expect(await sqrt(10000)).toBe(100); // tll will be 100
    expect(await sqrt(4)).toBe(2); // tll will be 2
    await delay(5);
    expect(await cache.get(10000)).toBe(100);
    expect(await cache.get(4)).toBe(undefined);
  });

  describe('dev', () => {

    it('should write ISO string expires', async () => {
      process.env.NODE_ENV = 'development';
      cache = cash();
      await cache.set('hello', 'world', { ttl: 1 });
      const datastore = JSON.parse(read());
      expect(datastore).toEqual({
        hello: {
          expires: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
          value: 'world',
        },
      });
    });

    it('should format JSON', async () => {
      cache = cash({ dev: true });
      await cache.set('hello', 'world');
      const rawDatastore = fs.readFileSync(FILEPATH, { encoding: 'utf8' });
      expect(rawDatastore).toMatchSnapshot();
    });

  });

  afterEach(() => cache.reset());

});
