import { Component, inject, signal } from '@angular/core';
import { DayEntry, TeaService } from '../services/tea.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-calendar-page',
  imports: [ReactiveFormsModule, Footer],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.scss',
})
export class CalendarPage {
  private tea = inject(TeaService);
  private fb = inject(FormBuilder);

  dayNumbers = [3, 7, 12, 21, 6, 13, 23, 14, 20, 10, 16, 2, 15, 1, 18, 19, 5, 8, 9, 11, 22, 4, 24, 17];
  teaNames = [
    'morning berry', // 1
    'lemon, ginger & honey', // 2
    'three mint', // 3
    'charmomile, vanilla & honey', // 4
    'supreme matcha green', // 5
    'after dinner', // 6
    'night time berry', // 7
    'peppermint & licorice', // 8
    'vanilla chai', // 9
    'three ginger' , // 10
    'turmeric, ginger & orange' , // 11
    'night time' , // 12
    'morning berry', // 13
    'lemon, ginger & honey', // 14
    'three mint', // 15
    'charmomile, vanilla & honey', // 16
    'supreme matcha green', // 17
    'after dinner', // 18
    'night time berry', // 19
    'peppermint & licorice', // 20
    'vanilla chai', // 21
    'three ginger' , // 22
    'turmeric, ginger & orange' , // 23
    'night time' , // 24
  ];

  teaColors: Array<{ start: string; end: string; text?: string }> = [
    { start: '#fd9fdeff', end: '#cc2d97ff' }, // Dag 1
    { start: '#cca31eff', end: '#f7de8fff' }, // Dag 2
    { start: '#21c997', end: '#62e4bfff' }, // Dag 3
    { start: '#254e8bff', end: '#b3cbeeff' }, // Dag 4
    { start: '#023d1cff', end: '#4dd889ff' }, // Dag 5
    { start: '#00c6ff', end: '#b4cff1ff' }, // Dag 6
    { start: '#451a1cff', end: '#de4aafff' }, // Dag 7
    { start: '#181818ff', end: '#f7cbdbff' }, // Dag 8
    { start: '#240c0cff', end: '#e6bd4cff' }, // Dag 9
    { start: '#f7741cff', end: '#ecce46ff' }, // Dag 10
    { start: '#631818ff', end: '#fca625ff' }, // Dag 11
    { start: '#0c2a36ff', end: '#c2e2f0ff' }, // Dag 12
    { start: '#fd9fdeff', end: '#cc2d97ff' }, // Dag 13
    { start: '#cca31eff', end: '#f7de8fff' }, // Dag 14
    { start: '#21c997', end: '#62e4bfff' }, // Dag 15
    { start: '#254e8bff', end: '#b3cbeeff' }, // Dag 16
    { start: '#023d1cff', end: '#4dd889ff' }, // Dag 17
    { start: '#00c6ff', end: '#b4cff1ff' }, // Dag 18
    { start: '#451a1cff', end: '#de4aafff' }, // Dag 19
    { start: '#181818ff', end: '#f7cbdbff' }, // Dag 20
    { start: '#240c0cff', end: '#e6bd4cff' }, // Dag 21
    { start: '#f7741cff', end: '#ecce46ff' }, // Dag 22
    { start: '#631818ff', end: '#fca625ff' }, // Dag 23
    { start: '#0c2a36ff', end: '#c2e2f0ff' }, // Dag 24
  ];

  selectedDay = signal<number | null>(null);

  entries = signal<DayEntry[]>([]);
  isLoading = signal<boolean>(true);

  form = this.fb.group({
    day: [null as number | null, [Validators.required]],
    teaName: [''],
    rating: [null as number | null, [Validators.min(1), Validators.max(5)]],
    notes: [''],
  });

  async ngOnInit() {
    this.isLoading.set(true);

    // subscribe til data
    this.tea.days$().subscribe((rows) => {
      this.entries.set(rows);
      this.isLoading.set(false);
    });
  }

  selectDay(d: number) {
    this.selectedDay.set(d);
    this.form.patchValue({ day: d });
    const current = this.entries().find((r) => r.day === d);
    if (current) this.form.patchValue(current);
    else this.form.patchValue({ teaName: '', rating: null, notes: '' });
  }

  async save() {
    if (this.selectedDay() === null) return;
    
    const value = this.form.getRawValue() as DayEntry;
    // Always use the tea name from the static array
    await this.tea.saveDay({ 
      ...value, 
      day: this.selectedDay()!,
      teaName: this.teaByDay(this.selectedDay()!)
    });
  }

  teaByDay(d: number): string {
    const i = d - 1;
    return this.teaNames[i] ?? 'Ukendt te';
  }

  colorByDay(d: number) {
    return this.teaColors[d - 1] ?? { start: '#2a6df6', end: '#174dcc', text: '#ffffff' };
  }

  // Helper method to calculate which row a day is in based on its position in dayNumbers array
  getRowForDay(day: number): number {
    const index = this.dayNumbers.indexOf(day);
    if (index === -1) return 0;
    return Math.floor(index / 3);
  }

  // Helper method to check if panel should show after this day
  shouldShowPanelAfterDay(dayIndex: number, day: number): boolean {
    if (this.selectedDay() === null) return false;
    
    // Show panel if:
    // 1. This is the last day in a row (every 3rd position) OR it's the last day overall
    // 2. A day is selected
    // 3. The selected day is in the same row as this day
    const isEndOfRow = (dayIndex + 1) % 3 === 0;
    const isLastDay = dayIndex === this.dayNumbers.length - 1;
    const selectedDayIndex = this.dayNumbers.indexOf(this.selectedDay()!);
    const isSelectedDayInSameRow = Math.floor(selectedDayIndex / 3) === Math.floor(dayIndex / 3);
    
    return (isEndOfRow || isLastDay) && isSelectedDayInSameRow;
  }

  // Get the entry for the selected day (if it exists)
  getSelectedDayEntry(): DayEntry | undefined {
    if (this.selectedDay() === null) return undefined;
    return this.entries().find(entry => entry.day === this.selectedDay());
  }

  // Check if the selected day has been rated
  isDayRated(): boolean {
    return this.getSelectedDayEntry() !== undefined;
  }

  // Check if a specific day has been rated (for showing tea names on buttons)
  isDayRatedByNumber(day: number): boolean {
    return this.entries().some(entry => entry.day === day);
  }

  // Get the rating for a specific day
  getRatingByDay(day: number): number | null {
    const entry = this.entries().find(entry => entry.day === day);
    return entry?.rating ?? null;
  }
}
