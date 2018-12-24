import {Component, Injectable} from '@angular/core';
import {FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UtilsService} from '../../services/utils';
import swal from 'sweetalert2';
import {UserService} from '../../services/user.services';

@Component({
    moduleId: module.id,
    selector: 'regularforms-cmp',
    templateUrl: 'uploadPligins.component.html'
})

@Injectable()
export class UploadPluginsComponent {

    public files: UploadFile[] = [];
    public filesData = [];

    constructor(private _userService: UserService,
                private http: HttpClient) {
    }

    public dropped(event: UploadEvent) {
        event.files.forEach((data) => {
            if (data.fileEntry.isFile) {
                const fileEntry = data.fileEntry as FileSystemFileEntry;

                fileEntry.file((file: File) => {
                    if (UtilsService.getFileExtension(file.name) === 'JAR' || UtilsService.getFileExtension(file.name) === 'jar') {
                        this.filesData.push({
                            file,
                            size: UtilsService.formatSizeUnits(file.size, 2)
                        });
                        this.files.push(data);
                    } else {
                        swal({
                            title: 'Error',
                            text: 'Uno o más archivos no son plugins en formato JAR',
                            buttonsStyling: false,
                            confirmButtonClass: 'btn btn-success',
                            type: 'error'
                        }).catch(swal.noop)
                    }
                });

            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = data.fileEntry as FileSystemDirectoryEntry;
            }
        });
    }

    public fileOver(event) {
    }

    public fileLeave(event) {
    }

    submitPlugins() {
        for (const droppedFile of this.files) {
            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {

                    // You could upload it like this:
                    const formData = new FormData();
                    formData.append('plugins', file, droppedFile.relativePath);

                    // Headers
                    const headers = new HttpHeaders({
                        'authorization': this._userService.getToken()
                    });
                    this.http.post(`${this._userService.getBaseUrl()}/user/uploadplugins`, formData, {
                        headers: headers
                    }).subscribe(data => {
                        this.clearList();
                        swal({
                            title: 'Buen trabajo',
                            text: 'Subiste tus plugins correctamente',
                            buttonsStyling: false,
                            confirmButtonClass: 'btn btn-success',
                            type: 'success'
                        }).catch(swal.noop)
                    }, err => {
                        this.clearList();
                        swal({
                            title: 'Error',
                            text: 'Hubo un error al subir los plugins',
                            buttonsStyling: false,
                            confirmButtonClass: 'btn btn-warning',
                            type: 'error'
                        }).catch(swal.noop)
                    })
                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
    }

    clearList() {
        this.files.length = 0;
        this.filesData.length = 0;
    }
}
