import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Settings, 
  Ban, 
  CheckCircle, 
  UserCheck, 
  Download, 
  FileText, 
  Send, 
  Clock,
  Shield,
  AlertTriangle,
  User
} from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

interface PendingTransaction {
  id: string;
  transactionId: string;
  accountId: string;
  customerName: string;
  amount: number;
  type: string;
  riskScore: number;
  flaggedReason: string;
  timestamp: Date;
  assignedTo?: string;
}

interface CaseAssignment {
  id: string;
  transactionId: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'assigned' | 'in_progress' | 'completed';
  notes: string;
  dueDate: Date;
}

interface AdminActionsProps {
  userRole: string;
}

const generatePendingTransactions = (): PendingTransaction[] => {
  const customers = ['John Smith', 'Maria Garcia', 'Ahmed Hassan', 'Li Wei', 'Sarah Johnson'];
  const types = ['Wire Transfer', 'ATM Withdrawal', 'Online Purchase', 'Mobile Transfer'];
  const reasons = ['High amount', 'Unusual location', 'Velocity check', 'Device mismatch'];

  return Array.from({ length: 8 }, (_, i) => ({
    id: `pending-${i + 1}`,
    transactionId: `TXN${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    accountId: `AC${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    customerName: customers[Math.floor(Math.random() * customers.length)],
    amount: Math.floor(Math.random() * 500000) + 50000,
    type: types[Math.floor(Math.random() * types.length)],
    riskScore: 60 + Math.floor(Math.random() * 40),
    flaggedReason: reasons[Math.floor(Math.random() * reasons.length)],
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    assignedTo: Math.random() > 0.5 ? 'John Analyst' : undefined
  }));
};

export default function AdminActions({ userRole }: AdminActionsProps) {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<PendingTransaction | null>(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportTimeframe, setReportTimeframe] = useState('');

  useEffect(() => {
    setPendingTransactions(generatePendingTransactions());
  }, []);

  const handleTransactionAction = (transactionId: string, action: 'approve' | 'block') => {
    setPendingTransactions(prev => prev.filter(t => t.id !== transactionId));
    // In a real app, this would make an API call
  };

  const handleAssignCase = () => {
    if (selectedTransaction && assignTo) {
      setPendingTransactions(prev => prev.map(t => 
        t.id === selectedTransaction.id 
          ? { ...t, assignedTo: assignTo }
          : t
      ));
      setSelectedTransaction(null);
      setAssignTo('');
      setAssignmentNotes('');
    }
  };

  const generateReport = () => {
    const reportData = {
      reportType,
      timeframe: reportTimeframe,
      generatedAt: new Date().toISOString(),
      summary: {
        totalTransactions: pendingTransactions.length,
        pendingCases: pendingTransactions.filter(t => t.status === 'pending').length,
        approvedTransactions: pendingTransactions.filter(t => t.status === 'approved').length,
        blockedTransactions: pendingTransactions.filter(t => t.status === 'blocked').length
      },
      transactions: pendingTransactions.map(t => ({
        id: t.id,
        amount: t.amount,
        fromAccount: t.fromAccount,
        toAccount: t.toAccount,
        type: t.type,
        riskLevel: t.riskLevel,
        status: t.status,
        timestamp: t.timestamp.toISOString(),
        assignedTo: t.assignedTo || 'Unassigned'
      }))
    };

    const filename = `admin-${reportType}-report-${new Date().toISOString().split('T')[0]}`;
    
    if (reportType === 'transaction-summary' || reportType === 'user-activity') {
      // Tabular data works well in Excel
      exportToExcel(reportData.transactions, filename, `${reportType} Data`);
    } else {
      // Compliance and other reports work well as PDF
      exportToPDF(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, reportData, filename);
    }
  };

  const isAdmin = userRole === 'bank-manager';
  const canAssignCases = isAdmin || userRole === 'fraud-analyst';

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Limited admin access based on your role: {userRole}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <span>Admin Actions Panel</span>
          </CardTitle>
          <CardDescription>
            Transaction management and administrative controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Pending Transactions</TabsTrigger>
              <TabsTrigger value="assignments">Case Assignments</TabsTrigger>
              <TabsTrigger value="reports">Generate Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Transactions List */}
                <div className="space-y-3">
                  <h4 className="font-medium">Transactions Awaiting Review</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pendingTransactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTransaction?.id === transaction.id ? 'bg-accent' : 'bg-card/50 hover:bg-card/80'
                        }`}
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-sm">{transaction.transactionId}</div>
                            <div className="text-xs text-muted-foreground">{transaction.customerName}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={transaction.riskScore > 80 ? 'destructive' : 'secondary'}>
                              Risk: {transaction.riskScore}%
                            </Badge>
                            {transaction.assignedTo && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Assigned to: {transaction.assignedTo}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Amount:</span> ₹{transaction.amount.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Type:</span> {transaction.type}
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Reason:</span> {transaction.flaggedReason}
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          {transaction.timestamp.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transaction Actions */}
                <div>
                  <h4 className="font-medium mb-3">Transaction Actions</h4>
                  {selectedTransaction ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-card border rounded-lg">
                        <h5 className="font-medium mb-3">Transaction Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground">ID:</span>
                              <div className="font-medium">{selectedTransaction.transactionId}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Account:</span>
                              <div className="font-medium">{selectedTransaction.accountId}</div>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Customer:</span>
                            <div className="font-medium">{selectedTransaction.customerName}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <div className="font-medium">₹{selectedTransaction.amount.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Risk Score:</span>
                              <div className="font-medium">{selectedTransaction.riskScore}%</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="default" 
                            onClick={() => handleTransactionAction(selectedTransaction.id, 'approve')}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve Transaction
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleTransactionAction(selectedTransaction.id, 'block')}
                            className="flex-1"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Block Transaction
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground bg-card border rounded-lg">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a transaction to view details and take actions</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              {selectedTransaction && canAssignCases ? (
                <div className="p-4 bg-card border rounded-lg">
                  <h4 className="font-medium mb-4">Assign Case to Analyst</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="assignTo">Assign To</Label>
                      <Select value={assignTo} onValueChange={setAssignTo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select analyst" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john.analyst">John Analyst</SelectItem>
                          <SelectItem value="sarah.investigator">Sarah Investigator</SelectItem>
                          <SelectItem value="mike.specialist">Mike Specialist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes">Assignment Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any special instructions or context..."
                        value={assignmentNotes}
                        onChange={(e) => setAssignmentNotes(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleAssignCase} disabled={!assignTo}>
                      <UserCheck className="h-4 w-4 mr-1" />
                      Assign Case
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground bg-card border rounded-lg">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {!canAssignCases 
                      ? "You don't have permission to assign cases" 
                      : "Select a transaction to assign to an analyst"
                    }
                  </p>
                </div>
              )}

              {/* Active Assignments */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Active Case Assignments</h4>
                <div className="space-y-2">
                  {pendingTransactions.filter(t => t.assignedTo).map((transaction) => (
                    <div key={transaction.id} className="p-3 bg-card border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{transaction.transactionId}</div>
                          <div className="text-xs text-muted-foreground">{transaction.customerName}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            <User className="h-3 w-3 mr-1" />
                            {transaction.assignedTo}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Risk: {transaction.riskScore}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="p-4 bg-card border rounded-lg">
                <h4 className="font-medium mb-4">Generate Compliance Reports</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fraud-summary">Fraud Detection Summary</SelectItem>
                        <SelectItem value="compliance-audit">Compliance Audit Report</SelectItem>
                        <SelectItem value="risk-assessment">Risk Assessment Report</SelectItem>
                        <SelectItem value="transaction-analysis">Transaction Analysis</SelectItem>
                        <SelectItem value="aml-report">AML Compliance Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select value={reportTimeframe} onValueChange={setReportTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-24h">Last 24 Hours</SelectItem>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={generateReport} 
                    disabled={!reportType || !reportTimeframe}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Generate PDF Report
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={generateReport} 
                    disabled={!reportType || !reportTimeframe}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Generate Excel Report
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Daily Summary</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Generate today's fraud detection summary
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Send className="h-4 w-4 mr-1" />
                      Send to Management
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Compliance Alert</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Send compliance status to regulators
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Send className="h-4 w-4 mr-1" />
                      Submit to RBI
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Monthly Report</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Automated monthly fraud analysis
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-1" />
                      Schedule Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}