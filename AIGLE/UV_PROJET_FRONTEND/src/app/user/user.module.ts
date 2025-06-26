import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SubmitPopupComponent } from './user-components/submit-popup/submit-popup.component';
import { UserComponent } from './user-components/user/user.component';
import { ProjectDetailComponent } from './user-components/project-detail/project-detail.component';
import { DocumentPopupComponent } from './user-components/document-popup/document-popup.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CompleteDialogComponent } from './user-components/complete-dialog/complete-dialog.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    SubmitPopupComponent,
    UserComponent,
    ProjectDetailComponent,
    DocumentPopupComponent,
    CompleteDialogComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDialogActions,
    MatDialogContent
  ]
})
export class UserModule { }
