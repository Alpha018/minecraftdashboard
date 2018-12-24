export let GLOBAL;
import {environment} from '../../environments/environment';

GLOBAL = {
    url: `${environment.baseUrl}/api`,
    img: `${environment.baseUrl}/public/img/?img=`,
    doc: `${environment.baseUrl}/archivos/?doc=`,
    socket: `${environment.baseUrl}`
};
