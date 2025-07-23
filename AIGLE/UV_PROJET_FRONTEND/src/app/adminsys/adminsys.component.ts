import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-adminsys',
  templateUrl: './adminsys.component.html',
  styleUrl: './adminsys.component.css'
})
export class AdminsysComponent {

   data1: any[] = [];
   userCount: number = 0;
   constructor(private userService: UserService, ){
   }

}
