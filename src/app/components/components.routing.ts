import {Routes} from '@angular/router';

import {InfoSystemComponent} from './infoSystem/infoSystem.component';
import {ConsoleComponent} from './console/console.component';


export const ComponentsRoutes: Routes = [{
    path: '',
    children: [{
        path: 'infosys',
        component: InfoSystemComponent
    }]
}, {
    path: '',
    children: [{
        path: 'console',
        component: ConsoleComponent
    }]
}];
