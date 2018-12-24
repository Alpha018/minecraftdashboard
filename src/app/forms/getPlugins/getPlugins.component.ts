import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.services';
import swal from 'sweetalert2';

declare var $: any;


@Component({
    moduleId: module.id,
    selector: 'extended-table-cmp',
    templateUrl: 'getPlugins.component.html'
})

export class GetPluginsComponent implements OnInit {
    public plugins = [];

    constructor(private _userService: UserService) {
    }

    ngOnInit() {
        this._userService.getPlugins().subscribe(response => {
            this.plugins = response.plugins;
        }, err => {
            console.log(err);
            swal({
                title: 'Error',
                text: 'Hubo un error al obtener los plugins',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning',
                type: 'error'
            }).catch(swal.noop)
        })
    }

    changePluginStatus(name: string) {
        if (name) {
            this._userService.changeStatusPlugin(name).subscribe(response => {
                let statusFile;
                if (response.disable) {
                    statusFile = 'desactivado';
                } else {
                    statusFile = 'activado';
                }
                this.plugins.find(plugin => plugin.file === response.oldName).disable = response.disable;
                this.plugins.find(plugin => plugin.file === response.oldName).file = response.name;
                swal({
                    title: 'Felicidades',
                    text: `El plugin ${response.name}, ahora está ${statusFile}`,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-warning',
                    type: 'success'
                }).catch(swal.noop)
            }, err => {
                swal({
                    title: 'Error',
                    text: 'Hubo un error al cambiar el plugin',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-warning',
                    type: 'error'
                }).catch(swal.noop)
            })
        }
    }

    ngAfterViewInit() {
        // Init Tooltips
        $('[rel="tooltip"]').tooltip();
    }
}
