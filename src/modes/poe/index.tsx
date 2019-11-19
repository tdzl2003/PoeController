import React, { useState } from 'react';
import {
  useAddListener,
  DATA,
  LEFT_JOY_STICK,
  RIGHT_JOY_STICK,
  TRIGGER,
} from '../../lib/controller';
import { Text, Color } from 'ink';
import StickMovement from './StickMovement';
import FreeMouse, { MouseTrigger } from './FreeMouse';

function DataPreview() {
  const [text, setText] = React.useState('no data');
  useAddListener(DATA, buf => {
    setText(buf.toString('hex').replace(/\w{2}/g, v => `${v},`));
  });

  return <Text>Data: {text}</Text>;
}

function TriggerPreview() {
  const [value, setValue] = React.useState(0);
  useAddListener(TRIGGER, v => {
    setValue(v);
  });

  return <Text>Trigger: {value}</Text>;
}

function StickState({ type }: { type: 'left' | 'right' }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useAddListener(type === 'left' ? LEFT_JOY_STICK : RIGHT_JOY_STICK, (x, y) => {
    setX(x);
    setY(y);
  });
  const r = Math.sqrt(x * x + y * y);
  const active = r > 0.2;

  return (
    <Text>
      {type} stick:{' '}
      <Color green bgBlackBright={active}>
        {x.toFixed(4)}, {y.toFixed(4)}
      </Color>
    </Text>
  );
}

export default function Poe() {
  return (
    <React.Fragment>
      <DataPreview />
      <StickState type="left" />
      <StickState type="right" />
      <TriggerPreview />
      <FreeMouse />
      <StickMovement />
      <MouseTrigger />
    </React.Fragment>
  );
}
