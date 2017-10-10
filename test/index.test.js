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

  afterEach(() => cache.reset());

});
