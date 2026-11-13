import { describe, it, expect } from 'vitest';
import { getPortraitPhoto } from '@/components/Avatar';

describe('Avatar & Portrait Reveal Logic', () => {
  it('returns custom avatar if provided', () => {
    const custom = 'https://custom-domain.com/photo.jpg';
    expect(getPortraitPhoto('Aarav Sharma', custom)).toBe(custom);
  });

  it('resolves curated portrait photos for recognized personas', () => {
    const sarahPhoto = getPortraitPhoto('Sarah C');
    expect(sarahPhoto).toContain('photo-1494790108377');

    const priyaPhoto = getPortraitPhoto('Priya Nair');
    expect(priyaPhoto).toContain('photo-1573496359142');

    const aaravPhoto = getPortraitPhoto('Aarav Sharma');
    expect(aaravPhoto).toContain('photo-1507003211169');

    const rajeshPhoto = getPortraitPhoto('Rajesh Patel');
    expect(rajeshPhoto).toContain('photo-1500648767791');
  });

  it('provides reliable fallback photo for unmapped names', () => {
    const fallbackPhoto = getPortraitPhoto('New Random User');
    expect(fallbackPhoto).toBeDefined();
    expect(typeof fallbackPhoto).toBe('string');
  });
});

