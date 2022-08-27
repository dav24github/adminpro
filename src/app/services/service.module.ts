import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  SettingsService,
  SidebarService,
  SharedService,
  UsuarioService,
  SubirArchivoService,
} from './service.index';
import { ModalService } from '../components/modal-upload/modal.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    UsuarioService,
    SettingsService,
    SidebarService,
    SharedService,
    SubirArchivoService,
    ModalService,
  ],
})
export class ServiceModule {}
