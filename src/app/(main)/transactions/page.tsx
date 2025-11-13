import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { FileUploadZone } from "@/components/transactions/FileUploadZone";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <FileUploadZone />
      
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>View and manage your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionTable />
        </CardContent>
      </Card>
    </div>
  );
}
