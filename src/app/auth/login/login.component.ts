import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  cargando: boolean = false;
  cargandoSubs: Subscription = new Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState>) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      correo  : ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required],
    });

    this.cargandoSubs = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    })
  }

  ngOnDestroy(): void {
    this.cargandoSubs.unsubscribe();
  }

  login() {

    if ( this.loginForm.invalid ) { return; };

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading(Swal.getDenyButton())
    //   }
    // });

    const { correo, password } = this.loginForm.value;
    this.authService.loginUsuario( correo, password )
      .then( credenciales => {
        // Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigateByUrl('dashboard');

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
