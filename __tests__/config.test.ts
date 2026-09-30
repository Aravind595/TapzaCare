import {validateConfig} from '../src/config/validateConfig';
import {normalConfig} from '../src/config/normalConfig';

describe('validateConfig', () => {
  it('accepts valid config', () => {
    expect(validateConfig(normalConfig)).toBe(true);
  });

  it('rejects invalid config', () => {
    expect(validateConfig({})).toBe(false);
  });

  it('rejects null', () => {
    expect(validateConfig(null)).toBe(false);
  });
});