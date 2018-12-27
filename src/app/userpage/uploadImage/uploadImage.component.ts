import {Component, OnInit} from '@angular/core';
import {ServerService} from '../../services/serverService';
import {UserService} from '../../services/user.services';
import swal from 'sweetalert2';
import {UtilsService} from '../../services/utils';
import {MyUploadImage} from '../../services/myUploadImage';
import {Uploader} from 'angular-http-file-upload';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

declare var require: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'extendedforms-cmp',
    templateUrl: 'uploadImage.component.html'
})

export class UploadImageComponent implements OnInit {
    public identity;

    constructor(private _userService: UserService,
                private serverService: ServerService,
                private _router: Router,
                private location: Location,
                private uploadImg: Uploader) {

    }

    ngOnInit() {
        this.identity = this._userService.getIdentity();
    }

    change(event) {
        const uploadFile = event.srcElement.files[0];
        if (!uploadFile) {
            swal({
                title: 'Cancelado',
                text: 'Debe seleccionar un archivo para subir',
                type: 'error',
                confirmButtonClass: 'btn btn-info',
                buttonsStyling: false
            });
            return
        } else {
            if (uploadFile.size > 100000000) {
                swal({
                    title: 'Cancelado',
                    text: 'Error: El archivo no puede pesar más de 100 MB',
                    type: 'error',
                    confirmButtonClass: 'btn btn-info',
                    buttonsStyling: false
                });
                return
            } else {
                const fileExt = UtilsService.getFileExtension(uploadFile.name);

                if (fileExt.toLowerCase() === 'jpg' || fileExt.toLowerCase() === 'png' || fileExt.toLowerCase() === 'gif') {

                    const myUploadImage = new MyUploadImage(uploadFile);
                    this.uploadImg.onSuccessUpload = (item, response, status, headers) => {
                        console.log(response);
                        swal('Buen trabajo!', 'Tu archivo se subio correctamente', 'success');
                        this.sleep(2000).then(() => {
                            this.reloadPage();
                        });
                        const data = JSON.parse(response);
                        localStorage.setItem('identity', JSON.stringify(data));
                    };
                    this.uploadImg.onErrorUpload = (item, response, status, headers) => {
                        swal({
                            title: 'Cancelado',
                            text: 'Error: ' + response.desc,
                            type: 'error',
                            confirmButtonClass: 'btn btn-info',
                            buttonsStyling: false
                        });
                    };
                    this.uploadImg.onCompleteUpload = (item, response, status, headers) => {
                        // complete callback, called regardless of success or failure
                    };
                    this.uploadImg.upload(myUploadImage);
                } else {
                    swal({
                        title: 'Cancelado',
                        text: 'Error: El formato debe ser jpg, png o gif',
                        type: 'error',
                        confirmButtonClass: 'btn btn-info',
                        buttonsStyling: false
                    });
                    return
                }
            }
        }
    }

    reloadPage() {
        this._router.navigate([this._router.url]);
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    back() {
        this.location.back(); // <-- go back to previous location on cancel
    }
}
