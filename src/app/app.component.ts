import { Component} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { GlobalDataService } from './core/services/global-data.service';
import { Shift } from './core/models/shift';
import { KeyValuePipe } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{


  constructor(public globalData : GlobalDataService){}


}




