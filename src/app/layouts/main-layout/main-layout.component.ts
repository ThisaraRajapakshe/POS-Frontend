import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/Components/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pos-main-layout',
  imports: [NavBarComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
