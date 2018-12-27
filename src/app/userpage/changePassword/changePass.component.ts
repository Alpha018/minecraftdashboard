import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import {UserService} from '../../services/user.services';
import {Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'regularforms-cmp',
    templateUrl: 'changePass.component.html'
})

export class ChangePassComponent implements OnInit {

    constructor(private location: Location,
                private _userService: UserService,
                private _router: Router) {

    }

    ngOnInit(): void {

    }

    submitForm(oldPass, newPass, repeat) {
        if (newPass !== repeat) {
            swal({
                title: 'Error',
                text: 'Las claves nuevas no son iguales',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning',
                type: 'error'
            }).catch(swal.noop);
            return;
        }

        this._userService.changePassword(oldPass, newPass).subscribe(response => {
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
