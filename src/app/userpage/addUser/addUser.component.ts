import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import {UserService} from '../../services/user.services';
import {Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'regularforms-cmp',
    templateUrl: 'addUser.component.html'
})

export class AddUserComponent implements OnInit {

    constructor(private location: Location,
                private _userService: UserService,
                private _router: Router) {

    }

    ngOnInit(): void {

    }

    submitForm(email, user, pass) {
        if (!email || !user || !pass) {
            swal({
                title: 'Error',
                text: 'Todos los parametros deben ser rellenados',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning',
                type: 'error'
            }).catch(swal.noop);
            return;
        }
        const userReq = {email, username: user, password: pass};
        this._userService.registrarUsuario(userReq).subscribe(response => {
            swal({
                title: 'Felicidades',
                text: 'La clave ha sido cambiada con exito',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-success',
                type: 'success'
            }).catch(swal.noop);
            this._router.navigate(['/profile/user']);
        }, err => {
            swal({
                title: 'Error',
                text: 'Hubo un error al cambiar la contraseña',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning',
                type: 'error'
            }).catch(swal.noop);
        })
    }

    back() {
        this.location.back(); // <-- go back to previous location on cancel
    }
}
