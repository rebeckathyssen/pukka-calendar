// anon-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth, signInAnonymously } from '@angular/fire/auth';

export const anonAuthGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  return true;
};
