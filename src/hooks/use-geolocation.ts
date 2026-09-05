'use client';

import { useCallback, useState } from 'react';

export interface Coords {
  lat: number;
  lng: number;
}

type GeoState = 'idle' | 'prompting' | 'granted' | 'denied' | 'unavailable';

/**
 * On-demand geolocation. We never request location automatically — only when
 * the user takes an action that needs it (e.g. "find a clinic"), so no
 * surprise permission prompt appears on page load.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [state, setState] = useState<GeoState>('idle');

  const request = useCallback((): Promise<Coords | null> => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState('unavailable');
      return Promise.resolve(null);
    }
    // Return a cached fix immediately if we already have one.
    if (coords) return Promise.resolve(coords);

    setState('prompting');
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          setState('granted');
          resolve(c);
        },
        () => {
          setState('denied');
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
      );
    });
  }, [coords]);

  return { coords, state, request };
}
