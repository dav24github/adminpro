import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
  ],
  exports: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
  ],
})
export class SharedModule {}
