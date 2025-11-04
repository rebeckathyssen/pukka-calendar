import { Injectable, inject } from '@angular/core';
import { Auth, signInAnonymously, user } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, query, orderBy } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { filter, switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DayEntry {
  day: number; // 1..24
  teaName?: string;
  notes?: string;
  rating?: number; // 1..5
  tastedOn?: string; // ISO dato
}

@Injectable({ providedIn: 'root' })
export class TeaService {
  private auth = inject(Auth);
  private db = inject(Firestore);

  // Kald denne på app-start
  async ensureAnonLogin() {
    if (!this.auth.currentUser) {
      await signInAnonymously(this.auth);
    }
  }

  user$ = user(this.auth);

  days$(): Observable<DayEntry[]> {
    return this.user$.pipe(
      filter((u): u is NonNullable<typeof u> => !!u),
      switchMap((u) => {
        const col = collection(this.db, 'users', u.uid, 'calendar');
        return collectionData(query(col, orderBy('day'))) as Observable<DayEntry[]>;
      }),
      // Sørg for at vi har entries for alle 24 dage i UI’et (valgfrit)
      map((days) => days.sort((a, b) => a.day - b.day))
    );
  }

  async saveDay(entry: DayEntry) {
    if (!this.auth.currentUser) await this.ensureAnonLogin();
    const uid = this.auth.currentUser!.uid;
    const ref = doc(this.db, 'users', uid, 'calendar', String(entry.day));
    await setDoc(ref, entry, { merge: true });
  }
}
