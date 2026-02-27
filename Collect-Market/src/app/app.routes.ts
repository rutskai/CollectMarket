import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { UserPage } from './pages/user-page/user-page';

export const routes: Routes = [
    {path:"", component: HomePage},
    {path:"home", component: HomePage},
    {path:"auth/login", component: LoginPage},
    {path:"auth/register", component: RegisterPage},
    {path:"user", component: UserPage}
    

];
