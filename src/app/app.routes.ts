import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './Core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
    // Public Routes
    {path: 'login', component: LoginComponent},
    // Private Routes
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],// Guards everything inside
        children: [
            { path: '', redirectTo: 'catalog', pathMatch: 'full' },

            { path: 'catalog', loadComponent: () => import('./features/catalog/components/catalog-dashboard/catalog.component')
                .then(m => m.CatalogComponent) },

            { path: 'product-management',
                 loadComponent: () => import ('./features/catalog/components/product-management/product-management.component')
                .then(m => m.ProductManagementComponent) },
            { path: 'category-management',
                 loadComponent: () => import ('./features/catalog/components/category-management/category-management.component')
                .then(m => m.CategoryManagementComponent) },
            { path: 'product-line-item-management',
                 loadComponent: () => import ('./features/catalog/components/line-item-management/line-item-management.component')
                .then(m => m.LineItemManagementComponent) },
        ]
    },
    //Catch all 404
    {path: '**', redirectTo: 'login', pathMatch: 'full'}
];
