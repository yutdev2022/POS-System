import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const Settings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="low-stock">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when products are running low
                  </p>
                </div>
                <Switch id="low-stock" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sales-summary">Daily Sales Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily summary of sales
                  </p>
                </div>
                <Switch id="sales-summary" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>
                Configure how receipts are generated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="print-receipt">Auto-Print Receipts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically print receipts after each sale
                  </p>
                </div>
                <Switch id="print-receipt" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-receipt">Email Receipts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send receipts via email when available
                  </p>
                </div>
                <Switch id="email-receipt" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Settings</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;