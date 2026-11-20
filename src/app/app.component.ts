import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { VisitService } from './services/visit.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
    private visits: VisitService
  ) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const user = this.auth.currentUser;
        const page = e.urlAfterRedirects;
        if (user?.role === 'member' && page !== '/login') {
          this.visits.track(user.username, page);
        }
      });
  }
}