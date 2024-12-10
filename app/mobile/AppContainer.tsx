import { Frame } from '@nativescript/core';
import { MainScreen } from './screens/MainScreen';

export function AppContainer() {
  const frame = new Frame();
  frame.navigate({
    create: () => new MainScreen()
  });
  return frame;
}