import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  constructor( private authService: AuthService,
               private router: Router) { }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.logOutUsuario()
      .then( () => {
        this.router.navigateByUrl('login')
      })
  }

}
