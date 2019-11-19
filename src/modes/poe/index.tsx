import React from 'react';
import { useAddListener, DATA } from '../../lib/controller';
import { Text } from 'ink';
import StickMovement from './movement';

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
