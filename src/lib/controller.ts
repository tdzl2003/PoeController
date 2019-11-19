import { EventEmitter } from 'fbemitter';
import React, { DependencyList, useRef } from 'react';
const HID = require('node-hid');

function createHIDController() {
  // Searches for Xbox 360 Controller, Xbox 360 Wifi Controller, Xbox One Controller and Xbox 360 Wireless Receiver
  // http://www.linux-usb.org/usb.ids
  const VID = 0x45e; // Microsoft
  const PID = [0x28e, 0x28f, 0x2d1, 0x719, 0x2a1];
  let lastError = null;
  for (var i = 0; i < PID.length; i++) {
    try {
      return new HID.HID(VID, PID[i]);
    } catch (e) {
      //console.warn(e);
      lastError = e;
    }
  }
  throw lastError;
}

const controller = createHIDController();

console.log('Controller created successfully.');

function translateJoyStickAxis(x: number) {
  if (x <= 128) {
    return (x - 128) / 128;
  }
  return (x - 128) / 127;
}

// 事件定义
export const DATA = 'data';
export const LEFT_JOY_STICK = 'leftJoyStick';
export const RIGHT_JOY_STICK = 'rightJoyStick';
export const TRIGGER = 'trigger';
export const KEY_DOWN = 'keyDown';
export const KEY_UP = 'keyUp';

export enum KeyCode {
  Y = 8,
  A = 1,
  X = 4,
  B = 2,
  LB = 16,
  RB = 32,
  SELECT = 64,
  START = 128,
}

const emitter = new EventEmitter();
export default emitter;

let lastData: Buffer;
let currTriggerPos: number = 0;
let currKeyState: number = 0;

export function isKeyDown(key: KeyCode) {
  return (currKeyState & key) !== 0;
}

function onData(data: Buffer) {
  emitter.emit(DATA, data);
  currKeyState = data[10];
  currTriggerPos = translateJoyStickAxis(data[9]);

  if (!lastData || data[1] !== lastData[1] || data[3] !== lastData[3]) {
    emitter.emit(
      LEFT_JOY_STICK,
      translateJoyStickAxis(data[1]),
      translateJoyStickAxis(data[3]),
    );
  }
  if (!lastData || data[5] !== lastData[5] || data[7] !== lastData[7]) {
    emitter.emit(
      RIGHT_JOY_STICK,
      translateJoyStickAxis(data[5]),
      translateJoyStickAxis(data[7]),
    );
  }
  if (!lastData || data[9] !== lastData[9]) {
    emitter.emit(TRIGGER, currTriggerPos);
  }

  for (let v = 0; v < 7; v++) {
    const k = (1 << v) as KeyCode;
    if (!lastData || (data[10] & k) !== (lastData[10] & k)) {
      const eventName = data[10] & k ? KEY_DOWN : KEY_UP;
      emitter.emit(eventName, k);
    }
  }

  lastData = data;
}

controller.addListener('data', onData);

export function useAddListener(
  eventName: typeof DATA,
  handler: (buf: Buffer) => void,
  deps?: DependencyList,
): void;
export function useAddListener(
  eventName: typeof LEFT_JOY_STICK | typeof RIGHT_JOY_STICK,
  handler: (x: number, y: number) => void,
  deps?: DependencyList,
): void;
export function useAddListener(
  eventName: typeof TRIGGER,
  handler: (v: number) => void,
  deps?: DependencyList,
): void;
export function useAddListener(
  eventName: typeof KEY_DOWN | typeof KEY_UP,
  handler: (v: KeyCode) => void,
  deps?: DependencyList,
): void;
export function useAddListener(
  eventName: string,
  listener: Function,
  deps?: DependencyList,
) {
  React.useEffect(
    () => {
      const sub = emitter.addListener(eventName, listener);
      return () => sub.remove();
    },
    deps ? [eventName, ...deps] : [eventName],
  );
}

export function useTriggerRange(min: number, max: number) {
  const [active, setActive] = React.useState(() => {
    return currTriggerPos >= min && currTriggerPos <= max;
  });
  const activeRef = useRef(active);

  useAddListener(
    TRIGGER,
    v => {
      const state = v >= min && v <= max;
      if (activeRef.current !== state) {
        activeRef.current = state;
        setActive(state);
      }
    },
    [min, max],
  );
  return active;
}
