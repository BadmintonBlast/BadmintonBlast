import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SlotSelectionService {
  private selectedSlotsSource = new BehaviorSubject<any[]>([]);
  private timeRangesSource = new BehaviorSubject<{
    [key: string]: { [key: string]: number };
  }>({});
  private totalHourSelectionsSource = new BehaviorSubject<number>(0);
  private totalAmountSource = new BehaviorSubject<number>(0);
  private date = new BehaviorSubject<string>('');
  selectedSlots$ = this.selectedSlotsSource.asObservable();
  timeRanges$ = this.timeRangesSource.asObservable();
  totalHourSelections$ = this.totalHourSelectionsSource.asObservable();
  totalAmount$ = this.totalAmountSource.asObservable();
  date$ = this.date.asObservable();

  updateSelectedSlots(slots: any[]) {
    this.selectedSlotsSource.next(slots);
  }

  updateTimeRanges(ranges: { [key: string]: { [key: string]: number } }) {
    this.timeRangesSource.next(ranges);
  }

  updateTotalHourSelections(hours: number) {
    this.totalHourSelectionsSource.next(hours);
  }

  updateTotalAmount(amount: number) {
    this.totalAmountSource.next(amount);
  }
  updatedate(date: string) {
    this.date.next(date);
  }
}
