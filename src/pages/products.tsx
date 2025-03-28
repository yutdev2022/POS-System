import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useStore, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    stockQuantity: 0,
    barcode: "",
  });
  
  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );
  
  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({
        id: "",
        name: "",
        price: 0,
        category: "",
        description: "",
        image: "",
        stockQuantity: 0,
        barcode: "",
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };
  
  const handleSaveProduct = () => {
    try {
      if (!currentProduct.name || !currentProduct.category) {
        toast.error("Name and category are required");
        return;
      }
      
      if (currentProduct.price <= 0) {
        toast.error("Price must be greater than zero");
        return;
      }
      
      if (currentProduct.stockQuantity < 0) {
        toast.error("Stock quantity cannot be negative");
        return;
      }
      
      if (isEditing) {
        updateProduct(currentProduct);
        toast.success("Product updated successfully");
      } else {
        const newProduct = {
          ...currentProduct,
          id: uuidv4(),
          barcode: currentProduct.barcode || uuidv4().substring(0, 10),
        };
        addProduct(newProduct);
        toast.success("Product added successfully");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };
  
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      toast.success("Product deleted successfully");
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={product.stockQuantity <= 5 ? "text-destructive" : ""}>
                        {product.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={currentProduct.category}
                onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={currentProduct.stockQuantity}
                onChange={(e) => setCurrentProduct({ ...currentProduct, stockQuantity: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barcode" className="text-right">
                Barcode
              </Label>
              <Input
                id="barcode"
                value={currentProduct.barcode}
                onChange={(e) => setCurrentProduct({ ...currentProduct, barcode: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={currentProduct.image}
                onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={currentProduct.description}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {isEditing ? "Update" : "Add"} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Products;