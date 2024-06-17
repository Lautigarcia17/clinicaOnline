import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { GlobalDataService } from '../../../core/services/global-data.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FirstCapitalLetterPipe } from '../../pipes/first-capital-letter.pipe';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,RouterModule,CommonModule,FirstCapitalLetterPipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent implements OnInit{
  isCollapsed : boolean;

  constructor(public globalData : GlobalDataService, private auth : AuthService, private toastr : ToastrService, private router : Router, public localStorage : LocalStorageService){
    this.isCollapsed = false;
  }

  @HostListener('window:resize',['$event'])
  ngOnInit(): void {
    this.onResize()
  }

  onResize(){
    const screenWidth : number = window.innerWidth;
    let isWideScreen : boolean = screenWidth > 1000;
    if (isWideScreen) {
      this.isCollapsed = false;  // Ensuring sidebar is expanded on wide screens
    }
  }


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }


  logOut()
  {
    Swal.fire({
      title: "Estas seguro?",
      text: "Volveras al  inicio y tendras que volver a iniciar sesion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout()
        .then( () =>{
          localStorage.clear();
          this.globalData.setLogout();
          this.toastr.success("Has cerrado la sesion","Nos vemos!", {timeOut: 3000,progressBar: true,closeButton:true});
          this.router.navigate(['home']);
        })
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Imagine que seguirias', 'error');
      }

    });
  }


}
