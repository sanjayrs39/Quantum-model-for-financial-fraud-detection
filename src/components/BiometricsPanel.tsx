import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Fingerprint, Smartphone, Clock, MapPin, Keyboard, AlertTriangle, Download } from 'lucide-react';
import { exportBiometricsReport as exportBiometricsData } from '../utils/exportUtils';

interface BiometricData {
  id: string;
  userId: string;
  userName: string;
  sessionId: string;
  anomalies: {
    typingSpeed: { normal: number; current: number; deviation: number };
    deviceFingerprint: { match: boolean; confidence: number };
    loginPattern: { usual: string; current: string; risk: number };
    locationPattern: { usual: string; current: string; risk: number };
    sessionDuration: { normal: number; current: number; unusual: boolean };
  };
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  overallScore: number;
}

const generateBiometricData = (): BiometricData[] => {
  const users = [
    'john.smith@bank.com',
    'maria.garcia@bank.com', 
    'ahmed.hassan@bank.com',
    'li.wei@bank.com',
    'sarah.johnson@bank.com'
  ];

  const names = [
    'John Smith',
    'Maria Garcia',
    'Ahmed Hassan',
    'Li Wei',
    'Sarah Johnson'
  ];

  const usualLocations = ['Mumbai Office', 'Delhi Branch', 'Bangalore HQ', 'Chennai Office', 'Kolkata Branch'];
  const currentLocations = ['Mumbai Office', 'Unknown Location', 'Kiev, Ukraine', 'Lagos, Nigeria', 'Bangkok, Thailand'];

  return Array.from({ length: 8 }, (_, i) => {
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
    
    const typingDeviation = Math.floor(Math.random() * 60) - 30;
    const deviceMatch = Math.random() > 0.3;
    const isUnusualTime = Math.random() > 0.7;
    const isUnusualLocation = Math.random() > 0.6;
    
    return {
      id: `bio-${i + 1}`,
      userId: users[i % users.length],
      userName: names[i % names.length],
      sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
      anomalies: {
        typingSpeed: {
          normal: 180 + Math.floor(Math.random() * 40),
          current: 180 + Math.floor(Math.random() * 40) + typingDeviation,
          deviation: Math.abs(typingDeviation)
        },
        deviceFingerprint: {
          match: deviceMatch,
          confidence: deviceMatch ? 95 + Math.floor(Math.random() * 5) : 20 + Math.floor(Math.random() * 60)
        },
        loginPattern: {
          usual: '9:00 AM - 6:00 PM',
          current: isUnusualTime ? '3:17 AM' : '10:30 AM',
          risk: isUnusualTime ? 85 : 15
        },
        locationPattern: {
          usual: usualLocations[i % usualLocations.length],
          current: isUnusualLocation ? currentLocations[Math.floor(Math.random() * currentLocations.length)] : usualLocations[i % usualLocations.length],
          risk: isUnusualLocation ? 90 : 10
        },
        sessionDuration: {
          normal: 240 + Math.floor(Math.random() * 120),
          current: Math.floor(Math.random() * 600) + 30,
          unusual: Math.random() > 0.6
        }
      },
      timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
      riskLevel: riskLevel as 'low' | 'medium' | 'high' | 'critical',
      overallScore: riskScore
    };
  });
};

export default function BiometricsPanel() {
  const [biometricData, setBiometricData] = useState<BiometricData[]>([]);
  const [selectedSession, setSelectedSession] = useState<BiometricData | null>(null);

  const exportBiometricsReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSessions: biometricData.length,
        suspiciousSessions: biometricData.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length,
        averageScore: Math.round(biometricData.reduce((sum, s) => sum + s.overallScore, 0) / biometricData.length || 0),
        authenticDevices: biometricData.filter(s => s.deviceTrusted).length
      },
      sessions: biometricData.map(session => ({
        userId: session.userId,
        sessionId: session.sessionId,
        overallScore: session.overallScore,
        riskLevel: session.riskLevel,
        deviceTrusted: session.deviceTrusted,
        location: session.location,
        deviceInfo: session.deviceInfo,
        timestamp: session.timestamp,
        typingSpeedAnomaly: session.anomalies.typingSpeed.current !== session.anomalies.typingSpeed.normal,
        mouseBehaviorAnomaly: session.anomalies.mouseBehavior !== 'normal',
        touchPressureAnomaly: session.anomalies.touchPressure !== 'normal'
      }))
    };

    exportBiometricsData(reportData);
  };

  useEffect(() => {
    setBiometricData(generateBiometricData());
    
    const interval = setInterval(() => {
      setBiometricData(prev => prev.map(session => ({
        ...session,
        anomalies: {
          ...session.anomalies,
          typingSpeed: {
            ...session.anomalies.typingSpeed,
            current: session.anomalies.typingSpeed.normal + (Math.floor(Math.random() * 40) - 20)
          }
        },
        overallScore: Math.max(0, Math.min(100, session.overallScore + (Math.random() - 0.5) * 10))
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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

  const criticalSessions = biometricData.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high');

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalSessions.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>High-Risk Behavioral Anomalies Detected!</strong> {criticalSessions.length} session(s) showing suspicious patterns.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Fingerprint className="h-5 w-5 text-purple-500" />
                <span>Behavioral Biometrics Panel</span>
              </CardTitle>
              <CardDescription>
                Real-time analysis of user behavior patterns and anomalies
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportBiometricsReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sessions List */}
            <div className="space-y-3">
              <h3 className="font-medium mb-3">Active Sessions</h3>
              {biometricData.map((session) => (
                <div 
                  key={session.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSession?.id === session.id ? 'bg-accent' : 'bg-card/50 hover:bg-card/80'
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{session.userName}</div>
                      <div className="text-sm text-muted-foreground">{session.userId}</div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getRiskBgColor(session.riskLevel)} text-white border-0`}>
                        {session.riskLevel.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        Risk: {session.overallScore}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Session: {session.sessionId} • {session.timestamp.toLocaleTimeString()}
                  </div>
                  
                  <Progress value={session.overallScore} className="mt-2 h-2" />
                </div>
              ))}
            </div>

            {/* Session Details */}
            <div>
              <h3 className="font-medium mb-3">Session Analysis</h3>
              {selectedSession ? (
                <div className="space-y-4">
                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-3">Anomaly Detection</h4>
                    
                    {/* Typing Speed */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Keyboard className="h-4 w-4" />
                          <span className="text-sm">Typing Speed</span>
                        </div>
                        <Badge variant={selectedSession.anomalies.typingSpeed.deviation > 20 ? 'destructive' : 'secondary'}>
                          {selectedSession.anomalies.typingSpeed.deviation > 20 ? 'Anomaly' : 'Normal'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Normal: {selectedSession.anomalies.typingSpeed.normal} WPM • 
                        Current: {selectedSession.anomalies.typingSpeed.current} WPM
                      </div>
                      <Progress 
                        value={Math.max(0, 100 - selectedSession.anomalies.typingSpeed.deviation)} 
                        className="h-2" 
                      />
                    </div>

                    {/* Device Fingerprint */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4" />
                          <span className="text-sm">Device Fingerprint</span>
                        </div>
                        <Badge variant={selectedSession.anomalies.deviceFingerprint.match ? 'secondary' : 'destructive'}>
                          {selectedSession.anomalies.deviceFingerprint.match ? 'Match' : 'Mismatch'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Confidence: {selectedSession.anomalies.deviceFingerprint.confidence}%
                      </div>
                      <Progress 
                        value={selectedSession.anomalies.deviceFingerprint.confidence} 
                        className="h-2" 
                      />
                    </div>

                    {/* Login Pattern */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Login Pattern</span>
                        </div>
                        <Badge variant={selectedSession.anomalies.loginPattern.risk > 50 ? 'destructive' : 'secondary'}>
                          {selectedSession.anomalies.loginPattern.risk > 50 ? 'Unusual' : 'Normal'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Usual: {selectedSession.anomalies.loginPattern.usual} • 
                        Current: {selectedSession.anomalies.loginPattern.current}
                      </div>
                      <Progress 
                        value={Math.max(0, 100 - selectedSession.anomalies.loginPattern.risk)} 
                        className="h-2" 
                      />
                    </div>

                    {/* Location Pattern */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">Location Pattern</span>
                        </div>
                        <Badge variant={selectedSession.anomalies.locationPattern.risk > 50 ? 'destructive' : 'secondary'}>
                          {selectedSession.anomalies.locationPattern.risk > 50 ? 'Unusual' : 'Normal'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Usual: {selectedSession.anomalies.locationPattern.usual} • 
                        Current: {selectedSession.anomalies.locationPattern.current}
                      </div>
                      <Progress 
                        value={Math.max(0, 100 - selectedSession.anomalies.locationPattern.risk)} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-3">Risk Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Overall Risk Score</span>
                        <span className={`font-medium ${getRiskColor(selectedSession.riskLevel)}`}>
                          {selectedSession.overallScore}%
                        </span>
                      </div>
                      <Progress value={selectedSession.overallScore} className="h-3" />
                      
                      {selectedSession.overallScore > 70 && (
                        <Alert className="mt-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Recommendation:</strong> Immediate security review required. 
                            Consider additional authentication steps.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground bg-card border rounded-lg">
                  <Fingerprint className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a session to view detailed biometric analysis</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}