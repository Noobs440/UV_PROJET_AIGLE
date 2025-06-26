import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';

import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SubmitPopupComponent } from './user-components/submit-popup/submit-popup.component';
import { UserComponent } from './user-components/user/user.component';
import { ProjectDetailComponent } from './user-components/project-detail/project-detail.component';
import { DocumentPopupComponent } from './user-components/document-popup/document-popup.component';
import { CompleteDialogComponent } from './user-components/complete-dialog/complete-dialog.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog'; // ✅ correction ici

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
    MatDialogModule // ✅ module correct
  ]
})
export class UserModule { }
