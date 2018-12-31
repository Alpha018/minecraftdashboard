import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {JWBootstrapSwitchModule} from 'jw-bootstrap-switch-ng2';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TagInputModule} from 'ngx-chips';

import {FormsRoutes} from './forms.routing';

import {FileDropModule} from 'ngx-file-drop';
import {HttpClientModule} from '@angular/common/http';
import {UploadPluginsComponent} from './uploadPlugins/uploadPlugins.component';
import {GetPluginsComponent} from './getPlugins/getPlugins.component';
import {ServerPropertiesComponent} from "./serverProperties/serverProperties.component";


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FormsRoutes),
        FormsModule,
        TagInputModule,
        JWBootstrapSwitchModule,
        NgbModule,
        FormsModule,
        FileDropModule,
        HttpClientModule
    ],
    declarations: [
        UploadPluginsComponent,
        GetPluginsComponent,
        ServerPropertiesComponent
    ]
})

export class Forms {
}
