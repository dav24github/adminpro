import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen',
})
export class ImagenPipe implements PipeTransform {
  transform(img: any, tipo: string = 'usuarios'): any {
    let url = URL_SERVICIOS + '/img';

    if (!img) {
      return url + '/usuarios/xxx';
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }

    switch (tipo) {
      case 'usuarios':
        return url + '/usuarios/' + img;
        break;

      case 'medicos':
        return url + '/medicos/' + img;
        break;

      case 'hospitales':
        return url + '/hospitales/' + img;
        break;

      default:
        console.log('tipo de img no existe');
    }

    return url;
  }
}
