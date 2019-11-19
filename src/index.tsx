import robot from 'robotjs';
import { render } from 'ink';
import React from 'react';
import Poe from './modes/poe';

robot.setMouseDelay(0);
robot.setKeyboardDelay(0);

function App() {
  return <Poe />;
}

render(<App />);
