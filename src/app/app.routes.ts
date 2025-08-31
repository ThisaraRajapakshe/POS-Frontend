import { Routes } from '@angular/router';
import { ProductLineItemListComponent } from './features/product-Line-Item/product-line-item-list/product-line-item-list.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';
import { ProductCreateComponent } from './features/product/product-create/product-create.component';
import { ProductDeleteComponent } from './features/product/product-delete/product-delete.component';
import { ProductEditComponent } from './features/product/product-edit/product-edit.component';
import { ProductLineItemCreateComponent } from './features/product-Line-Item/product-line-item-create/product-line-item-create.component';
import { ProductLineItemEditComponent } from './features/product-Line-Item/product-Line-Item-Edit/product-line-item-edit.component';
import { ProductLineItemDeleteComponent } from './features/product-Line-Item/product-line-item-delete/product-line-item-delete.component';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { CategoryCreateComponent } from './features/category/category-create/category-create.component';
import { CategoryEditComponent } from './features/category/category-edit/category-edit.component';
import { CategoryDeleteComponent } from './features/category/category-delete/category-delete.component';
import { ProductManagementComponent } from './features/product/product-management/product-management.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { CategoryManagementComponent } from './features/category/category-management/category-management.component';
import { LineItemManagementComponent } from './features/product-Line-Item/line-item-management/line-item-management.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './Core/guards/auth.guard';

export const routes: Routes = [
    { path: 'product-line-item-list', component: ProductLineItemListComponent, canActivate: [authGuard] },
    { path: 'product-line-item-create', component: ProductLineItemCreateComponent, canActivate: [authGuard] },
    { path: 'product-line-item-edit', component: ProductLineItemEditComponent, canActivate: [authGuard] },
    { path: 'product-line-item-delete', component: ProductLineItemDeleteComponent, canActivate: [authGuard] },
    { path: 'product-list', component: ProductListComponent, canActivate: [authGuard] },
    { path: 'product-create', component: ProductCreateComponent, canActivate: [authGuard] },
    { path: 'product-delete', component: ProductDeleteComponent, canActivate: [authGuard] },
    { path: 'product-edit', component: ProductEditComponent, canActivate: [authGuard] },
    { path: 'category-list', component: CategoryListComponent, canActivate: [authGuard] },
    { path: 'category-create', component: CategoryCreateComponent, canActivate: [authGuard] },
    { path: 'category-edit', component: CategoryEditComponent, canActivate: [authGuard] },
    { path: 'category-delete', component: CategoryDeleteComponent, canActivate: [authGuard] },
    { path: 'product-management', component: ProductManagementComponent, canActivate: [authGuard] },
    { path: 'catalog', component: CatalogComponent, canActivate: [authGuard] },
    { path: 'category-management', component: CategoryManagementComponent, canActivate: [authGuard] },
    { path: 'product-line-item-management', component: LineItemManagementComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent }
];
