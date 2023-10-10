import { Component, OnDestroy, ViewChild } from '@angular/core';
import { LoanProduct2, ProductService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Table } from 'primeng/table';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'mbp-product-table',
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent implements OnDestroy {
  // Getting the table ref for use with the global filter function
  @ViewChild('productTable') productTable!: Table;

  products?: LoanProduct2[] = [];
  onDestroy$ = new Subject();
  loading = true;
  pageSize = 10;
  totalRecords!: number;
  selectedProducts: LoanProduct2[] = [];

  showInitialRate = true;
  showTerm = true;
  showProductFee = true;
  showEarlyRepaymentCharge = true;
  showRepaymentType = true;
  showInterestRateType = true;
  showAPRC = true;
  showFeatures = true;

  constructor(private productService: ProductService) {}

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  // Global filter for all table values
  applyFilterGlobal($event: Event, stringVal: string) {
    this.productTable.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  loadProducts() {
    this.loading = true;
    this.productService
      .productGetProducts(500000, 10, 0, '', 0.8)
      .pipe(
        takeUntil(this.onDestroy$),
        finalize(() => (this.loading = false)),
      )
      .subscribe((products: LoanProduct2[]) => {
        this.totalRecords = products.length;
        this.products = products;
      });
  }

  selectProduct(e: any, selected: boolean) {
    e.originalEvent.stopPropagation();
    selected
      ? this.selectedProducts.push(e.data)
      : (this.selectedProducts = this.selectedProducts.filter(el => el.productCode !== e.data.productCode));
  }
}
