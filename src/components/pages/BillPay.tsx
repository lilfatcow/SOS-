import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet } from '@/components/ui/sheet';
import { BillScanner } from '@/components/slides/BillScanner';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { PayableResponse } from '@monite/sdk-api';

export function BillPay() {
  const [showNewBill, setShowNewBill] = useState(false);
  const [bills, setBills] = useState<PayableResponse[]>([]);
  const [editingBill, setEditingBill] = useState<PayableResponse | null>(null);

  const handleSaveDraft = (billData: PayableResponse) => {
    if (editingBill) {
      setBills(bills.map(bill => 
        bill.id === editingBill.id ? billData : bill
      ));
    } else {
      setBills([...bills, billData]);
    }
    setShowNewBill(false);
    setEditingBill(null);
  };

  const handleDelete = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  const handleTogglePaid = (id: string) => {
    setBills(bills.map(bill => 
      bill.id === id ? { ...bill, status: bill.status === 'paid' ? 'draft' : 'paid' } : bill
    ));
  };

  const handleEdit = (bill: PayableResponse) => {
    setEditingBill(bill);
    setShowNewBill(true);
  };

  return (
    <div className="px-8 py-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Bill Pay</h1>
          <Button onClick={() => {
            setEditingBill(null);
            setShowNewBill(true);
          }}>
            Add New Bill
          </Button>
        </div>

        {bills.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <h3 className="font-medium">No bills yet</h3>
              <p className="text-muted-foreground">Add your first bill to get started</p>
              <Button 
                className="mt-4"
                onClick={() => setShowNewBill(true)}
              >
                Add New Bill
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bills.map((bill) => (
              <Card key={bill.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{bill.counterpart_name || 'Unnamed Vendor'}</h3>
                    <p className="text-sm text-muted-foreground">
                      Bill #{bill.document_id} • Due {new Date(bill.due_date || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium">
                      ${bill.amount?.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={bill.status === 'paid' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTogglePaid(bill.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {bill.status === 'paid' ? "Paid" : "Mark as Paid"}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(bill)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Bill</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this bill? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(bill.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Sheet 
          open={showNewBill} 
          onOpenChange={(open) => {
            if (!open) {
              setEditingBill(null);
            }
            setShowNewBill(open);
          }}
        >
          <BillScanner
            initialData={editingBill || undefined}
            onSaveDraft={handleSaveDraft}
            onClose={() => {
              setShowNewBill(false);
              setEditingBill(null);
            }}
          />
        </Sheet>
      </div>
    </div>
  );
}