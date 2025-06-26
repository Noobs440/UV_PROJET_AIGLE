import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginPopupComponent } from '../../home-components/modals/login-popup/login-popup.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css',]
})
export class NavComponent {
  @Input() bgColor: string = '';
  status:any;

  ngOninit(){
    // this.route.queryParams.subscribe(params => {
    //    this.status = params['status']; // Get the query param 'id'
    //   //const name = params['name']; // Get the query param 'name'
    // });
  }

  constructor(private route: ActivatedRoute, private translate: TranslateService,private dialog:MatDialog, private router: Router) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

  }

  switchLanguage(language: any) {
    this.translate.use(language);
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(LoginPopupComponent, {
      width:'387px',
      height:'600px',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  isActive(routeFragment: string): boolean {
    return this.router.url === routeFragment;
  }

 }
