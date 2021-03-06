import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {UserComponent} from './User/user.component';
import {UserRoutes} from './user.routing';
import {ChangePassComponent} from './changePassword/changePass.component';
import {UploadImageComponent} from './uploadImage/uploadImage.component';
import {AddUserComponent} from './addUser/addUser.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        FormsModule
    ],
    declarations: [
        UserComponent,
        ChangePassComponent,
        UploadImageComponent,
        AddUserComponent
    ]
})

export class UserModule {}
