import React, { useEffect } from 'react';
import { useAddListener, LEFT_JOY_STICK, DATA } from '../../lib/controller';
import { Text, Color } from 'ink';
import { useLeftBtnDown } from '../../lib/mouse';
import { getScreenSize, dragMouse } from 'robotjs';

const MOVE_RADIUS = 0.1;

function StickMovement() {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  useAddListener(LEFT_JOY_STICK, (x, y) => {
    setX(x);
    setY(y);
  });
  const r = Math.sqrt(x * x + y * y);
  const active = r > 0.4;

  useLeftBtnDown(active);

  useEffect(() => {
    if (active) {
      const { width, height } = getScreenSize();
      const radius = MOVE_RADIUS * height;
      const mouseX = width * 0.5 + (radius * x) / r;
      const mouseY = height * 0.44 + (radius * y) / r;
      dragMouse(mouseX, mouseY);
    }
  }, [active && x, active && y]);

  return (
    <Text>
      Left stick:{' '}
      <Color green bgYellow={active}>
        {x.toFixed(4)}, {y.toFixed(4)}
      </Color>
      {'\t'}
      Radius: {r}
    </Text>
  );
}

function DataPreview() {
  const [text, setText] = React.useState('no data');
  useAddListener(DATA, buf => {
    setText(buf.toString('hex').replace(/\w{2}/g, v => `${v},`));
  });

  return <Text>Data: {text}</Text>;
}

export default function Poe() {
  return (
    <React.Fragment>
      <DataPreview />
      <StickMovement />
    </React.Fragment>
  );
}
