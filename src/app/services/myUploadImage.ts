import {GLOBAL} from './global';
import {UploadItem} from "angular-http-file-upload";

export class MyUploadImage extends UploadItem {
    public token;

    constructor(file: any) {
        super();
        this.url = GLOBAL.url;
        this.url = this.url + '/user/changeProfileImage';
        this.headers = {
            authorization: this.getToken()
        };
        this.file = file;
    }

    getToken() {
        const token = localStorage.getItem('token');
        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token
    }
}