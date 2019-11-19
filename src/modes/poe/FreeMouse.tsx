import React, { useEffect, useState, useRef } from 'react';
import { useAddListener, RIGHT_JOY_STICK, TRIGGER } from '../../lib/controller';
import { getMousePos, moveMouse, getScreenSize } from 'robotjs';
import { useLeftBtnDown } from '../../lib/mouse';

const MOVE_SPEED = 0.05 * getScreenSize().height;

export function MouseTrigger() {
  const [mouseDown, setMouseDown] = React.useState(false);
  const mouseRef = useRef(mouseDown);

  useAddListener(
    TRIGGER,
    v => {
      const state = v < -0.5;
      if (mouseRef.current !== state) {
        mouseRef.current = state;
        setMouseDown(state);
      }
    },
    [],
  );
  useLeftBtnDown(mouseDown);

  return null;
}

export default function FreeMouse() {
  // 移动处理
  const [active, setActive] = React.useState(false);

  const vxRef = useRef(0);
  const vyRef = useRef(0);
  useAddListener(RIGHT_JOY_STICK, (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const active = r > 0.2;
    setActive(active);

    vxRef.current = x * r * MOVE_SPEED;
    vyRef.current = y * r * MOVE_SPEED;
  });

  const dxRef = useRef(0);
  const dyRef = useRef(0);

  useEffect(() => {
    if (active) {
      const timer = setInterval(() => {
        dxRef.current += vxRef.current;
        dyRef.current += vyRef.current;

        const dx = Math.floor(dxRef.current);
        const dy = Math.floor(dyRef.current);
        dxRef.current -= dx;
        dyRef.current -= dy;

        const { x, y } = getMousePos();
        moveMouse(x + dx, y + dy);
      }, 16);
      return () => {
        clearInterval(timer);
      };
    }
  }, [active]);

  return null;
}
