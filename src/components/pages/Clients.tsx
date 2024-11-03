import { useState, useEffect } from 'react';
import { useCounterparts } from '@/hooks/useCounterparts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CounterpartForm } from '@/components/counterparts/CounterpartForm';
import { Plus, Search, MoreVertical, Building2, User } from 'lucide-react';
import type { CounterpartResponse } from '@monite/sdk-api';

export function Clients() {
  const { list, remove, loading } = useCounterparts();
  const [counterparts, setCounterparts] = useState<CounterpartResponse[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCounterpart, setEditingCounterpart] = useState<CounterpartResponse | null>(null);

  useEffect(() => {
    loadCounterparts();
  }, []);

  const loadCounterparts = async () => {
    const data = await list();
    setCounterparts(data);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this contact?');
    if (confirmed) {
      const success = await remove(id);
      if (success) {
        setCounterparts(counterparts.filter(c => c.id !== id));
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setEditingCounterpart(null);
    loadCounterparts();
  };

  const filteredCounterparts = counterparts.filter(counterpart => {
    const searchLower = searchQuery.toLowerCase();
    const name = counterpart.type === 'organization' 
      ? counterpart.organization?.name 
      : `${counterpart.individual?.first_name} ${counterpart.individual?.last_name}`;
    return name?.toLowerCase().includes(searchLower) ||
           counterpart.email?.toLowerCase().includes(searchLower);
  });

  return (
    <div className="px-8 py-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium">Clients & Vendors</h1>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredCounterparts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              {searchQuery ? (
                <>
                  <p className="text-muted-foreground">No contacts found matching "{searchQuery}"</p>
                  <Button variant="link" onClick={() => setSearchQuery('')}>
                    Clear search
                  </Button>
                </>
              ) : (
                <>
                  <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No contacts yet</h3>
                  <p className="text-muted-foreground">Add your first client or vendor to get started</p>
                  <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                    Add Contact
                  </Button>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCounterparts.map((counterpart) => {
              const name = counterpart.type === 'organization'
                ? counterpart.organization?.name
                : `${counterpart.individual?.first_name} ${counterpart.individual?.last_name}`;

              return (
                <Card key={counterpart.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {counterpart.type === 'organization' ? (
                          <Building2 className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">
                          {counterpart.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingCounterpart(counterpart)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(counterpart.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog 
          open={showAddForm || !!editingCounterpart} 
          onOpenChange={(open) => {
            if (!open) {
              setShowAddForm(false);
              setEditingCounterpart(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCounterpart ? 'Edit Contact' : 'Add New Contact'}
              </DialogTitle>
            </DialogHeader>
            <CounterpartForm
              initialData={editingCounterpart || undefined}
              onSuccess={handleAddSuccess}
              onCancel={() => {
                setShowAddForm(false);
                setEditingCounterpart(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}