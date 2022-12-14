import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.action';

import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription!: Subscription;
  private _user!: Usuario | null;

  get user() {
    return this._user;
  }

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore,
               private store: Store<AppState>  ) { }

  initAuthListener() {

    this.auth.authState.subscribe( fuser => {
      if ( fuser ) {
        //existe
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) => {
            const user =  Usuario.fromFirebase( firestoreUser );
            this._user = user;
            this.store.dispatch( actions.setUser({ user }) );
          })

      } else {
        this._user = null;
        this.userSubscription.unsubscribe();
        this.store.dispatch( actions.unSetUser() );
        this.store.dispatch( ingresoEgresoActions.unSetItems() );
      }
    })
  }

  crearUsuario( nombre:string, email: string, password:string ) {

    return this.auth.createUserWithEmailAndPassword( email, password )
            .then( ({ user }) => {

              const newUser = new Usuario( user!.uid, nombre, email);

              return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser});
            })
  }

  loginUsuario( email: string, password:string ) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logOutUsuario() {
    return this.auth.signOut();
  }

  isAuth() {

    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    )

  }
}
