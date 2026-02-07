import React from 'react';
import { Card } from './ui/card';
import { Database, FileText, User, Shield, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

export default function RAGEvidencePanel() {
  const transactionHistory = [
    { id: 'TXN-89234', amount: 45000, timestamp: '2025-12-13 14:32:18', location: 'Mumbai, IN', status: 'Flagged' },
    { id: 'TXN-89201', amount: 12500, timestamp: '2025-12-13 11:15:42', location: 'Delhi, IN', status: 'Normal' },
    { id: 'TXN-88976', amount: 89000, timestamp: '2025-12-12 22:08:33', location: 'Singapore, SG', status: 'Flagged' },
    { id: 'TXN-88845', amount: 6700, timestamp: '2025-12-12 18:45:11', location: 'Mumbai, IN', status: 'Normal' },
  ];

  const behavioralIndicators = [
    { metric: 'Transaction Velocity (24h)', value: '8 transactions', baseline: '2-3 avg', status: 'anomaly' },
    { metric: 'Geographic Diversity', value: '3 countries', baseline: '1 country avg', status: 'anomaly' },
    { metric: 'Average Transaction Amount', value: '₹38,300', baseline: '₹8,500 avg', status: 'anomaly' },
    { metric: 'Login Pattern Consistency', value: '92%', baseline: '95% avg', status: 'normal' },
  ];

  const policyReferences = [
    { id: 'RBI/AML/2023/045', title: 'High-Value Transaction Monitoring', matched: true },
    { id: 'SEBI/KYC/2024/012', title: 'Cross-Border Transaction Review', matched: true },
    { id: 'INT/PMLA/V4.2', title: 'Velocity Check Protocol', matched: true },
    { id: 'RBI/CFT/2023/089', title: 'Geographic Risk Assessment', matched: false },
  ];

  const dataSources = [
    { name: 'Core Banking System', table: 'transaction_ledger', recordCount: 1247, lastSync: '2 min ago' },
    { name: 'Customer Profile DB', table: 'user_profiles', recordCount: 1, lastSync: '5 min ago' },
    { name: 'AML Policy Repository', table: 'regulatory_rules', recordCount: 34, lastSync: '1 hour ago' },
    { name: 'Dark Web Intelligence', table: 'threat_indicators', recordCount: 0, lastSync: '15 min ago' },
  ];

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Retrieved Evidence & Context (RAG)</h3>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Evidence-Grounded Analysis
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Recent Transaction History */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm uppercase tracking-wide text-muted-foreground">Transaction History (Recent)</h4>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Transaction ID</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactionHistory.map((txn) => (
                  <tr key={txn.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{txn.id}</td>
                    <td className="px-4 py-3">₹{txn.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{txn.timestamp}</td>
                    <td className="px-4 py-3">{txn.location}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={txn.status === 'Flagged' ? 'destructive' : 'outline'}
                        className={txn.status === 'Flagged' ? '' : 'bg-green-50 text-green-700 border-green-200'}
                      >
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Behavioral Profile Indicators */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm uppercase tracking-wide text-muted-foreground">Behavioral Profile Indicators</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {behavioralIndicators.map((indicator, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4 bg-muted/20">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{indicator.metric}</p>
                  <Badge 
                    variant="outline" 
                    className={
                      indicator.status === 'anomaly' 
                        ? 'bg-orange-50 text-orange-700 border-orange-200' 
                        : 'bg-green-50 text-green-700 border-green-200'
                    }
                  >
                    {indicator.status}
                  </Badge>
                </div>
                <p className="font-semibold">{indicator.value}</p>
                <p className="text-xs text-muted-foreground mt-1">Baseline: {indicator.baseline}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy References */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm uppercase tracking-wide text-muted-foreground">Referenced Risk & AML Policies</h4>
          </div>
          <div className="space-y-2">
            {policyReferences.map((policy, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between border border-border rounded-lg p-3 bg-muted/20"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${policy.matched ? 'bg-orange-500' : 'bg-muted-foreground/30'}`} />
                  <div>
                    <p className="text-sm font-mono">{policy.id}</p>
                    <p className="text-xs text-muted-foreground">{policy.title}</p>
                  </div>
                </div>
                {policy.matched && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    Policy Match
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm uppercase tracking-wide text-muted-foreground">Data Sources Referenced</h4>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Source System</th>
                  <th className="text-left px-4 py-3 font-medium">Table/Collection</th>
                  <th className="text-left px-4 py-3 font-medium">Records Retrieved</th>
                  <th className="text-left px-4 py-3 font-medium">Last Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dataSources.map((source, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-4 py-3">{source.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{source.table}</td>
                    <td className="px-4 py-3">{source.recordCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{source.lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-900">
            <strong>Evidence Transparency:</strong> All AI recommendations are derived from retrieved data sources listed above. 
            No assumptions or hallucinated content is used in fraud investigation reasoning.
          </p>
        </div>
      </div>
    </Card>
  );
}
