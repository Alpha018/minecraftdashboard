import {Injectable} from '@angular/core';
import {UserService} from './user.services';
import io from 'socket.io-client';

declare var $: any;

@Injectable()
export class ServerService {
    socket;

    constructor(private _userService: UserService) {
        this.socket = io(this._userService.getSocketHost(), {
            'reconnection': true,
            'reconnectionDelay': 500,
            'reconnectionAttempts': 10,
            'multiplex': false,
            query: {
                Authorization: this._userService.getToken()
            }
        });
        this.socket.on('fail', (data: any) => {
            this.showNotification('top', 'left', data);
        })
    }

    getSocket() {
        return this.socket;
    }

    showNotification(from, align, dato) {
        $.notify({
            icon: 'ti-close',
            message: '<b>Error en el servidor</b> - ' + dato + '. Comando no valido.'
        }, {
            type: 'warning',
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    }
}