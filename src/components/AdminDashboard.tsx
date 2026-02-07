import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Moon, Sun, Shield, Brain, Eye, Bell, Settings, User, Users, Database, Activity, FileText, BarChart3, AlertTriangle } from 'lucide-react';

import AdminActions from './AdminActions';
import ComplianceChecker from './ComplianceChecker';
import ExplainableAI from './ExplainableAI';

interface AdminDashboardProps {
  userRole: string;
  onLogout: () => void;
  onSwitchToDashboard: () => void;
}

export default function AdminDashboard({ userRole, onLogout, onSwitchToDashboard }: AdminDashboardProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');

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
      default: return 'Administrator';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <Settings className="h-8 w-8 text-orange-600" />
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SecureBank AI - Admin Center</h1>
                <p className="text-muted-foreground">System administration and control panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Switch to Main Dashboard */}
              <Button variant="outline" onClick={onSwitchToDashboard}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Main Dashboard
              </Button>

              {/* Notification Bell */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
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
                <Badge className={`${getRoleColor(userRole)} text-white border-0`}>
                  {getRoleName(userRole)}
                </Badge>
              </div>

              {/* Logout */}
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Admin Actions</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Management</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-8">
            <AdminActions userRole={userRole} />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-8">
            <ComplianceChecker />
          </TabsContent>

          <TabsContent value="ai" className="space-y-8">
            <ExplainableAI />
          </TabsContent>

          <TabsContent value="reports" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* System Reports will be implemented here */}
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">System Reports</h3>
                <p className="text-muted-foreground">Advanced reporting features coming soon...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}