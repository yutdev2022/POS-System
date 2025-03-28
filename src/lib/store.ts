import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stockQuantity: number;
  barcode: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Transaction = {
  id: string;
  timestamp: Date;
  totalAmount: number;
  paymentMethod: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    priceAtTimeOfSale: number;
  }>;
};

type POSState = {
  products: Product[];
  cart: CartItem[];
  transactions: Transaction[];
  
  // Product actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Transaction actions
  completeTransaction: (paymentMethod: string) => void;
};

export const useStore = create<POSState>()(
  persist(
    (set, get) => ({
      products: [
        {
          id: '1',
          name: 'Coffee',
          price: 3.99,
          category: 'Beverages',
          description: 'Fresh brewed coffee',
          image: '/images/coffee.jpg',
          stockQuantity: 100,
          barcode: '123456789',
        },
        {
          id: '2',
          name: 'Sandwich',
          price: 5.99,
          category: 'Food',
          description: 'Chicken sandwich',
          image: '/images/sandwich.jpg',
          stockQuantity: 20,
          barcode: '987654321',
        },
        {
          id: '3',
          name: 'Muffin',
          price: 2.99,
          category: 'Bakery',
          description: 'Blueberry muffin',
          image: '/images/muffin.jpg',
          stockQuantity: 30,
          barcode: '456789123',
        },
        {
          id: '4',
          name: 'Tea',
          price: 2.49,
          category: 'Beverages',
          description: 'Herbal tea',
          image: '/images/tea.jpg',
          stockQuantity: 80,
          barcode: '789123456',
        },
        {
          id: '5',
          name: 'Salad',
          price: 6.99,
          category: 'Food',
          description: 'Fresh garden salad',
          image: '/images/salad.jpg',
          stockQuantity: 15,
          barcode: '321654987',
        },
      ],
      cart: [],
      transactions: [],
      
      addProduct: (product) => 
        set((state) => ({ 
          products: [...state.products, product] 
        })),
      
      updateProduct: (updatedProduct) => 
        set((state) => ({ 
          products: state.products.map(product => 
            product.id === updatedProduct.id ? updatedProduct : product
          ) 
        })),
      
      deleteProduct: (productId) => 
        set((state) => ({ 
          products: state.products.filter(product => product.id !== productId) 
        })),
      
      addToCart: (product, quantity = 1) => 
        set((state) => {
          const existingItem = state.cart.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              cart: state.cart.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity } 
                  : item
              )
            };
          }
          
          return {
            cart: [...state.cart, { product, quantity }]
          };
        }),
      
      updateCartItemQuantity: (productId, quantity) => 
        set((state) => ({
          cart: state.cart.map(item => 
            item.product.id === productId 
              ? { ...item, quantity } 
              : item
          ).filter(item => item.quantity > 0)
        })),
      
      removeFromCart: (productId) => 
        set((state) => ({
          cart: state.cart.filter(item => item.product.id !== productId)
        })),
      
      clearCart: () => set({ cart: [] }),
      
      completeTransaction: (paymentMethod) => {
        const { cart, transactions } = get();
        
        if (cart.length === 0) return;
        
        const totalAmount = cart.reduce(
          (sum, item) => sum + item.product.price * item.quantity, 
          0
        );
        
        const newTransaction: Transaction = {
          id: `tr-${Date.now()}`,
          timestamp: new Date(),
          totalAmount,
          paymentMethod,
          items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            priceAtTimeOfSale: item.product.price,
          })),
        };
        
        set({
          transactions: [newTransaction, ...transactions],
          cart: [],
        });
        
        // Update product stock quantities
        set((state) => ({
          products: state.products.map(product => {
            const cartItem = cart.find(item => item.product.id === product.id);
            if (cartItem) {
              return {
                ...product,
                stockQuantity: Math.max(0, product.stockQuantity - cartItem.quantity)
              };
            }
            return product;
          })
        }));
      },
    }),
    {
      name: 'pos-storage',
    }
  )
);