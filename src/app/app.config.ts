import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'pukka-calendar',
        appId: '1:565371385387:web:7b0e5674f9b81943f69c6e',
        storageBucket: 'pukka-calendar.firebasestorage.app',
        apiKey: 'AIzaSyAC0ckyIBpLEqVa1HjsRl7kkRN5rvq_4CM',
        authDomain: 'pukka-calendar.firebaseapp.com',
        messagingSenderId: '565371385387',
        measurementId: 'G-M2PHEETB9C',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
