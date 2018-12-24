import {Routes} from '@angular/router';

import {UploadPluginsComponent} from './uploadPlugins/uploadPlugins.component';
import {GetPluginsComponent} from './getPlugins/getPlugins.component';

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
    }
];
