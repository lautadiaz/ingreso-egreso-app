import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs: Subscription = new Subscription;

  constructor( private store: Store<AppStateWithIngreso>,
               private ingresoEgresoService: IngresoEgresoService) { }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.ingresosEgresosSubs = this.store.select('ingresosEgresos')
      .subscribe( ({ items }) => this.ingresosEgresos = items );
  }

  borrarIngresoEgreso( item: any ) {
      console.log( item.uid );
      this.ingresoEgresoService.borrarIngresoEgreso( item.uid )
        .then( () => Swal.fire('Borrado', `Se borro ${ item.descripcion }`, 'success') )
        .catch( err => Swal.fire('Error', err.value, 'error') );
  }
}
