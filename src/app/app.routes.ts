import { Routes } from '@angular/router';
import { ProductLineItemListComponent } from './features/product-Line-Item/product-line-item-list/product-line-item-list.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';
import { ProductCreateComponent } from './features/product/product-create/product-create.component';
import { ProductDeleteComponent } from './features/product/product-delete/product-delete.component';
import { ProductEditComponent } from './features/product/product-edit/product-edit.component';
import { ProductLineItemCreateComponent } from './features/product-Line-Item/product-line-item-create/product-line-item-create.component';
import { ProductLineItemEditComponent } from './features/product-Line-Item/product-Line-Item-Edit/product-line-item-edit.component';
import { ProductLineItemDeleteComponent } from './features/product-Line-Item/product-line-item-delete/product-line-item-delete.component';

export const routes: Routes = [
    {path: 'product-line-item-list', component: ProductLineItemListComponent },
    {path: 'product-line-item-create', component: ProductLineItemCreateComponent },
    {path: 'product-line-item-edit', component: ProductLineItemEditComponent },
    {path: 'product-line-item-delete', component: ProductLineItemDeleteComponent },
    {path: 'product-list', component: ProductListComponent },
    {path: 'product-create', component: ProductCreateComponent },
    {path: 'product-delete', component: ProductDeleteComponent },
    {path: 'product-edit', component: ProductEditComponent },
];
