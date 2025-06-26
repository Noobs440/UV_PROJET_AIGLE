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


const routes: Routes = [

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    ],
      //canActivate: [adminGuard]
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
    ],
      //canActivate: [userGuard]
  },
  {
    path: '',
    component: DefaultComponent,
    children: [
      // { path: '', redirectTo: '/home', pathMatch: 'full' },
      // { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      // { path: 'login', component: LoginComponent },
      {path:"",redirectTo:"home",pathMatch:"full"},
      // {path:"home/login",component:LoginComponent},
      // {path:"home/register", component:RegisterComponent},
      // {path:"admin", component:AdminDashboardComponent},
      {path:"home/contact", component:ContactComponent},
      {path:"home/category", component:PopCategoryComponent},
      {path:"home/projects-listing", component:ProjectsComponent},
      {path:"home/team", component:TeamComponent},
      {path:"home/project-detail/:id", component:ProjectDetailComponent},
      {path:"home",component:HomeComponent},
    ],
     //canActivate: [appGuard]
  },
  {
    path: '**', redirectTo: '/home'
  },

  // { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  // { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
