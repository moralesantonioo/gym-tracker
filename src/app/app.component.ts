import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true, // 👈 Si estás usando standalone
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // 👈 corregido
})
export class AppComponent {
  title = 'gym-tracker';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login().then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
