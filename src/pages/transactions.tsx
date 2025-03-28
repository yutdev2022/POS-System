import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useStore, type Transaction } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, FileText } from "lucide-react";
import { format } from "date-fns";

const Transactions = () => {
  const { transactions } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction => 
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.cashierName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };
  
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transactions</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
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
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{format(new Date(transaction.timestamp), "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell>{transaction.cashierName}</TableCell>
                    <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                    <TableCell className="text-right">${transaction.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Transaction Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Transaction ID</span>
                  <span>{selectedTransaction.id}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Date & Time</span>
                  <span>{format(new Date(selectedTransaction.timestamp), "MMM d, yyyy h:mm a")}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Cashier</span>
                  <span>{selectedTransaction.cashierName}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Payment Method</span>
                  <span className="capitalize">{selectedTransaction.paymentMethod}</span>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedTransaction.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity} × {item.productName}</span>
                        <span>${(item.quantity * item.priceAtTimeOfSale).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${selectedTransaction.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
};

export default Transactions;