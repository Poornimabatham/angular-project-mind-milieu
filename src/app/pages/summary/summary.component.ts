import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VisitService, VisitSummary } from '../../services/visit.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [DatePipe, RouterLink],
 templateUrl:'summary.component.html'
})
export class SummaryComponent {
  summary: VisitSummary[] = [];

  constructor(public auth: AuthService, private visits: VisitService) {
    this.summary = this.visits.getSummary();
  }
}