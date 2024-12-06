import { useCallback, useEffect, useRef } from 'react';

type SoundType =
  | 'move'
  | 'capture'
  | 'check'
  | 'castle'
  | 'promote'
  | 'gameEnd';

const SOUND_FILES = {
  move: '/sounds/move.mp3',
  capture: '/sounds/capture.mp3',
  check: '/sounds/check.mp3',
  castle: '/sounds/castle.mp3',
  promote: '/sounds/promote.mp3',
  gameEnd: '/sounds/game-end.webm',
};

export const useChessSound = () => {
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement>>(
    {} as Record<SoundType, HTMLAudioElement>
  );

  useEffect(() => {
    // Initialize audio elements
    Object.entries(SOUND_FILES).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audioRefs.current[key as SoundType] = audio;
    });

    const currentAudioRefs = audioRefs.current;
    return () => {
      // Cleanup audio elements
      Object.values(currentAudioRefs).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn('Failed to play sound:', error);
      });
    }
  }, []);

  return { playSound };
};
