import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {
  // Properties to store cart information and table display configuration
  cart: Cart = { items: [] };
  displayedColumns: string[] = ['product', 'name', 'price', 'quantity', 'total', 'action'];
  dataSource: CartItem[] = [];

  // Subscription to the cart service to track changes in the cart
  cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    // Subscribe to changes in the cart using the CartService
    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = _cart.items;
    });
  }

  // Method to calculate the total cost of items in the cart using the CartService
  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  // Methods to interact with the CartService for modifying cart items
  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  // Method to clear the entire cart using the CartService
  onClearCart(): void {
    this.cartService.clearCart();
  }

  // Method to initiate the checkout process by making a POST request to the server
  onCheckout(): void {
    this.http
      .post('http://localhost:4242/checkout', {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        // Use Stripe to redirect to the checkout page
        let stripe = await loadStripe('your token');
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }

  // Cleanup method to unsubscribe from the cart service when the component is destroyed
  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
