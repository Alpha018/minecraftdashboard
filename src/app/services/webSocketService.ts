import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import {UserService} from './user.services';

@Injectable()
export class WebSocketService {
    private socket;

    constructor(private userService: UserService) {
    }

    connect(): Rx.Subject<MessageEvent> {
        this.socket = io(this.userService.getSocketHost(), {
            query: {
                Authorization: this.userService.getToken()
            }
        });

        const observable = new Observable(observer => {
            // socket on y emit
            this.socket.on('data', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            }
        });

        const observer = {
            next: (data: Object) => {
                this.socket.emit('get_status', JSON.stringify(data));
            }
        };

        return Rx.Subject.create(observer, observable);
    }
}