import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabTitleMarquee } from '@/hooks/useTabTitleMarquee';

describe('useTabTitleMarquee hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.title = 'Initial Title';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('scrolls the tab title smoothly on each timer tick', () => {
    renderHook(() => useTabTitleMarquee('VedaFlow', { speed: 200, separator: ' - ' }));

    // Advance timer by 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // fullText is 'VedaFlow - '
    // After 1 tick (slice(0) -> slice(1) + slice(0,1)): 'edaFlow - V'
    expect(document.title).toBe('edaFlow - V');

    // Advance timer another 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(document.title).toBe('daFlow - Ve');
  });

  it('restores the base title when unmounted', () => {
    const { unmount } = renderHook(() => useTabTitleMarquee('VedaFlow - Platform'));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    unmount();
    expect(document.title).toBe('VedaFlow - Platform');
  });
});

