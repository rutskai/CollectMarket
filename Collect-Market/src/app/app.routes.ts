import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { UserPage } from './pages/user-page/user-page';
import { ShopPage } from './pages/shop-page/shop-page';
import { FavoritePage } from './pages/favorite-page/favorite-page';
import { ShoppingCartPage } from './pages/shopping-cart-page/shopping-cart-page';
import { SupportPage } from './pages/support-page/support-page';
import { UserPersonalizationPage } from './pages/user-personalization-page/user-personalization-page';

export const routes: Routes = [
    {path:"", component: HomePage},
    {path:"home", component: HomePage},
    {path:"auth/login", component: LoginPage},
    {path:"auth/register", component: RegisterPage},
    {path:"user", component: UserPage},
    {path:"shop", component: ShopPage},
    {path:"favorite", component: FavoritePage},
    {path: "shopping-cart", component:ShoppingCartPage},
    {path:"support-page", component:SupportPage},
    {path: 'personalization-page', component: UserPersonalizationPage },
    

];
