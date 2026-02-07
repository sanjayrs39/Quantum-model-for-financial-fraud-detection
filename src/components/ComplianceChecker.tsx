import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, CheckCircle, XCircle, AlertTriangle, Download, RefreshCw, Shield } from 'lucide-react';
import { exportComplianceReport } from '../utils/exportUtils';

interface ComplianceRule {
  id: string;
  category: 'RBI' | 'SEBI' | 'AML' | 'KYC' | 'PMLA';
  name: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'warning' | 'pending';
  lastChecked: Date;
  nextReview: Date;
  violations: number;
  actionRequired: boolean;
}

interface ComplianceReport {
  id: string;
  transactionId: string;
  accountId: string;
  amount: number;
  checks: {
    rbi: { status: 'pass' | 'fail' | 'warning'; details: string[] };
    sebi: { status: 'pass' | 'fail' | 'warning'; details: string[] };
    aml: { status: 'pass' | 'fail' | 'warning'; details: string[] };
    kyc: { status: 'pass' | 'fail' | 'warning'; details: string[] };
    pmla: { status: 'pass' | 'fail' | 'warning'; details: string[] };
  };
  overallStatus: 'compliant' | 'violations' | 'review_required';
  timestamp: Date;
}

const generateComplianceRules = (): ComplianceRule[] => {
  return [
    {
      id: 'rbi-001',
      category: 'RBI',
      name: 'Large Transaction Reporting',
      description: 'Transactions above ₹10 lakh must be reported to RBI within 24 hours',
      status: Math.random() > 0.8 ? 'non-compliant' : 'compliant',
      lastChecked: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      violations: Math.floor(Math.random() * 5),
      actionRequired: Math.random() > 0.7
    },
    {
      id: 'rbi-002',
      category: 'RBI',
      name: 'Cross-border Transaction Limits',
      description: 'Monitor and enforce cross-border transaction limits as per FEMA guidelines',
      status: Math.random() > 0.9 ? 'warning' : 'compliant',
      lastChecked: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      violations: Math.floor(Math.random() * 3),
      actionRequired: Math.random() > 0.8
    },
    {
      id: 'aml-001',
      category: 'AML',
      name: 'Suspicious Activity Reporting',
      description: 'File STRs for transactions showing suspicious patterns within 7 days',
      status: Math.random() > 0.7 ? 'non-compliant' : 'compliant',
      lastChecked: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      violations: Math.floor(Math.random() * 8),
      actionRequired: Math.random() > 0.6
    },
    {
      id: 'kyc-001',
      category: 'KYC',
      name: 'Customer Due Diligence',
      description: 'Verify customer identity and maintain updated KYC records',
      status: Math.random() > 0.85 ? 'warning' : 'compliant',
      lastChecked: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      violations: Math.floor(Math.random() * 4),
      actionRequired: Math.random() > 0.75
    },
    {
      id: 'pmla-001',
      category: 'PMLA',
      name: 'Cash Transaction Reporting',
      description: 'Report cash transactions above ₹10 lakh to FIU-IND',
      status: Math.random() > 0.9 ? 'non-compliant' : 'compliant',
      lastChecked: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      violations: Math.floor(Math.random() * 2),
      actionRequired: Math.random() > 0.8
    },
    {
      id: 'sebi-001',
      category: 'SEBI',
      name: 'Market Manipulation Detection',
      description: 'Monitor and report potential market manipulation activities',
      status: 'compliant',
      lastChecked: new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      violations: 0,
      actionRequired: false
    }
  ];
};

const generateComplianceReports = (): ComplianceReport[] => {
  return Array.from({ length: 6 }, (_, i) => {
    const overallStatus = Math.random() > 0.7 ? 'compliant' : Math.random() > 0.4 ? 'review_required' : 'violations';
    
    return {
      id: `report-${i + 1}`,
      transactionId: `TXN${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      accountId: `AC${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      amount: Math.floor(Math.random() * 1000000) + 50000,
      checks: {
        rbi: {
          status: Math.random() > 0.8 ? 'fail' : Math.random() > 0.6 ? 'warning' : 'pass',
          details: ['Transaction amount verification', 'Cross-border compliance check', 'Reporting timeline validation']
        },
        sebi: {
          status: Math.random() > 0.9 ? 'warning' : 'pass',
          details: ['Market manipulation screening', 'Insider trading detection', 'Price manipulation check']
        },
        aml: {
          status: Math.random() > 0.7 ? 'fail' : Math.random() > 0.5 ? 'warning' : 'pass',
          details: ['Suspicious pattern analysis', 'PEP screening', 'Sanctions list check']
        },
        kyc: {
          status: Math.random() > 0.8 ? 'warning' : 'pass',
          details: ['Identity verification', 'Address validation', 'Document authenticity']
        },
        pmla: {
          status: Math.random() > 0.85 ? 'fail' : 'pass',
          details: ['Cash transaction limits', 'Source of funds verification', 'Beneficial ownership']
        }
      },
      overallStatus: overallStatus as 'compliant' | 'violations' | 'review_required',
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    };
  });
};

export default function ComplianceChecker() {
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setComplianceRules(generateComplianceRules());
    setComplianceReports(generateComplianceReports());
  }, []);

  const runComplianceScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setComplianceRules(generateComplianceRules());
      setComplianceReports(generateComplianceReports());
      setIsScanning(false);
    }, 2000);
  };

  const exportComplianceReportData = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      complianceScore,
      violationsCount,
      warningsCount,
      summary: {
        totalRules: complianceRules.length,
        compliantRules: complianceRules.filter(r => r.status === 'compliant').length,
        nonCompliantRules: violationsCount,
        warningRules: warningsCount
      },
      rules: complianceRules.map(rule => ({
        id: rule.id,
        category: rule.category,
        name: rule.name,
        description: rule.description,
        status: rule.status,
        lastChecked: rule.lastChecked.toISOString(),
        nextReview: rule.nextReview.toISOString(),
        violations: rule.violations,
        actionRequired: rule.actionRequired
      })),
      transactionReports: complianceReports.map(report => ({
        id: report.id,
        transactionId: report.transactionId,
        accountId: report.accountId,
        amount: report.amount,
        rbiStatus: report.checks.rbi.status,
        sebiStatus: report.checks.sebi.status,
        amlStatus: report.checks.aml.status,
        kycStatus: report.checks.kyc.status,
        pmlaStatus: report.checks.pmla.status,
        overallStatus: report.overallStatus,
        timestamp: report.timestamp.toISOString()
      }))
    };

    exportComplianceReport(reportData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'non-compliant':
      case 'violations':
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
      case 'review_required': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'pass': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      case 'non-compliant':
      case 'violations':
      case 'fail': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      case 'warning':
      case 'review_required': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const violationsCount = complianceRules.filter(rule => rule.status === 'non-compliant').length;
  const warningsCount = complianceRules.filter(rule => rule.status === 'warning').length;
  const complianceScore = Math.round(((complianceRules.length - violationsCount - warningsCount * 0.5) / complianceRules.length) * 100);

  return (
    <div className="space-y-6">
      {/* Compliance Alerts */}
      {violationsCount > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>Compliance Violations Detected!</strong> {violationsCount} rule(s) are non-compliant and require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{complianceScore}%</div>
                <div className="text-xs text-muted-foreground">Compliance Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{complianceRules.filter(r => r.status === 'compliant').length}</div>
                <div className="text-xs text-muted-foreground">Compliant Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{warningsCount}</div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{violationsCount}</div>
                <div className="text-xs text-muted-foreground">Violations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-500" />
            <span>Compliance Checker</span>
          </CardTitle>
          <CardDescription>
            Automated compliance monitoring for RBI, SEBI, AML, KYC, and PMLA regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rules" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="rules">Compliance Rules</TabsTrigger>
                <TabsTrigger value="reports">Transaction Reports</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runComplianceScan}
                  disabled={isScanning}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
                  {isScanning ? 'Scanning...' : 'Run Scan'}
                </Button>
                <Button variant="outline" size="sm" onClick={exportComplianceReportData}>
                  <Download className="h-4 w-4 mr-1" />
                  Export Report
                </Button>
              </div>
            </div>

            <TabsContent value="rules" className="space-y-4">
              <div className="p-4 bg-card border rounded-lg">
                <h4 className="font-medium mb-3">Overall Compliance Score</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Compliance Level</span>
                    <span className="font-medium">{complianceScore}%</span>
                  </div>
                  <Progress value={complianceScore} className="h-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {complianceRules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(rule.status)}
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {rule.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(rule.status)}>
                          {rule.status.toUpperCase().replace('-', ' ')}
                        </Badge>
                        {rule.violations > 0 && (
                          <div className="text-xs text-red-500 mt-1">
                            {rule.violations} violations
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Last Checked:</span>
                        <div>{rule.lastChecked.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Review:</span>
                        <div>{rule.nextReview.toLocaleDateString()}</div>
                      </div>
                    </div>

                    {rule.actionRequired && (
                      <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded text-xs">
                        <span className="text-yellow-700 dark:text-yellow-300 font-medium">Action Required:</span> Manual review needed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reports List */}
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Transaction Reports</h4>
                  {complianceReports.map((report) => (
                    <div 
                      key={report.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedReport?.id === report.id ? 'bg-accent' : 'bg-card/50 hover:bg-card/80'
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{report.transactionId}</div>
                          <div className="text-xs text-muted-foreground">{report.accountId}</div>
                        </div>
                        <div className="text-right">
                          {getStatusIcon(report.overallStatus)}
                          <div className="text-xs text-muted-foreground mt-1">
                            ₹{report.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {report.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Report Details */}
                <div>
                  <h4 className="font-medium mb-3">Compliance Report Details</h4>
                  {selectedReport ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-card border rounded-lg">
                        <h5 className="font-medium mb-3">Transaction Summary</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Transaction ID:</span>
                            <div className="font-medium">{selectedReport.transactionId}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Account:</span>
                            <div className="font-medium">{selectedReport.accountId}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <div className="font-medium">₹{selectedReport.amount.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className={getStatusColor(selectedReport.overallStatus)}>
                              {selectedReport.overallStatus.toUpperCase().replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-card border rounded-lg">
                        <h5 className="font-medium mb-3">Compliance Checks</h5>
                        <div className="space-y-3">
                          {Object.entries(selectedReport.checks).map(([category, check]) => (
                            <div key={category} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(check.status)}
                                <span className="text-sm font-medium">{category.toUpperCase()}</span>
                              </div>
                              <Badge className={getStatusColor(check.status)}>
                                {check.status.toUpperCase()}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedReport.overallStatus !== 'compliant' && (
                        <div className="p-4 bg-card border rounded-lg">
                          <h5 className="font-medium mb-3">Required Actions</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <span>Manual review required for compliance verification</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span>Generate detailed compliance report</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-green-500" />
                              <span>Escalate to compliance officer if needed</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground bg-card border rounded-lg">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a transaction report to view compliance details</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}