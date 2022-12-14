import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as uiActions from '../shared/ui.actions';
import { Subscription } from 'rxjs';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm!: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  cargandoSubs: Subscription = new Subscription;

  constructor( private fb: FormBuilder,
               private ingresoEgresoService:IngresoEgresoService,
               private store: Store<AppState>) { }

  ngOnDestroy(): void {
      this.cargandoSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto      : ['', Validators.required],
      // tipo       : [this.tipo, Validators.required],
      // uid        : [''],
    });

    this.cargandoSubs = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    })
  }

  guardar() {


    if(this.ingresoForm.invalid) { return;}

    this.store.dispatch( uiActions.isLoading() );

    // console.log(this.ingresoForm.value)
    // console.log(this.tipo)

    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );

    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
      .then( () => {
        this.ingresoForm.reset();
        Swal.fire('Registro creado', descripcion, 'success');
        this.store.dispatch( uiActions.stopLoading());
      })
      .catch( err => {
        Swal.fire('Error', err.message, 'error')
        this.store.dispatch( uiActions.stopLoading());
      })
  }

}
