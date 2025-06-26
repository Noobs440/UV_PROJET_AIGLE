import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponentAdmin {
  constructor(private router: Router) {}
   goBack() {
    this.router.navigate(['/admin']);
  }
}
