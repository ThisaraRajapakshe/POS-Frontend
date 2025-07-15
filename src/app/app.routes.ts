import { Routes } from '@angular/router';
import { ProductLineItemListComponent } from './features/product-Line-Item/product-Line-Item-List-Create/product-line-item-list/product-line-item-list.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';

export const routes: Routes = [
    {path: 'product-line-item-list', component: ProductLineItemListComponent },
    {path: 'product-list', component: ProductListComponent }
];
