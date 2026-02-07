import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, Shield, AlertTriangle, Database, Clock, Download, ExternalLink, Search, Globe, Activity, FileText, CheckCircle, X, Bell } from 'lucide-react';
import { exportDarkWebReport } from '../utils/exportUtils';

interface BreachData {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  dataType: 'PAN' | 'Email' | 'Phone' | 'Address' | 'SSN' | 'Password' | 'Full Profile';
  breachSource: string;
  sourceType: 'Forum' | 'Marketplace' | 'Dump' | 'Chat' | 'Paste Site';
  discoveredDate: Date;
  breachDate: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'verified' | 'mitigated' | 'false_positive';
  affectedRecords: number;
  marketplacePrice?: number;
  credibility: number; // 0-100
  actionTaken: string[];
}

interface MonitoringStats {
  totalScanned: number;
  threatsFound: number;
  customersAtRisk: number;
  lastScanTime: Date;
  scanProgress: number;
}

const generateBreachData = (): BreachData[] => {
  const customers = [
    { id: 'CUST001', name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com' },
    { id: 'CUST002', name: 'Priya Sharma', email: 'priya.sharma@email.com' },
    { id: 'CUST003', name: 'Amit Patel', email: 'amit.patel@email.com' },
    { id: 'CUST004', name: 'Sunita Devi', email: 'sunita.devi@email.com' },
    { id: 'CUST005', name: 'Vikram Singh', email: 'vikram.singh@email.com' },
    { id: 'CUST006', name: 'Anita Roy', email: 'anita.roy@email.com' },
    { id: 'CUST007', name: 'Ravi Gupta', email: 'ravi.gupta@email.com' },
    { id: 'CUST008', name: 'Meera Joshi', email: 'meera.joshi@email.com' }
  ];

  const breachSources = [
    { name: 'DarkMarket Forum', type: 'Forum' as const },
    { name: 'Underground-CC', type: 'Marketplace' as const },
    { name: 'MegaLeaks DB', type: 'Dump' as const },
    { name: 'CyberChat-TG', type: 'Chat' as const },
    { name: 'CardingForum', type: 'Forum' as const },
    { name: 'PasteBin Leak', type: 'Paste Site' as const },
    { name: 'BlackMarket-2024', type: 'Marketplace' as const },
    { name: 'HackerDB Dump', type: 'Dump' as const }
  ];

  const dataTypes: ('PAN' | 'Email' | 'Phone' | 'Address' | 'SSN' | 'Password' | 'Full Profile')[] = 
    ['PAN', 'Email', 'Phone', 'Address', 'SSN', 'Password', 'Full Profile'];

  return Array.from({ length: 15 }, (_, i) => {
    const customer = customers[i % customers.length];
    const source = breachSources[Math.floor(Math.random() * breachSources.length)];
    const severity = Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';
    const breachDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    const discoveredDate = new Date(breachDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);

    return {
      id: `breach-${i + 1}`,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      dataType: dataTypes[Math.floor(Math.random() * dataTypes.length)],
      breachSource: source.name,
      sourceType: source.type,
      discoveredDate,
      breachDate,
      severity: severity as 'low' | 'medium' | 'high' | 'critical',
      status: Math.random() > 0.6 ? 'new' : Math.random() > 0.4 ? 'investigating' : Math.random() > 0.2 ? 'verified' : 'mitigated',
      affectedRecords: Math.floor(Math.random() * 50000) + 1000,
      marketplacePrice: severity === 'critical' || severity === 'high' ? Math.floor(Math.random() * 800) + 100 : undefined,
      credibility: Math.floor(Math.random() * 40) + 60, // 60-100
      actionTaken: []
    };
  });
};

export default function DarkWebMonitoring() {
  const [breachData, setBreachData] = useState<BreachData[]>([]);
  const [filteredData, setFilteredData] = useState<BreachData[]>([]);
  const [selectedBreach, setSelectedBreach] = useState<BreachData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState<MonitoringStats>({
    totalScanned: 2450000,
    threatsFound: 0,
    customersAtRisk: 0,
    lastScanTime: new Date(),
    scanProgress: 100
  });

  useEffect(() => {
    const data = generateBreachData();
    setBreachData(data);
    setFilteredData(data);
    
    setStats(prev => ({
      ...prev,
      threatsFound: data.length,
      customersAtRisk: new Set(data.map(b => b.customerId)).size
    }));
    
    // Simulate periodic scans
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        lastScanTime: new Date(),
        totalScanned: prev.totalScanned + Math.floor(Math.random() * 1000) + 500
      }));
      
      // Occasionally add new breaches
      if (Math.random() > 0.85) {
        const newBreach = generateBreachData()[0];
        newBreach.status = 'new';
        newBreach.discoveredDate = new Date();
        newBreach.id = `breach-${Date.now()}`;
        setBreachData(prev => [newBreach, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = breachData;

    if (searchTerm) {
      filtered = filtered.filter(breach => 
        breach.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breach.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breach.breachSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breach.dataType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(breach => breach.severity === filterSeverity);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(breach => breach.status === filterStatus);
    }

    setFilteredData(filtered);
  }, [breachData, searchTerm, filterSeverity, filterStatus]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      case 'verified': return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300';
      case 'mitigated': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      case 'false_positive': return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const getSourceTypeIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'Forum': return '💬';
      case 'Marketplace': return '🛒';
      case 'Dump': return '📁';
      case 'Chat': return '💭';
      case 'Paste Site': return '📋';
      default: return '🌐';
    }
  };

  const handleAction = (breach: BreachData, action: string) => {
    setBreachData(prev => prev.map(b => 
      b.id === breach.id 
        ? { 
            ...b, 
            status: action === 'investigate' ? 'investigating' : 
                   action === 'verify' ? 'verified' :
                   action === 'mitigate' ? 'mitigated' :
                   action === 'false_positive' ? 'false_positive' : b.status,
            actionTaken: [...b.actionTaken, action]
          }
        : b
    ));

    if (selectedBreach?.id === breach.id) {
      setSelectedBreach(prev => prev ? {
        ...prev,
        status: action === 'investigate' ? 'investigating' : 
               action === 'verify' ? 'verified' :
               action === 'mitigate' ? 'mitigated' :
               action === 'false_positive' ? 'false_positive' : prev.status,
        actionTaken: [...prev.actionTaken, action]
      } : null);
    }
  };

  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      statistics: stats,
      breaches: filteredData.map(breach => ({
        id: breach.id,
        customer: breach.customerName,
        customerId: breach.customerId,
        dataType: breach.dataType,
        severity: breach.severity,
        status: breach.status,
        source: breach.breachSource,
        discoveredDate: breach.discoveredDate.toISOString(),
        marketplacePrice: breach.marketplacePrice,
        credibility: breach.credibility,
        actionTaken: breach.actionTaken.join(', ')
      }))
    };

    // Use the new export utility that will export as Excel due to tabular breach data
    exportDarkWebReport(reportData);
  };

  const criticalBreaches = filteredData.filter(b => b.severity === 'critical' && b.status === 'new');
  const newBreaches = filteredData.filter(b => b.status === 'new');

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalBreaches.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>🚨 Critical Threat Alert!</strong> {criticalBreaches.length} high-priority customer data breach(es) detected on dark web marketplaces requiring immediate action.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-blue-100" />
              <div>
                <div className="text-2xl font-bold">{stats.totalScanned.toLocaleString()}</div>
                <div className="text-xs text-blue-100">Sources Monitored</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-orange-100" />
              <div>
                <div className="text-2xl font-bold">{stats.threatsFound}</div>
                <div className="text-xs text-orange-100">Threats Detected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-100" />
              <div>
                <div className="text-2xl font-bold">{stats.customersAtRisk}</div>
                <div className="text-xs text-red-100">Customers at Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-purple-100" />
              <div>
                <div className="text-2xl font-bold">{criticalBreaches.length}</div>
                <div className="text-xs text-purple-100">Critical Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-green-100" />
              <div>
                <div className="text-sm font-medium">{stats.lastScanTime.toLocaleTimeString()}</div>
                <div className="text-xs text-green-100">Last Scan Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <span>Dark Web Intelligence Center</span>
                <Badge variant="outline" className="ml-2">
                  {filteredData.length} threats
                </Badge>
              </CardTitle>
              <CardDescription>
                Advanced monitoring of underground marketplaces, forums, and breach databases for customer data exposure
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Bell className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Real-time</span>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Input
              placeholder="Search customers, sources, or data types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72 h-9"
            />
            
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="false_positive">False Positive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Threat Overview</TabsTrigger>
              <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="sources">Source Intelligence</TabsTrigger>
              <TabsTrigger value="actions">Response Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Breaches List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Recent Threat Detections</h3>
                    <Badge variant="outline">
                      {newBreaches.length} new
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredData.map((breach) => (
                      <div 
                        key={breach.id} 
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedBreach?.id === breach.id 
                            ? 'bg-accent border-primary shadow-md' 
                            : breach.severity === 'critical' 
                              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 hover:shadow-md'
                              : 'bg-card/50 hover:bg-card/80 hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedBreach(breach)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${getSeverityColor(breach.severity)} animate-pulse`}></div>
                            <div>
                              <div className="font-semibold">{breach.customerName}</div>
                              <div className="text-xs text-muted-foreground">{breach.customerId}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={`text-xs ${getStatusColor(breach.status)}`}>
                              {breach.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {getSourceTypeIcon(breach.sourceType)} {breach.sourceType}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground font-medium">Data Type:</span>
                            <div className="font-medium">{breach.dataType}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-medium">Credibility:</span>
                            <div className="font-medium">{breach.credibility}%</div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground font-medium">Source:</span>
                            <div className="font-medium text-xs">{breach.breachSource}</div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground font-medium">Discovered:</span>
                            <div className="text-xs">{breach.discoveredDate.toLocaleDateString()} at {breach.discoveredDate.toLocaleTimeString()}</div>
                          </div>
                        </div>

                        {breach.marketplacePrice && (
                          <div className="mt-3 p-2 bg-red-100 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="text-red-700 dark:text-red-300 font-medium text-sm">
                                🏪 Listed for sale: ${breach.marketplacePrice}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Threat Intelligence Panel */}
                <div>
                  <h3 className="font-medium mb-3">Threat Intelligence</h3>
                  {selectedBreach ? (
                    <div className="space-y-4">
                      {/* Customer Information */}
                      <div className="p-4 bg-gradient-to-r from-card to-card/80 border rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Customer Profile</span>
                          </h4>
                          <Badge className={`${getSeverityColor(selectedBreach.severity)} text-white border-0`}>
                            {selectedBreach.severity.toUpperCase()} RISK
                          </Badge>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground font-medium">Customer Name:</span>
                              <div className="font-semibold">{selectedBreach.customerName}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground font-medium">Account ID:</span>
                              <div className="font-semibold">{selectedBreach.customerId}</div>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground font-medium">Email Address:</span>
                            <div className="font-semibold">{selectedBreach.customerEmail}</div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground font-medium">Compromised Data:</span>
                              <div className="font-semibold text-red-600">{selectedBreach.dataType}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground font-medium">Affected Records:</span>
                              <div className="font-semibold">{selectedBreach.affectedRecords.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Threat Analysis */}
                      <div className="p-4 bg-card border rounded-xl">
                        <h4 className="font-semibold mb-3 flex items-center space-x-2">
                          <Database className="h-4 w-4" />
                          <span>Threat Analysis</span>
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground font-medium">Source Platform:</span>
                              <div className="font-semibold flex items-center space-x-2">
                                <span>{getSourceTypeIcon(selectedBreach.sourceType)}</span>
                                <span>{selectedBreach.breachSource}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground font-medium">Source Type:</span>
                              <div className="font-semibold">{selectedBreach.sourceType}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground font-medium">Original Breach:</span>
                              <div className="font-semibold">{selectedBreach.breachDate.toLocaleDateString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground font-medium">Detection Date:</span>
                              <div className="font-semibold">{selectedBreach.discoveredDate.toLocaleDateString()}</div>
                            </div>
                          </div>

                          {selectedBreach.marketplacePrice && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                              <div className="flex items-center justify-between">
                                <span className="text-red-700 dark:text-red-300 font-medium">Marketplace Value:</span>
                                <span className="text-red-700 dark:text-red-300 font-bold text-lg">${selectedBreach.marketplacePrice}</span>
                              </div>
                              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                💡 Active listing detected - immediate action recommended
                              </div>
                            </div>
                          )}

                          {/* Credibility Score */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">Source Credibility</span>
                              <span className="font-bold">{selectedBreach.credibility}%</span>
                            </div>
                            <Progress 
                              value={selectedBreach.credibility} 
                              className="h-2" 
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              Based on source reliability and cross-verification
                            </div>
                          </div>

                          {/* Risk Level */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">Risk Assessment</span>
                              <span className="font-bold">{selectedBreach.severity.toUpperCase()}</span>
                            </div>
                            <Progress 
                              value={selectedBreach.severity === 'critical' ? 100 : selectedBreach.severity === 'high' ? 75 : selectedBreach.severity === 'medium' ? 50 : 25} 
                              className="h-2" 
                            />
                          </div>

                          {selectedBreach.severity === 'critical' && (
                            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <AlertDescription>
                                <strong>⚠️ Critical Risk Detected:</strong> Customer credentials are actively being sold. Immediate security measures required including password reset, account monitoring, and customer notification.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        {selectedBreach.status === 'new' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAction(selectedBreach, 'investigate')}
                            >
                              <Search className="h-4 w-4 mr-2" />
                              Start Investigation
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleAction(selectedBreach, 'verify')}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Verify Threat
                            </Button>
                          </>
                        )}
                        
                        {selectedBreach.status === 'investigating' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAction(selectedBreach, 'verify')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm Breach
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAction(selectedBreach, 'false_positive')}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Mark False Positive
                            </Button>
                          </>
                        )}

                        {selectedBreach.status === 'verified' && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="col-span-2"
                            onClick={() => handleAction(selectedBreach, 'mitigate')}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Implement Security Measures
                          </Button>
                        )}

                        <Button variant="outline" size="sm" className="col-span-2">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Source Details
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground bg-muted/20 border rounded-xl">
                      <Eye className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h4 className="font-medium mb-2">Select a Threat to Analyze</h4>
                      <p className="text-sm">Choose a threat detection from the list to view detailed intelligence and response options</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Threat Distribution</h3>
                  <div className="space-y-3">
                    {['critical', 'high', 'medium', 'low'].map((level) => {
                      const count = filteredData.filter(b => b.severity === level).length;
                      const percentage = filteredData.length > 0 ? (count / filteredData.length) * 100 : 0;
                      return (
                        <div key={level} className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${getSeverityColor(level)}`}></div>
                          <span className="capitalize font-medium w-20">{level}</span>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${getSeverityColor(level)}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold min-w-[30px]">{count}</span>
                          <span className="text-xs text-muted-foreground min-w-[40px]">{percentage.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Data Type Distribution</h3>
                  <div className="space-y-3">
                    {['PAN', 'Email', 'Password', 'Full Profile', 'Phone', 'Address', 'SSN'].map((dataType) => {
                      const count = filteredData.filter(b => b.dataType === dataType).length;
                      const percentage = filteredData.length > 0 ? (count / filteredData.length) * 100 : 0;
                      const isHighRisk = ['PAN', 'Full Profile', 'Password', 'SSN'].includes(dataType);
                      return (
                        <div key={dataType} className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                          <span className="font-medium w-24">{dataType}</span>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-yellow-500'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold min-w-[30px]">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sources">
              <div className="space-y-4">
                <h3 className="font-semibold">Source Intelligence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from(new Set(filteredData.map(b => b.breachSource))).map((source) => {
                    const sourceBreaches = filteredData.filter(b => b.breachSource === source);
                    const sourceType = sourceBreaches[0]?.sourceType || 'Unknown';
                    const avgCredibility = sourceBreaches.reduce((sum, b) => sum + b.credibility, 0) / sourceBreaches.length;
                    const criticalCount = sourceBreaches.filter(b => b.severity === 'critical').length;
                    
                    return (
                      <div key={source} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getSourceTypeIcon(sourceType)}</span>
                            <span className="font-medium text-sm">{source}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {sourceType}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Threats:</span>
                            <span className="font-medium">{sourceBreaches.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Critical:</span>
                            <span className={`font-medium ${criticalCount > 0 ? 'text-red-500' : ''}`}>{criticalCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg Credibility:</span>
                            <span className="font-medium">{avgCredibility.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions">
              <div className="space-y-4">
                <h3 className="font-semibold">Response Actions Required</h3>
                <div className="space-y-3">
                  {filteredData
                    .filter(breach => breach.status === 'new' || breach.status === 'investigating')
                    .sort((a, b) => {
                      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                      return severityOrder[b.severity] - severityOrder[a.severity];
                    })
                    .map((breach) => (
                      <div key={breach.id} className="p-4 border rounded-lg bg-card/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getSeverityColor(breach.severity)}`}></div>
                            <div>
                              <span className="font-medium">{breach.customerName}</span>
                              <span className="text-sm text-muted-foreground ml-2">({breach.customerId})</span>
                            </div>
                          </div>
                          <Badge className={`${getSeverityColor(breach.severity)} text-white border-0`}>
                            {breach.severity.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-3">
                          {breach.dataType} data found on {breach.breachSource}
                          {breach.marketplacePrice && ` - Listed for $${breach.marketplacePrice}`}
                        </div>

                        <div className="flex space-x-2">
                          {breach.status === 'new' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAction(breach, 'investigate')}
                              >
                                <Search className="h-4 w-4 mr-1" />
                                Investigate
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleAction(breach, 'verify')}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Verify Threat
                              </Button>
                            </>
                          )}
                          
                          {breach.status === 'investigating' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleAction(breach, 'verify')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleAction(breach, 'false_positive')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                False Positive
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}