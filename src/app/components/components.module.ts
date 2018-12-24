import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ComponentsRoutes} from './components.routing';
import {InfoSystemComponent} from './infoSystem/infoSystem.component';
import {ConsoleComponent} from './console/console.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ComponentsRoutes),
        FormsModule
    ],
    declarations: [
        InfoSystemComponent,
        ConsoleComponent
    ]
})

export class ComponentsModule {
}
