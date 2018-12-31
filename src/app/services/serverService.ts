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
            switch (data) {
                case 'error_reading_server_eula':
                    this.showNotificationError('top', 'left', 'No se encontró el archivo EULA');
                    break;
                case 'server_started':
                    this.showNotificationError('top', 'left', 'El servidor ya fue iniciado');
                    break;
                case 'server_is_started':
                    this.showNotificationError('top', 'left', 'El servidor se encuentra online, es necesario apagarlo');
                    break;
                case 'eula_true':
                    this.showNotificationError('top', 'left', 'El archivo EULA ya fue acceptado');
                    break;
                case 'fail_to_edit_eula':
                    this.showNotificationError('top', 'left', 'Error al editar el archivo EULA');
                    break;
                case 'error_reading_server_prop':
                    this.showNotificationError('top', 'left', 'Error al leer el archivo Properties');
                    break;
                case 'error_writing_server_prop':
                    this.showNotificationError('top', 'left', 'Error al editar el archivo Properties');
                    break;
                case 'fail_to_find_eula':
                    this.showNotificationError('top', 'left', 'El archivo EULA no existe en el sistema');
                    break;
                default:
                    this.showNotification('top', 'left', data);
                    break;
            }
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

    showNotificationError(from, align, dato) {
        $.notify({
            icon: 'ti-close',
            message: '<b>Error en el servidor</b> - ' + dato + '.'
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
