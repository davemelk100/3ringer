import { EventData, Page } from '@nativescript/core';
import { BaseNavigationContainer } from '@react-navigation/native';
import { ScheduleScreen } from './ScheduleScreen';

export function MainScreen() {
  const page = new Page();
  
  page.on(Page.loadedEvent, (args: EventData) => {
    const page = args.object as Page;
    page.content = (
      <BaseNavigationContainer>
        <ScheduleScreen />
      </BaseNavigationContainer>
    );
  });
  
  return page;
}