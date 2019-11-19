import React from 'react';
import { useAddListener, LEFT_JOY_STICK, DATA } from '../../lib/controller';
import { Text, Color } from 'ink';

function StickMovement() {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  useAddListener(LEFT_JOY_STICK, (x, y) => {
    setX(x);
    setY(y);
  });
  const r = x * x + y * y;
  const active = r > 0.16;

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
