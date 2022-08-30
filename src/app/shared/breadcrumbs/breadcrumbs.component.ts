import { Component, OnInit } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnInit {
  titulo!: string;

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
    this.getDataRoute().subscribe((data) => {
      this.titulo = data.titulo;
      this.title.setTitle(this.titulo);

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.titulo,
      };

      this.meta.updateTag(metaTag);
    });
  }

  ngOnInit(): void {}

  getDataRoute() {
    return this.router.events.pipe(
      filter((evento) => evento instanceof ActivationEnd), // entrega 2 ActivationEnd
      filter((evento: any) => evento.snapshot.firstChild === null), // Para buscar la data
      map((evento: any) => {
        return evento.snapshot.data;
      })
    );
  }
}
