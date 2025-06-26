import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-components/home/home.component';
import { ContactComponent } from './home-components/contact/contact.component';
import { PopCategoryComponent } from './home-components/pop-category/pop-category.component';
import { ProjectsComponent } from './home-components/projects/projects.component';
import { TeamComponent } from './home-components/team/team.component';
import { ProjectDetailComponent } from './home-components/project-detail/project-detail.component';
import { DefaultComponent } from './layouts/default/default.component';
import { AdminComponent } from './admin/admin-components/admin/admin.component';
import { UserComponent } from './user/user-components/user/user.component';
import { AdminsysDashboardComponent } from './adminsys/adminsys-dashboard/adminsys-dashboard.component';
import { AuthGuard } from './guards/auth.gard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { HelpComponent } from './user/user-components/help/help.component';
import { HelpComponentAdmin } from './admin/admin-components/help/help.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';

const routes: Routes = [

  { path: 'adminsys', component: AdminsysDashboardComponent },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    ],
    canActivate: [AuthGuard, AdminGuard]
  },

  { path: 'helpUser', component: HelpComponent },
  { path: 'helpAdmin', component: HelpComponentAdmin },
  { path: 'dashboard', component: HelpComponentAdmin },

  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
    ],
    canActivate: [AuthGuard, UserGuard],
  },

  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home/contact', component: ContactComponent },
      { path: 'home/category', component: PopCategoryComponent },
      { path: 'home/projects-listing', component: ProjectsComponent },
      { path: 'home/team', component: TeamComponent },
      { path: 'home/project-detail/:id', component: ProjectDetailComponent },
      { path: 'home', component: HomeComponent },
    ],
  },

  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
