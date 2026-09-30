import {HomeConfig} from '../types';

export const validateConfig = (value: unknown): value is HomeConfig => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const config = value as HomeConfig;

  return (
    typeof config.version === 'number' &&
    !!config.theme &&
    typeof config.theme.primary === 'string' &&
    Array.isArray(config.sections) &&
    Array.isArray(config.tabs)
  );
};