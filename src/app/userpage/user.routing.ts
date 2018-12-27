import {Routes} from '@angular/router';

import {UserComponent} from './User/user.component';

export const UserRoutes: Routes = [{
    path: '',
    children: [{
        path: 'user',
        component: UserComponent
    }]
}];
