import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {ProfileComponent} from "./app/profile/profile.component";
import {RegisterComponent} from "./app/register/register.component";
import {LoginComponent} from "./app/login/login.component";
import {AuthGuard} from "./app/config/auth.guard";
import {ProductComponent} from "./app/product/product.component";
import {TaskComponent} from "./app/task/task.component";
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'products', component: ProductComponent},
  { path: 'process', component: TaskComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
