import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, query, orderBy } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { filter, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DayEntry {
  day: number;
  teaName?: string;
  notes?: string;
  rating?: number;
}

@Injectable({ providedIn: 'root' })
export class TeaService {
  private auth = inject(Auth);
  private db = inject(Firestore);

  private user$ = authState(this.auth);

  days$(): Observable<DayEntry[]> {
    return this.user$.pipe(
      filter((u): u is NonNullable<typeof u> => !!u),
      switchMap((u) => {
        const col = collection(this.db, 'users', u.uid, 'calendar');
        return collectionData(query(col, orderBy('day'))) as Observable<DayEntry[]>;
      })
    );
  }

 async saveDay(entry: DayEntry) {
    const u = this.auth.currentUser;
    if (!u) {
      throw new Error('Not authenticated');
    }
    const ref = doc(this.db, 'users', u.uid, 'calendar', String(entry.day));
    await setDoc(ref, { ...entry, day: entry.day }, { merge: true });
  }
}
