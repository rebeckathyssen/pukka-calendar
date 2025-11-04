import { Routes } from '@angular/router';
import { CalendarPage } from './calendar-page/calendar-page';
import { anonAuthGuard } from './services/anon-auth.guard';

export const routes: Routes = [{ path: '', canActivate: [anonAuthGuard], component: CalendarPage },
  { path: '**', redirectTo: '' }];
