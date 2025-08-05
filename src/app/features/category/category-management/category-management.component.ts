import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../Core/models/Domains/category.model';
import { CategoryService } from '../../../Core/services/category-service.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog.component';
import { CategoryTableComponent } from './category-table/category-table.component';
import { CardWrapperComponent } from '../../../shared/Components/card-wrapper/card-wrapper.component';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pos-category-management',
  imports: [CategoryTableComponent, CardWrapperComponent, MatButtonModule, MatButton, MatDialogModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent implements OnInit {
  categories$!: Observable<Category[]>;
  constructor(private categoryService: CategoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAll();
  }
  openAddCategory() {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      data: { mode: 'create' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.create(result).subscribe(() => {
          this.categories$ = this.categoryService.getAll();
        });
      }
    });
  }
  openEditCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      data: { mode: 'edit', category },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.update(category.id, result).subscribe(() => {
          this.categories$ = this.categoryService.getAll();
        });
      }
    });
  }
  confirmDelete(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete this category "${category.name}"?`, title: 'Confirm Deletion', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.delete(category.id).subscribe(() => {
          this.categories$ = this.categoryService.getAll();
        });
      }
    });
  }
}
