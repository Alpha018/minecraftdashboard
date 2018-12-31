import {Component, DoCheck, OnInit} from '@angular/core';
import {UserService} from '../services/user.services';
import {Router} from '@angular/router';

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [{
    path: '/components',
    title: 'Sistema',
    type: 'sub',
    icontype: 'nc-icon nc-layout-11',
    children: [
        {path: 'infosys', title: 'Información de Sistema', ab: 'IS'},
        {path: 'console', title: 'Consola', ab: 'CO'}
    ]
}, {
    path: '/files',
    title: 'Archivos',
    type: 'sub',
    icontype: 'nc-icon nc-ruler-pencil',
    children: [
        {path: 'getplugins', title: 'Lista de Plugins', ab: 'LP'},
        {path: 'uploadplugins', title: 'Subir Plugins', ab: 'SP'},
        {path: 'serverproperties', title: 'Propiedades del Servidor', ab: 'PS'}
    ]
}];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit, DoCheck {
    public menuItems: any[];
    public identity;
    public token;

    constructor(private _userService: UserService,
                private router: Router) {
    }

    isNotMobileMenu() {
        if (window.outerWidth > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.identity = this._userService.getIdentity();
    }

    logOut() {
        localStorage.clear();
        this.identity = null;
        this.token = null;
        this.router.navigate(['/']);
    }

    ngDoCheck() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        if (this.identity === null || this.identity === '' || this.token === null || this.token === '') {
            localStorage.clear();
            this.identity = null;
            this.token = null;
            this.router.navigate(['/pages/login']);
        }

        const expire = this._userService.getExpire();
        const ahora = new Date();
        const exp = new Date(expire);
        if (exp.getTime() < ahora.getTime()) {
            localStorage.clear();
            this.identity = null;
            this.token = null;
            this.router.navigate(['/pages/login']);
        }
    }
}
