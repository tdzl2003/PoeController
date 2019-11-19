import React, { useEffect, useState } from 'react';
import { useAddListener, LEFT_JOY_STICK } from '../../lib/controller';
import { useLeftBtnDown } from '../../lib/mouse';
import { getScreenSize, dragMouse } from 'robotjs';

const MOVE_RADIUS = 0.1;

export default function StickMovement() {
  const [active, setActive] = React.useState(false);

  useAddListener(LEFT_JOY_STICK, (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const active = r > 0.2;
    setActive(active);

    if (active) {
      const { width, height } = getScreenSize();
      const radius = MOVE_RADIUS * height;
      const mouseX = width * 0.5 + radius * x;
      const mouseY = height * 0.44 + radius * y;
      dragMouse(mouseX, mouseY);
    }
  });
  useLeftBtnDown(active);

  return null;
}
