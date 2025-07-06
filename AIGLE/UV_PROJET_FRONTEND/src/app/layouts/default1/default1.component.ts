import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default1',
  templateUrl: './default1.component.html',
  styleUrl: './default1.component.css'
})
export class Default1Component {
  showNav: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
    this.checkRoute(); // Initial check
  }

  checkRoute(): void {
    const currentUrl = this.router.url;
    this.showNav = !currentUrl.includes('/home/category');
  }
}
