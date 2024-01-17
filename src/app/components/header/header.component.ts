// Import necessary modules and classes from Angular core and other custom files
import { Component, Input } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

// Define the component metadata, including selector and template
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  // Private property to store the cart information
  private _cart: Cart = { items: [] };

  // Public property to store the total quantity of items in the cart for display in the header
  itemsQuantity = 0;

  // Input property decorated with @Input(), allowing a parent component to bind a Cart object to this component
  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    // Update the private _cart property with the provided Cart object
    this._cart = cart;

    // Calculate the total quantity of items in the cart and update the itemsQuantity property
    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  // Constructor for the HeaderComponent, injecting the CartService
  constructor(private cartService: CartService) {}

  // Method to get the total cost of items in the cart using the CartService
  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  // Method to clear all items from the cart using the CartService
  onClearCart(): void {
    this.cartService.clearCart();
  }
}
