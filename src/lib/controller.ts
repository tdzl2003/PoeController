import { handleLeftJoyStick } from './mode';

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

function onData(data: Buffer) {
  handleLeftJoyStick(
    translateJoyStickAxis(data[1]),
    translateJoyStickAxis(data[2]),
  );
}

controller.addListener('data', onData);
