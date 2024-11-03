import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Lock, User, CreditCard, Building2, Globe } from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    payments: true,
    marketing: false
  });

  return (
    <div className="px-8 py-6">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-xl font-medium mb-6">Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Profile Settings</h2>
              <div className="space-y-4 max-w-lg">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Mitch Eisner" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="mitch@wonderland.studio" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about payment updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.payments}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, payments: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Security Settings</h2>
              <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Billing Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/24</p>
                    </div>
                    <Button variant="outline" className="ml-auto">
                      Update
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Billing Address</Label>
                  <div className="p-4 border rounded-lg">
                    <p>123 Business Street</p>
                    <p>Suite 100</p>
                    <p>Los Angeles, CA 90012</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Company Information</h2>
              <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue="Wonderland Studio" />
                </div>
                <div className="space-y-2">
                  <Label>Tax ID / EIN</Label>
                  <Input defaultValue="XX-XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input defaultValue="Entertainment & Media" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}