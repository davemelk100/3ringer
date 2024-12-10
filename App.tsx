import { Application } from '@nativescript/core';
import { AppContainer } from './app/mobile/AppContainer';

Application.run({ create: () => new AppContainer() });