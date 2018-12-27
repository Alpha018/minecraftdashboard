import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.services';
import {UtilsService} from '../../services/utils';
import {ServerService} from '../../services/serverService';

@Component({
    moduleId: module.id,
    selector: 'user-cmp',
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {
    public identity;
    public plugins;
    public ramTotal;
    public infoCPU;

    private socket = this.serverService.getSocket();

    constructor (private _userService: UserService,
                 private serverService: ServerService) {

    }

    ngOnInit(): void {
        this.identity = this._userService.getIdentity();

        this._userService.getPlugins().subscribe(response => {
            this.plugins = response.plugins;
        }, err => {
            this.plugins = 'Error';
        });

        this.socket.on('system_usage', (data: any) => {
            this.ramTotal = UtilsService.formatSizeUnits(data.totalmem, 0);
        });

        this.socket.emit('get_system_type', {});
        this.socket.on('system_type', (data: any) => {
            this.infoCPU = data.cpus[0].model.split('@')[0];
        });
    }
}
