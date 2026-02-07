import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Gauge, Filter, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { exportRiskScoreReport } from '../utils/exportUtils';

interface RiskAccount {
  id: string;
  accountNumber: string;
  customerName: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
  transactionCount: number;
  flaggedReasons: string[];
  trend: number;
}

const generateRiskAccounts = (): RiskAccount[] => {
  const names = ['John Smith', 'Maria Garcia', 'Ahmed Hassan', 'Li Wei', 'Sarah Johnson', 'Michael Brown', 'Anna Petrov', 'Carlos Silva', 'Priya Patel', 'Robert Wilson'];
  const reasons = [
    'Unusual transaction patterns',
    'High-risk geographical locations',
    'Velocity anomalies',
    'Device fingerprint changes',
    'Off-hours activity',
    'Large amount transfers'
  ];

  return Array.from({ length: 10 }, (_, i) => {
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
    
    return {
      id: `acc-${i + 1}`,
      accountNumber: `AC${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      customerName: names[i],
      riskScore,
      riskLevel: riskLevel as 'low' | 'medium' | 'high' | 'critical',
      lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString(),
      transactionCount: Math.floor(Math.random() * 50) + 1,
      flaggedReasons: reasons.slice(0, Math.floor(Math.random() * 3) + 1),
      trend: Math.floor(Math.random() * 40) - 20
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
};

export default function RiskScoring() {
  const [accounts, setAccounts] = useState<RiskAccount[]>([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [transactionType, setTransactionType] = useState('all');
  const [customerProfile, setCustomerProfile] = useState('all');

  useEffect(() => {
    setAccounts(generateRiskAccounts());
    
    const interval = setInterval(() => {
      setAccounts(prev => prev.map(account => ({
        ...account,
        riskScore: Math.max(0, Math.min(100, account.riskScore + (Math.random() - 0.5) * 10)),
        trend: Math.floor(Math.random() * 40) - 20
      })).sort((a, b) => b.riskScore - a.riskScore));
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange, transactionType, customerProfile]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const exportRiskReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      transactionType,
      summary: {
        totalAccounts: accounts.length,
        criticalRiskAccounts: accounts.filter(a => a.riskLevel === 'critical').length,
        highRiskAccounts: accounts.filter(a => a.riskLevel === 'high').length,
        averageRiskScore: Math.round(accounts.reduce((sum, a) => sum + a.riskScore, 0) / accounts.length || 0)
      },
      accounts: accounts.map(account => ({
        accountNumber: account.accountNumber,
        customerName: account.customerName,
        riskScore: account.riskScore,
        riskLevel: account.riskLevel,
        lastActivity: account.lastActivity,
        transactionCount: account.transactionCount,
        flaggedReasons: account.flaggedReasons.join(', '),
        trend: account.trend
      }))
    };

    exportRiskScoreReport(reportData);
  };

  const CircularGauge = ({ value, size = 60 }: { value: number; size?: number }) => {
    const circumference = 2 * Math.PI * 20;
    const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-muted-foreground/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={value >= 80 ? 'text-red-500' : value >= 60 ? 'text-orange-500' : value >= 40 ? 'text-yellow-500' : 'text-green-500'}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">{value}%</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gauge className="h-5 w-5 text-purple-500" />
          <span>Risk Scoring Dashboard</span>
        </CardTitle>
        <CardDescription>
          Top accounts ranked by fraud probability
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters and Export */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1h</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
                <SelectItem value="30d">Last 30d</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="wire">Wire Transfers</SelectItem>
                <SelectItem value="card">Card Payments</SelectItem>
                <SelectItem value="mobile">Mobile Transfers</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={customerProfile} onValueChange={setCustomerProfile}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm" onClick={exportRiskReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Risk Accounts List */}
        <div className="space-y-3">
          {accounts.slice(0, 8).map((account, index) => (
            <div key={account.id} className="p-4 border rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRiskBgColor(account.riskLevel)} text-white text-sm font-medium`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{account.customerName}</div>
                    <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${getRiskColor(account.riskLevel)}`}>
                        {account.riskScore}%
                      </span>
                      <div className="flex items-center">
                        <TrendingUp className={`h-3 w-3 ${account.trend >= 0 ? 'text-red-500' : 'text-green-500 rotate-180'}`} />
                        <span className={`text-xs ${account.trend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {Math.abs(account.trend)}%
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${getRiskBgColor(account.riskLevel)} text-white border-0 mt-1`}>
                      {account.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <CircularGauge value={account.riskScore} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Last Activity:</span>
                  <div>{account.lastActivity}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Transactions:</span>
                  <div>{account.transactionCount}</div>
                </div>
              </div>
              
              <div className="mt-2">
                <span className="text-muted-foreground text-sm">Flagged for:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {account.flaggedReasons.map((reason, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Risk Score Progress Bar */}
              <div className="mt-3">
                <Progress value={account.riskScore} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{accounts.filter(a => a.riskLevel === 'critical').length}</div>
            <div className="text-xs text-muted-foreground">Critical Risk</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{accounts.filter(a => a.riskLevel === 'high').length}</div>
            <div className="text-xs text-muted-foreground">High Risk</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{accounts.filter(a => a.riskLevel === 'medium').length}</div>
            <div className="text-xs text-muted-foreground">Medium Risk</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{accounts.filter(a => a.riskLevel === 'low').length}</div>
            <div className="text-xs text-muted-foreground">Low Risk</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}