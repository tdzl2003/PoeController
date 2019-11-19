import {
  useTriggerRange,
  useAddListener,
  KEY_DOWN,
  KEY_UP,
  KeyCode,
} from '../../lib/controller';
import { useEffect, useState } from 'react';
import { keyToggle } from 'robotjs';
import React from 'react';

export function SkillShiftButton() {
  // 左trigger映射到Ctrl键上
  const active = useTriggerRange(0.5, Infinity);

  useEffect(() => {
    if (active) {
      keyToggle('control', 'down');
      return () => {
        keyToggle('control', 'up');
      };
    }
  }, [active]);

  return null;
}

export function KeyMap({ cKey, kKey }: { cKey: KeyCode; kKey: string }) {
  const [active, setActive] = useState(false);
  useAddListener(
    KEY_DOWN,
    code => {
      if (code === cKey) {
        setActive(true);
      }
    },
    [cKey],
  );
  useAddListener(
    KEY_UP,
    code => {
      if (code === cKey) {
        setActive(false);
      }
    },
    [cKey],
  );

  useEffect(() => {
    if (active) {
      keyToggle(kKey, 'down');
      return () => {
        keyToggle(kKey, 'up');
      };
    }
  }, [active, kKey]);

  return null;
}

const PotionKeys = ['1', '2', '3', '4', '5'];

export function PotionKeyMap() {
  const [active, setActive] = useState(false);
  useAddListener(
    KEY_DOWN,
    code => {
      if (code === KeyCode.LB) {
        setActive(true);
      }
    },
    [],
  );
  useAddListener(
    KEY_UP,
    code => {
      if (code === KeyCode.LB) {
        setActive(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (active) {
      for (const key of PotionKeys) {
        keyToggle(key, 'down');
      }
      return () => {
        for (const key of PotionKeys) {
          keyToggle(key, 'up');
        }
      };
    }
  }, [active]);

  return null;
}

export function SkillKeyMap() {
  return (
    <>
      <KeyMap cKey={KeyCode.B} kKey="q" />
      <KeyMap cKey={KeyCode.A} kKey="w" />
      <KeyMap cKey={KeyCode.X} kKey="e" />
      <KeyMap cKey={KeyCode.Y} kKey="r" />
      <KeyMap cKey={KeyCode.RB} kKey="t" />
    </>
  );
}
