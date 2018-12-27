import {Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [{
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full',
}, {
    path: '',
    component: AdminLayoutComponent,
    children: [{
        path: 'components',
        loadChildren: './components/components.module#ComponentsModule'
    }, {
        path: 'files',
        loadChildren: './forms/forms.module#Forms'
    }, {
        path: 'profile',
        loadChildren: './userpage/user.module#UserModule'
    }]
}, {
    path: '',
    component: AuthLayoutComponent,
    children: [{
        path: 'pages',
        loadChildren: './pages/pages.module#PagesModule'
    }]
}];
