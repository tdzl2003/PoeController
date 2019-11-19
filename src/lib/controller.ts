import { EventEmitter } from 'fbemitter';
import React, { DependencyList } from 'react';
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

const emitter = new EventEmitter();
export default emitter;

function onData(data: Buffer) {
  emitter.emit(DATA, data);
  emitter.emit(
    LEFT_JOY_STICK,
    translateJoyStickAxis(data[1]),
    translateJoyStickAxis(data[3]),
  );
}

controller.addListener('data', onData);

export function useAddListener(
  eventName: typeof DATA,
  handler: (buf: Buffer) => void,
  deps?: DependencyList,
): void;
export function useAddListener(
  eventName: typeof LEFT_JOY_STICK,
  handler: (x: number, y: number) => void,
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
