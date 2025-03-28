import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, Search, ShoppingCart, Trash2, X, Package } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const POS = () => {
  const { products, cart, addToCart, updateCartItemQuantity, removeFromCart, clearCart, completeTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.barcode.includes(searchTerm);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Handle checkout
  const handleCheckout = () => {
    completeTransaction(paymentMethod);
    setCheckoutOpen(false);
    toast.success("Transaction completed successfully!");
  };
  
  return (
    <AuthLayout>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Point of Sale</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => clearCart()}
              disabled={cart.length === 0}
            >
              Clear Cart
            </Button>
            <Button 
              onClick={() => setCheckoutOpen(true)}
              disabled={cart.length === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Checkout (${cartTotal.toFixed(2)})
            </Button>
          </div>
        </div>
        
        <div className="flex flex-1 gap-6 h-[calc(100vh-12rem)] overflow-hidden">
          {/* Products Section */}
          <div className="w-2/3 flex flex-col">
            <div className="mb-4 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or scan barcode..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <TabsList className="mb-4">
                <TabsTrigger value="all" onClick={() => setSelectedCategory(null)}>
                  All
                </TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => addToCart(product)}
                    >
                      <CardContent className="p-4 flex flex-col items-center">
                        <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-full w-full object-cover rounded-md"
                            />
                          ) : (
                            <Package className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                        <div className="w-full text-center">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-muted-foreground text-sm">${product.price.toFixed(2)}</p>
                          <p className="text-xs mt-1">
                            {product.stockQuantity > 0 ? (
                              <span className={product.stockQuantity < 10 ? "text-amber-500" : ""}>
                                {product.stockQuantity} in stock
                              </span>
                            ) : (
                              <span className="text-destructive">Out of stock</span>
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {categories.map(category => (
                <TabsContent key={category} value={category} className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                      <Card 
                        key={product.id} 
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => addToCart(product)}
                      >
                        <CardContent className="p-4 flex flex-col items-center">
                          <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="h-full w-full object-cover rounded-md"
                              />
                            ) : (
                              <Package className="h-12 w-12 text-muted-foreground" />
                            )}
                          </div>
                          <div className="w-full text-center">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-muted-foreground text-sm">${product.price.toFixed(2)}</p>
                            <p className="text-xs mt-1">
                              {product.stockQuantity > 0 ? (
                                <span className={product.stockQuantity < 10 ? "text-amber-500" : ""}>
                                  {product.stockQuantity} in stock
                                </span>
                              ) : (
                                <span className="text-destructive">Out of stock</span>
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Cart Section */}
          <div className="w-1/3 flex flex-col border rounded-lg">
            <div className="p-4 border-b bg-muted">
              <h2 className="text-lg font-medium flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Current Order
              </h2>
            </div>
            
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-2" />
                <p>Your cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t bg-muted">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Transaction</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="font-medium mb-2">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile">Mobile Payment</Label>
              </div>
            </RadioGroup>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.quantity} × {item.product.name}</span>
                    <span>${(item.quantity * item.product.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleCheckout}>
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
};

export default POS;