import '@testing-library/jest-dom';
import { vi } from 'vitest';

// JSDOM Stubs to prevent console stderr noise during test runs
if (typeof window !== 'undefined') {
  window.focus = vi.fn();
  window.print = vi.fn();
  window.scrollTo = vi.fn();
}

