import { Component } from '@angular/core';
import { CardWrapperComponent } from '../../../shared/Components/card-wrapper/card-wrapper.component';
import { Observable } from 'rxjs';
import { ProductLineItem } from '../../../Core/models/Domains/product-line-item.model';
import { ProductLineItemService } from '../../../Core/services/product-line-item.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog.component';
import { LineItemFormDialogComponent } from './line-item-form-dialog/line-item-form-dialog.component';
import { LineItemTableComponent } from './line-item-table/line-item-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pos-line-item-management',
  imports: [CardWrapperComponent, LineItemTableComponent, MatTableModule, MatButtonModule],
  templateUrl: './line-item-management.component.html',
  styleUrl: './line-item-management.component.scss'
})
export class LineItemManagementComponent {
  lineItems$!: Observable<ProductLineItem[]>;

  constructor(private dialog: MatDialog, private lineItemService: ProductLineItemService) {}

  ngOnInit(): void {
    this.lineItems$ = this.lineItemService.getAll();
  }
  onAdd() {
    const dialogRef = this.dialog.open(LineItemFormDialogComponent, {
      data: { mode: 'create' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lineItemService.create(result).subscribe(() => {
          this.lineItems$ = this.lineItemService.getAll();
        });
      }
    });
  }
  onEdit(lineItem: ProductLineItem) {
    const dialogRef = this.dialog.open(LineItemFormDialogComponent, {
      data: { mode: 'edit', lineItem },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lineItemService.update(lineItem.id, result).subscribe(() => {
          this.lineItems$ = this.lineItemService.getAll();
        });
      }
    });
  }
  onDelete(lineItem: ProductLineItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete this line item "${lineItem.id}"?`, title: 'Confirm Deletion', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lineItemService.delete(lineItem.id).subscribe(() => {
          this.lineItems$ = this.lineItemService.getAll();
        });
      }
    });
  }
}
