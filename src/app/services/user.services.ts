import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;
    public exp;
    public img: string;
    public doc: string;
    public socket: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
        this.img = GLOBAL.img;
        this.doc = GLOBAL.doc;
        this.socket = GLOBAL.socket;
    }

    register() {
        return 'Texto desde Servicio';
    }

    login(usuario: string, password: string, gettoken = null) {

        const sendUser = {
            emailUser: usuario,
            password: password,
            gettoken: undefined
        };

        if (gettoken != null) {
            sendUser.gettoken = gettoken;
        }

        const params = JSON.stringify(sendUser);
        const headers = new Headers({
            'Content-Type':
                'application/json'
        });
        return this._http.post(this.url + '/user/login', params,
            {headers: headers}).map(res => res.json());
    }

    getPlugins() {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });
        headers.append('authorization', this.getToken());
        return this._http.get(this.url + '/user/getPlugins',
            {headers: headers}).map(res => res.json());
    }

    changeStatusPlugin(name: string) {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });
        headers.append('authorization', this.getToken());
        return this._http.post(this.url + '/user/changestatusplugin', {name}, {headers: headers}).map(res => res.json());
    }

    registrarUsuario(usuarioIngresado) {
        const params = JSON.stringify(usuarioIngresado);
        const headers = new Headers({
            'Content-Type':
                'application/json'
        });
        headers.append('Authorization', this.getToken());
        return this._http.put(this.url + '/user/', params,
            {headers: headers}).map(res => res.json());
    }

    changePassword(oldpass: string, newpass: string) {
        const send = {
            old: oldpass,
            new: newpass
        };
        const params = JSON.stringify(send);
        const headers = new Headers({
            'Content-Type':
                'application/json'
        });
        headers.append('Authorization', this.getToken());
        return this._http.post(this.url + '/user/changePassword', params,
            {headers: headers}).map(res => res.json());
    }

    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity
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

    existLogin() {
        if (this.getIdentity()) {
            if (this.getToken()) {
                return true;
            }
        }
        return false;
    }

    getImgUrl() {
        return this.img;
    }

    getBaseUrl() {
        return this.url;
    }

    getSocketHost() {
        return this.socket;
    }

    getExpire() {
        const exp = localStorage.getItem('exp');
        if (exp !== 'undefined') {
            this.exp = exp;
        } else {
            this.exp = null;
        }
        return this.exp;
    }
}
