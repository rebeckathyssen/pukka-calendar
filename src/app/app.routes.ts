import { Routes } from '@angular/router';
import { CalendarPage } from './calendar-page/calendar-page';

export const routes: Routes = [{ path: '', component: CalendarPage },
  { path: '**', redirectTo: '' }];
