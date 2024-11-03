import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

export function Profile() {
  return (
    <div className="px-8 py-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium">Profile</h1>
          <Button variant="outline">Edit Profile</Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">ME</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">Mitch Eisner</h2>
                <p className="text-muted-foreground">CEO & Founder at Wonderland Studio</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    mitch@wonderland.studio
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    +1 (555) 123-4567
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Los Angeles, CA
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                    wonderland.studio
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity & Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Payments</h3>
              <p className="text-2xl font-semibold mt-1">$124,500.00</p>
              <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Active Bills</h3>
              <p className="text-2xl font-semibold mt-1">12</p>
              <p className="text-sm text-muted-foreground mt-1">4 pending approval</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Payment Methods</h3>
              <p className="text-2xl font-semibold mt-1">3</p>
              <p className="text-sm text-muted-foreground mt-1">2 bank accounts</p>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  action: "Approved payment",
                  details: "Invoice #1234 for $5,000.00",
                  date: "2 hours ago"
                },
                {
                  action: "Added new bank account",
                  details: "Chase Business Checking ****4567",
                  date: "Yesterday"
                },
                {
                  action: "Updated profile information",
                  details: "Changed phone number",
                  date: "3 days ago"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}