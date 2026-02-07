import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertTriangle, MapPin, CreditCard, Ban, Search, X, Filter, Clock, TrendingUp, ChevronDown } from 'lucide-react';

interface Alert {
  id: string;
  accountId: string;
  transactionType: string;
  amount: number;
  location: string;
  riskScore: number;
  flagReason: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'blocked' | 'ignored';
}

const generateAlert = (): Alert => {
  const accounts = ['AC001234', 'AC005678', 'AC009012', 'AC003456', 'AC007890'];
  const transactionTypes = ['Wire Transfer', 'ATM Withdrawal', 'Online Purchase', 'Card Payment', 'Mobile Transfer'];
  const locations = ['Mumbai, IN', 'Delhi, IN', 'Lagos, NG', 'Kiev, UA', 'Bangkok, TH', 'London, UK', 'New York, US'];
  const flagReasons = [
    'Unusual time pattern',
    'High-risk location',
    'Velocity anomaly',
    'Device fingerprint mismatch',
    'Geolocation inconsistency',
    'Amount threshold exceeded'
  ];
  
  const severity = Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';
  const riskScore = severity === 'critical' ? Math.floor(Math.random() * 20) + 80 : 
                   severity === 'high' ? Math.floor(Math.random() * 20) + 60 :
                   severity === 'medium' ? Math.floor(Math.random() * 20) + 40 :
                   Math.floor(Math.random() * 30) + 10;

  return {
    id: Math.random().toString(36).substr(2, 9),
    accountId: accounts[Math.floor(Math.random() * accounts.length)],
    transactionType: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
    amount: Math.floor(Math.random() * 500000) + 10000,
    location: locations[Math.floor(Math.random() * locations.length)],
    riskScore,
    flagReason: flagReasons[Math.floor(Math.random() * flagReasons.length)],
    timestamp: new Date(),
    severity: severity as 'low' | 'medium' | 'high' | 'critical',
    status: 'active' as const
  };
};

export default function AlertsFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Generate initial alerts
    const initialAlerts = Array.from({ length: 12 }, generateAlert);
    setAlerts(initialAlerts);

    // Add new alerts periodically
    const interval = setInterval(() => {
      const newAlert = generateAlert();
      setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = alerts;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === filterStatus);
    }

    // Filter by severity
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.transactionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.flagReason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, filterSeverity, filterStatus, searchTerm]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAction = (alertId: string, action: 'block' | 'investigate' | 'ignore') => {
    const statusMap = {
      'block': 'blocked' as const,
      'investigate': 'investigating' as const,
      'ignore': 'ignored' as const
    };

    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: statusMap[action] }
        : alert
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating': return 'bg-blue-500';
      case 'blocked': return 'bg-red-500';
      case 'ignored': return 'bg-gray-500';
      case 'active': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Real-Time Alerts Feed</span>
              <Badge variant="outline" className="ml-2">
                {filteredAlerts.length} alerts
              </Badge>
            </CardTitle>
            <CardDescription>
              Monitor and respond to suspicious transactions in real-time
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Live</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="ignored">Ignored</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[130px] h-9">
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
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`p-5 border rounded-xl transition-all duration-200 ${
                alert.severity === 'critical' 
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 shadow-md' 
                  : alert.severity === 'high'
                  ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                  : 'bg-card/50 hover:bg-card/80 border-border'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getSeverityColor(alert.severity)} animate-pulse`}></div>
                    <div>
                      <span className="font-semibold text-lg">{alert.accountId}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Risk: {alert.riskScore}%
                        </Badge>
                        <Badge className={`text-xs text-white ${getStatusColor(alert.status)}`}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground font-medium">Type:</span> 
                    <span className="font-medium">{alert.transactionType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground font-medium">Amount:</span> 
                    <span className="font-bold text-lg">₹{alert.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{alert.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{alert.flagReason}</span>
                  </div>
                </div>
                
                {alert.status === 'active' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(alert.id, 'block')}
                      className="h-8 px-4 font-medium"
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Block Transaction
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(alert.id, 'investigate')}
                      className="h-8 px-4 font-medium"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Investigate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(alert.id, 'ignore')}
                      className="h-8 px-4 font-medium"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Ignore
                    </Button>
                  </div>
                )}
                
                {alert.status !== 'active' && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Status: </span>
                    <Badge className={`text-white ${getStatusColor(alert.status)}`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}