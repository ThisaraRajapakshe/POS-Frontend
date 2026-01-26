import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { Category } from '../../models';
import { CategoryService } from '../../services';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';
import { CategoryTableComponent } from './category-table/category-table.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardWrapperComponent } from '../../../../shared/Components/card-wrapper/card-wrapper.component';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog.component';
import { SearchBarComponent } from '../../../../shared/Components/search-bar/search-bar.component';

@Component({
  selector: 'pos-category-management',
  imports: [CategoryTableComponent, CardWrapperComponent, MatButtonModule, MatButton, MatDialogModule, SearchBarComponent],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  categories: WritableSignal<Category[]> = signal([]);
  private allCategories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }
  
  openAddCategory() {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      data: { mode: 'create' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Category created successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.loadCategories();
          },
          error: (error) => {
            this.snackBar.open('Failed to create category', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
            console.error('Error creating category:', error);
          }
        });
      }
    });
  }


  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.allCategories = data;
      },
      error: (error) => {
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        console.error('Error loading categories:', error);
      }
    });
  }

  openEditCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      data: { mode: 'edit', category },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.categoryService.update(category.id, result).subscribe({
            next: () => {
              this.loadCategories();
              this.snackBar.open('Category updated successfully', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-success']
              });
            },
            error: (error) => {
              this.snackBar.open('Failed to update category', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error'],
              });
              console.error('Error updating category:', error);
            }
          });
        }
      }
    });
  }
  confirmDelete(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete this category "${category.name}"?`, title: 'Confirm Deletion', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.categoryService.delete(category.id).subscribe(() => {
            this.loadCategories();
            this.snackBar.open('Category deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to delete category', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        console.error('Error deleting category:', error);
      }
    });
  }

  // Search Functionality
  onSearchCategories(searchTerm: string){
    if(!searchTerm || searchTerm.trim() === ''){
      this.categories.set(this.allCategories);
      return;
    }

    // Normalize text for case-insensitive search
    const lowerTerm = searchTerm.toLowerCase();

    // Filter the Master Backup
    const filtered = this.allCategories.filter(p => 
      p.name.toLowerCase().includes(lowerTerm)
    );

    // Update the displayed list
    this.categories.set(filtered);
  }
}
