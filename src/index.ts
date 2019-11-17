import './lib/controller';
import robot from 'robotjs';
import { setMode } from './lib/mode';

robot.setMouseDelay(0);
robot.setKeyboardDelay(0);
setMode('poe');
