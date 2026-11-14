import { Routes } from '@angular/router'; 
import { Home } from './home/home'; 
import { Login } from './login/login'
import { Register } from './register/register'; 

import { Notfound } from './notfound/notfound'; 
import { Profile } from './profile/profile';

export const routes: Routes = [ 
    {path: '', component: Home }, 
    { path: 'home', component: Home }, 
    {path: 'login', component: Login}, 
    {path: 'register', component: Register},
    {path: 'profile', component: Profile},

    {path: '**', component: Notfound} 

]; 