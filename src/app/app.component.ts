import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { ProductListComponent } from "../app/features/product/product-list/product-list.component";
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavBarComponent } from './shared/Components/nav-bar/nav-bar.component'; // Import NavBarComponent

@Component({
  selector: 'pos-root',
  imports: [ RouterOutlet, NavBarComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pos';
}
