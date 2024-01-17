import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

// Define row heights based on the number of columns
const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Initial number of columns and row height
  cols = 3;
  rowHeight: number = ROWS_HEIGHT[this.cols];

  // Array to store products and default values for items count, sorting, and category
  products: Array<Product> | undefined;
  count = '12';
  sort = 'desc';
  category: string | undefined;

  // Subscription to products updates
  productsSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    // Initial loading of products when the component is initialized
    this.getProducts();
  }

  // Method to handle changes in the number of columns
  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[colsNum];
  }

  // Method to handle changes in the items count
  onItemsCountChange(count: number): void {
    this.count = count.toString();
    this.getProducts();
  }

  // Method to handle changes in sorting
  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  // Method to handle changes in the selected category
  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  // Method to fetch products based on the specified criteria
  getProducts(): void {
    this.productsSubscription = this.storeService
      .getAllProducts(this.count, this.sort, this.category)
      .subscribe((_products) => {
        this.products = _products;
      });
  }

  // Method to add a product to the shopping cart
  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  // Cleanup method to unsubscribe from the products subscription when the component is destroyed
  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
}
