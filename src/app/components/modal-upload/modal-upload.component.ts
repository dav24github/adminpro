import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import Swal from 'sweetalert2';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.css'],
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File | null = null;
  imagenTemp!: string | null;

  constructor(public _modalService: ModalService, public http: HttpClient) {}

  ngOnInit(): void {}

  subirImagen() {
    const formData = new FormData();
    formData.append('imagen', this.imagenSubir!);
    let url =
      URL_SERVICIOS +
      '/upload/' +
      this._modalService.tipo +
      '/' +
      this._modalService.id;
    this.http.put(url, formData).subscribe((resp: any) => {
      this._modalService.ocultarModal();
      this.cerrarModal();
      this._modalService.notificacion.emit(resp);
      Swal.fire('imagen Actualizada', resp.data.nombre, 'success');
    });
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;

    this._modalService.ocultarModal();
  }

  selecionImagen(event: any) {
    let archivo = event.target.files[0];

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire(
        'Solo Imagenes',
        'El archivo selecionado no es una imagen',
        'error'
      );
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    // -----------VANILLA JS------------
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => {
      this.imagenTemp = reader.result as string;
    };
  }
}
