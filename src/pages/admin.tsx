import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useStore, type User } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Search, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";

const Admin = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<Partial<User>>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });
  
  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setCurrentUserData({
        ...user,
        password: "", // Don't show the password when editing
      });
      setIsEditing(true);
    } else {
      setCurrentUserData({
        id: "",
        name: "",
        email: "",
        password: "",
        role: "cashier",
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };
  
  const handleSaveUser = () => {
    try {
      if (!currentUserData.name || !currentUserData.email || (!isEditing && !currentUserData.password)) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      if (isEditing) {
        const updatedUser = {
          ...(users.find(u => u.id === currentUserData.id) as User),
          name: currentUserData.name as string,
          email: currentUserData.email as string,
          role: currentUserData.role as 'admin' | 'cashier',
        };
        
        // Only update password if a new one is provided
        if (currentUserData.password) {
          updatedUser.password = currentUserData.password;
        }
        
        updateUser(updatedUser);
        toast.success("User updated successfully");
      } else {
        const newUser: User = {
          id: uuidv4(),
          name: currentUserData.name as string,
          email: currentUserData.email as string,
          password: currentUserData.password as string,
          role: currentUserData.role as 'admin' | 'cashier',
          createdAt: new Date(),
        };
        
        addUser(newUser);
        toast.success("User added successfully");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };
  
  const handleDeleteUser = (id: string) => {
    // Prevent deleting yourself
    if (id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      toast.success("User deleted successfully");
    }
  };
  
  return (
    <AuthLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className={user.id === currentUser?.id ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.id === currentUser?.id}
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
      
      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentUserData.name}
                onChange={(e) => setCurrentUserData({ ...currentUserData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={currentUserData.email}
                onChange={(e) => setCurrentUserData({ ...currentUserData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                {isEditing ? "New Password" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                value={currentUserData.password}
                onChange={(e) => setCurrentUserData({ ...currentUserData, password: e.target.value })}
                className="col-span-3"
                placeholder={isEditing ? "(leave blank to keep current)" : ""}
                required={!isEditing}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={currentUserData.role}
                onValueChange={(value: 'admin' | 'cashier') => 
                  setCurrentUserData({ ...currentUserData, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              {isEditing ? "Update" : "Add"} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
};

export default Admin;