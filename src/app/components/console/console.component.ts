import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ServerService} from '../../services/serverService';
import {UserService} from '../../services/user.services';

@Component({
    moduleId: module.id,
    selector: 'grid-cmp',
    templateUrl: 'console.component.html'
})

export class ConsoleComponent implements OnInit {
    public socket = this.serverService.getSocket();
    public console = [];
    public command: string;

    constructor(private _userService: UserService,
                private router: Router,
                private serverService: ServerService) {
    }

    ngOnInit(): void {
        this.socket.on('console', (data: string) => {
            if (data) {
                if (this.console.length >= 200) {
                    this.console.shift();
                }
                this.console.push(data);
            }
        });
        this.getGlobalConsole();
    }

    getGlobalConsole() {
        this.socket.emit('get_global_console');
        this.socket.on('global_console', (data: any) => {
            this.console = this.console.concat(data.console);
            return
        });
    }

    sendCommand(event) {
        if (event.keyCode === 13) {
            this.socket.emit('command', {command: this.command});
            this.command = '';
        }
    }
}
