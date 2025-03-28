import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { products, transactions } = useStore();
  
  // Calculate total sales
  const totalSales = transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
  
  // Calculate total products sold
  const totalProductsSold = transactions.reduce(
    (sum, transaction) => sum + transaction.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 
    0
  );
  
  // Get low stock products (less than 10 items)
  const lowStockProducts = products.filter(product => product.stockQuantity < 10);
  
  // Get sales data for chart (last 7 transactions)
  const salesData = transactions
    .slice(0, 7)
    .map(transaction => ({
      id: transaction.id,
      amount: transaction.totalAmount,
      date: new Date(transaction.timestamp).toLocaleDateString(),
    }))
    .reverse();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime sales amount
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProductsSold}</div>
              <p className="text-xs text-muted-foreground">
                Total items sold
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Total products in inventory
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                Total completed sales
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No sales data available
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                        product.stockQuantity <= 5 ? 'bg-destructive text-destructive-foreground' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {product.stockQuantity} left
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  All products have sufficient stock
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;