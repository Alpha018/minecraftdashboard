import {Routes} from '@angular/router';

import {UserComponent} from './User/user.component';
import {ChangePassComponent} from './changePassword/changePass.component';
import {UploadImageComponent} from './uploadImage/uploadImage.component';
import {AddUserComponent} from './addUser/addUser.component';

export const UserRoutes: Routes = [{
    path: '',
    children: [{
        path: 'user',
        component: UserComponent
    }, {
        path: 'changepass',
        component: ChangePassComponent
    }, {
        path: 'uploadimage',
        component: UploadImageComponent
    }, {
        path: 'adduser',
        component: AddUserComponent
    }]
}];
