import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class SubirArchivoService {
  constructor(private http: HttpClient) {}

  subirArchivo(archivo: File, tipo: string, id: string) {
    // ---------------VANILLA JS--------------
    // let formData = new FormData();
    // let xhr = new XMLHttpRequest();
    // return new Promise((resolve, reject) => {
    //   formData.append('imagen', archivo, archivo.name);
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4) {
    //       if (xhr.status === 200) {
    //         console.log('img subida');
    //         resolve(JSON.parse(xhr.response));
    //       } else {
    //         console.log('fallo la subida');
    //         reject(xhr.response);
    //       }
    //     }
    //   };
    //   let url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
    //   xhr.open('PUT', url, true);
    //   xhr.send(formData);
    // });
  }
}
