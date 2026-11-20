import { Injectable } from '@angular/core';
import { Visit } from '../models/model';

export interface VisitSummary {
  username: string;
  count: number;
  times: string[];
}

@Injectable({ providedIn: 'root' })
export class VisitService {
  private readonly KEY = 'visits';

  getAll(): Visit[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  track(username: string, page: string): void {
    const visits = this.getAll();
    visits.push({ username, page, time: new Date().toISOString() });
    localStorage.setItem(this.KEY, JSON.stringify(visits));
  }

  // Group visits by user -> count + list of times
  getSummary(): VisitSummary[] {
    const map = new Map<string, VisitSummary>();
    for (const v of this.getAll()) {
      if (!map.has(v.username)) {
        map.set(v.username, { username: v.username, count: 0, times: [] });
      }
      const item = map.get(v.username)!;
      item.count++;
      item.times.push(v.time);
    }
    return Array.from(map.values());
  }
}