import PoeMode from '../modes/poe';

export interface Mode {
  handleLeftJoyStick?(x: number, y: number): void;
}

const map: { [key: string]: Mode } = {
  poe: PoeMode,
};
export default map;

let curMode: Mode = {};

export function setMode(mode: Mode | string) {
  if (typeof mode === 'string') {
    mode = map[mode];
  }
  curMode = mode;
}

export function handleLeftJoyStick(x: number, y: number) {
  if (curMode.handleLeftJoyStick) {
    curMode.handleLeftJoyStick(x, y);
  }
}
