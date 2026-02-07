import '@testing-library/jest-dom';

vi.mock('*.svg', () => ({
  default: 'svg-mock',
}));
