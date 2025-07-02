import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from "./product-list/product-list.component";

@Component({
  selector: 'pos-root',
  imports: [ProductListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pos';
}
