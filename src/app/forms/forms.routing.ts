import {Routes} from '@angular/router';

import {UploadPluginsComponent} from './uploadPlugins/uploadPlugins.component';
import {GetPluginsComponent} from './getPlugins/getPlugins.component';
import {ServerPropertiesComponent} from './serverProperties/serverProperties.component';

export const FormsRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'uploadplugins',
            component: UploadPluginsComponent
        }]
    }, {
        path: '',
        children: [{
            path: 'getplugins',
            component: GetPluginsComponent
        }]
    }, {
        path: '',
        children: [{
            path: 'serverproperties',
            component: ServerPropertiesComponent
        }]
    }
];
