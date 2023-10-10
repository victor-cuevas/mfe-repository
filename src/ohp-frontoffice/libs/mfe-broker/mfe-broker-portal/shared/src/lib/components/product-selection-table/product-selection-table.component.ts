import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FeLoanProduct } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { LoanProduct2, ProductService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'mbp-product-selection-table',
  templateUrl: './product-selection-table.component.html',
})
export class ProductSelectionTableComponent implements OnInit {
  @ViewChild('table') table!: Table;
  products: FeLoanProduct[] = [];
  selectedProduct?: FeLoanProduct;
  loading = true;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private productService: ProductService) {}

  ngOnInit() {
    this.productService
      .productGetProducts(
        this.config.data?.loanAmount,
        this.config.data?.tomYears,
        this.config.data?.tomMonths,
        this.config.data?.productType,
        this.config.data?.ltv * 100,
        this.config.data?.purchasePrice,
      )
      .pipe(
        map((products: LoanProduct2[]) => {
          // TODO: line below can be changed for "products" as soon as we get a stable response without duplicates from BFF
          return [...new Set(products.map(product => JSON.stringify(product)))]
            .map(stringProduct => JSON.parse(stringProduct))
            .map((product, index) => {
              if (
                `${product.initialRate}${product.productCode}` ===
                `${this.config.data.currentProduct.interestRate}${this.config.data.currentProduct.code}`
              ) {
                this.selectedProduct = { ...product, key: `${product.initialRate}${product.productCode}` };
                setTimeout(() => this.table.scrollToVirtualIndex(index ? index - 1 : index));
              }
              return {
                ...product,
                key: `${product.initialRate}${product.productCode}`,
              };
            });
        }),
      )
      .subscribe(products => {
        this.products = products;
        this.loading = false;
      });
  }
  /**
   * Closes the dialog and if there is a selected product emits it to the parent as an observable
   *
   * @param product
   */
  public closeDialog(product?: LoanProduct2): void {
    this.ref.close(product);
  }
}
