import {Injectable} from '@angular/core';

@Injectable()
export class UtilsService {

    public static formatSizeUnits(bytes, decimal) {
        if (0 === bytes) { return '0 Bytes'; }
        const c = 1024, d = decimal || 2, e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            f = Math.floor(Math.log(bytes) / Math.log(c));
        return parseFloat((bytes / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
    }

    public static secondsToHms(d) {
        d = Number(d);
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);

        const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
        const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
        const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
        return hDisplay + mDisplay + sDisplay;
    }

    public static getFileExtension(filename) {
        const ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? '' : ext[1];
    }
}
