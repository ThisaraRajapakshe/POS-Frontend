import { Component } from '@angular/core';
import { NavBarComponent } from './shared/Components/nav-bar/nav-bar.component'; 

@Component({
  selector: 'pos-root',
  imports: [ NavBarComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pos';
}
