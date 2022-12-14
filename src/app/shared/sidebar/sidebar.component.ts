import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombreUsuario?: string;
  nombreSubs: Subscription = new Subscription;

  constructor( private authService: AuthService,
               private router: Router,
               private store: Store<AppState>) { }

  ngOnDestroy(): void {
    this.nombreSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.nombreSubs = this.store.select('user').subscribe( ({ user }) => this.nombreUsuario = user?.nombre );
  }

  logOut() {
    this.authService.logOutUsuario()
      .then( () => {
        this.router.navigateByUrl('login')
      })
  }

}
