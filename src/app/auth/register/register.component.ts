import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm!: FormGroup;
  cargando: boolean = false;
  cargandoSubs: Subscription = new Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState>) { }

ngOnInit(): void {

  this.registroForm = this.fb.group({
    nombre  : ['', Validators.required],
    correo  : ['', [Validators.required, Validators.email] ],
    password: ['', Validators.required],
  });

  this.cargandoSubs = this.store.select('ui')
      .subscribe( ui => this.cargando = ui.isLoading )
}

ngOnDestroy(): void {
  this.cargandoSubs.unsubscribe();
}

  crearUsuario() {

    if ( this.registroForm.invalid ) { return; };

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading(Swal.getDenyButton())
    //   }
    // });

    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password)
      .then( credenciales => {
        // console.log(credenciales);
        // Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigateByUrl('dashboard')
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire({
          title: 'Error',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      })
  }

}
