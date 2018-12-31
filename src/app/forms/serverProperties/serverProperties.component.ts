import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.services';
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {ServerService} from '../../services/serverService';

declare var $: any;


@Component({
    moduleId: module.id,
    selector: 'extended-table-cmp',
    templateUrl: 'serverProperties.component.html'
})

export class ServerPropertiesComponent implements OnInit {
    public objectKeys = Object.keys;
    public properties = [];

    private socket = this.serverService.getSocket();

    constructor(private _userService: UserService,
                private router: Router,
                private serverService: ServerService) {
    }

    ngOnInit() {
        this.socket.emit('get_server_properties', {});
        this.socket.on('server_properties', (data: any) => {
            this.properties = data._propertiesExpanded;
        });

        this.socket.on('change_server_properties_response', (data: any) => {
            console.log(data);
        });
    }

    changeProperties(prop: string, value: string) {
        console.log(prop, value);
        if (prop && value) {
            this.sendProperties(prop, value);
        } else {
            swal({
                title: '¿Estás seguro?',
                text: `Dejarás a ${prop} sin valor`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                confirmButtonText: 'Si, hazlo',
                buttonsStyling: false
            }).then((result) => {
                if (result.value) {
                    this.sendProperties(prop, value);
                }
            })
        }
    }

    sendProperties(prop: string, value: string) {
        this.socket.emit('change_server_properties', {prop, value});
    }

    ngAfterViewInit() {
        // Init Tooltips
        $('[rel="tooltip"]').tooltip();
    }
}
