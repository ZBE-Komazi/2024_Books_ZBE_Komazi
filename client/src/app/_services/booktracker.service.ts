import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookTrackerService {
  private trackedBookIds: Set<number> = new Set<number>();

  trackBookId(id: number) {
    this.trackedBookIds.add(id);
  }

  getBookIds(): number[] {
    return Array.from(this.trackedBookIds);
  }
}
