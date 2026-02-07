import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Moon, Sun, Shield, Brain, Eye, Bell, Settings, User, BarChart3, Map, Users, Activity, AlertTriangle, FileText, Download, Zap } from 'lucide-react';
import { exportFraudDetectionReport } from '../utils/exportUtils';

import AlertsFeed from './AlertsFeed';
import FraudHeatmap from './FraudHeatmap';
import RiskScoring from './RiskScoring';
import TransactionGraph from './TransactionGraph';
import BiometricsPanel from './BiometricsPanel';
import DarkWebMonitoring from './DarkWebMonitoring';
import AdminDashboard from './AdminDashboard';
import AIFraudInvestigationAgent from './AIFraudInvestigationAgent';
import RAGEvidencePanel from './RAGEvidencePanel';
import AIGuardrailsPanel from './AIGuardrailsPanel';

interface DashboardProps {
  userRole: string;
  onLogout: () => void;
}

export default function Dashboard({ userRole, onLogout }: DashboardProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'bank-manager': return 'bg-blue-500';
      case 'fraud-analyst': return 'bg-green-500';
      case 'compliance-officer': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'bank-manager': return 'Bank Manager';
      case 'fraud-analyst': return 'Fraud Analyst';
      case 'compliance-officer': return 'Compliance Officer';
      default: return 'User';
    }
  };

  const exportReport = () => {
    // Create a detailed fraud detection report
    const reportData = {
      timestamp: new Date().toISOString(),
      userRole: getRoleName(userRole),
      summary: {
        totalAlerts: 47,
        highRiskTransactions: 12,
        blockedTransactions: 8,
        investigatedCases: 23
      },
      riskMetrics: {
        overallRiskScore: 67,
        fraudProbability: 0.23,
        anomalyDetection: 'Active'
      },
      alerts: [
        { id: 1, type: 'High Risk Transaction', amount: 150000, account: 'ACC-2024-001', timestamp: new Date().toISOString() },
        { id: 2, type: 'Suspicious Pattern', amount: 89000, account: 'ACC-2024-002', timestamp: new Date().toISOString() },
        { id: 3, type: 'Velocity Check Failed', amount: 67500, account: 'ACC-2024-003', timestamp: new Date().toISOString() }
      ]
    };

    // Use the new export utility that determines the best format
    exportFraudDetectionReport(reportData);
  };

  if (showAdminDashboard) {
    return (
      <AdminDashboard 
        userRole={userRole} 
        onLogout={onLogout}
        onSwitchToDashboard={() => setShowAdminDashboard(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Shield className="h-9 w-9 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <Brain className="h-9 w-9 text-emerald-600" />
                <Eye className="h-9 w-9 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SecureBank AI Platform</h1>
                <p className="text-muted-foreground">Real-time fraud detection & risk management</p>
              </div>
            </div>

            <div className="flex items-center space-x-5">
              {/* Quick Actions */}
              <Button variant="outline" size="sm" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>

              {/* Admin Access */}
              {(userRole === 'bank-manager' || userRole === 'compliance-officer') && (
                <Button variant="outline" size="sm" onClick={() => setShowAdminDashboard(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Center
                </Button>
              )}

              {/* Notification Bell */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">3</span>
                </div>
              </Button>

              {/* Dark Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                <Moon className="h-4 w-4" />
              </div>

              {/* User Role */}
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <Badge className={`${getRoleColor(userRole)} text-white border-0 px-3 py-1`}>
                  {getRoleName(userRole)}
                </Badge>
              </div>

              {/* Logout */}
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-9 w-full bg-muted/50 h-12">
            <TabsTrigger value="overview" className="flex items-center space-x-2 h-10">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2 h-10">
              <AlertTriangle className="h-4 w-4" />
              <span>Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center space-x-2 h-10">
              <Map className="h-4 w-4" />
              <span>Threat Map</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center space-x-2 h-10">
              <Shield className="h-4 w-4" />
              <span>Risk Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center space-x-2 h-10">
              <Users className="h-4 w-4" />
              <span>Network</span>
            </TabsTrigger>
            <TabsTrigger value="biometrics" className="flex items-center space-x-2 h-10">
              <Activity className="h-4 w-4" />
              <span>Biometrics</span>
            </TabsTrigger>
            <TabsTrigger value="darkweb" className="flex items-center space-x-2 h-10">
              <Eye className="h-4 w-4" />
              <span>Dark Web</span>
            </TabsTrigger>
            <TabsTrigger value="ai-agent" className="flex items-center space-x-2 h-10">
              <Brain className="h-4 w-4" />
              <span>AI Agent</span>
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center space-x-2 h-10">
              <Zap className="h-4 w-4" />
              <span>Intel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Active Threats</p>
                    <p className="text-3xl font-bold">47</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Under Investigation</p>
                    <p className="text-3xl font-bold">23</p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Transactions Blocked</p>
                    <p className="text-3xl font-bold">156</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">AI Confidence</p>
                    <p className="text-3xl font-bold">94%</p>
                  </div>
                  <Brain className="h-8 w-8 text-green-200" />
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-8">
                <AlertsFeed />
                <RiskScoring />
              </div>
              <div className="space-y-8">
                <FraudHeatmap />
                <TransactionGraph />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsFeed />
          </TabsContent>

          <TabsContent value="heatmap">
            <FraudHeatmap />
          </TabsContent>

          <TabsContent value="risk">
            <RiskScoring />
          </TabsContent>

          <TabsContent value="network">
            <TransactionGraph />
          </TabsContent>

          <TabsContent value="biometrics">
            <BiometricsPanel />
          </TabsContent>

          <TabsContent value="darkweb">
            <DarkWebMonitoring />
          </TabsContent>

          <TabsContent value="ai-agent">
            <div className="space-y-8">
              <AIFraudInvestigationAgent />
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RAGEvidencePanel />
                <AIGuardrailsPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intelligence">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BiometricsPanel />
              <DarkWebMonitoring />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}