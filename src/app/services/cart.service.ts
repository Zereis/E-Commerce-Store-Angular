import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // BehaviorSubject to provide an observable stream of the current cart state
  cart = new BehaviorSubject<Cart>({ items: [] });

  // Inject MatSnackBar for displaying notifications
  constructor(private _snackBar: MatSnackBar) {}

  // Method to add an item to the cart
  addToCart(item: CartItem): void {
    // Clone the current items array to avoid modifying the original array
    const items = [...this.cart.value.items];

    // Check if the item is already in the cart
    const itemInCart = items.find((_item) => _item.id === item.id);
    
    if (itemInCart) {
      // If the item is already in the cart, increment its quantity
      itemInCart.quantity += 1;
    } else {
      // If the item is not in the cart, add it to the items array
      items.push(item);
    }

    // Update the cart state with the new items array
    this.cart.next({ items });

    // Display a snack bar notification
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
  }

  // Method to remove an item from the cart
  removeFromCart(item: CartItem, updateCart = true): CartItem[] {
    // Filter out the specified item from the items array
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (updateCart) {
      // Update the cart state with the new items array
      this.cart.next({ items: filteredItems });
      
      // Display a snack bar notification
      this._snackBar.open('1 item removed from cart.', 'Ok', {
        duration: 3000,
      });
    }

    return filteredItems;
  }

  // Method to remove a quantity of an item from the cart
  removeQuantity(item: CartItem): void {
    let itemForRemoval!: CartItem;

    // Map over the items array to update the quantity of the specified item
    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;

        // If the quantity becomes zero, mark the item for removal
        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }

      return _item;
    });

    // If an item was marked for removal, call removeFromCart to handle it
    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    // Update the cart state with the new items array
    this.cart.next({ items: filteredItems });

    // Display a snack bar notification
    this._snackBar.open('1 item removed from cart.', 'Ok', {
      duration: 3000,
    });
  }

  // Method to clear the entire cart
  clearCart(): void {
    // Update the cart state with an empty items array
    this.cart.next({ items: [] });

    // Display a snack bar notification
    this._snackBar.open('Cart is cleared.', 'Ok', {
      duration: 3000,
    });
  }

  // Method to calculate the total cost of items in the cart
  getTotal(items: CartItem[]): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }
}
