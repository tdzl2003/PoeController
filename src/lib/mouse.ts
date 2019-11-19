import { useEffect } from 'react';
import robot from 'robotjs';

export type MouseButtonType = 'left' | 'right' | 'middle';

export function useLeftBtnDown(
  down: boolean = true,
  btn: MouseButtonType = 'left',
) {
  useEffect(() => {
    if (down) {
      robot.mouseToggle('down', btn);
      return () => {
        robot.mouseToggle('up', btn);
      };
    }
  }, [down, down && btn]);
}
