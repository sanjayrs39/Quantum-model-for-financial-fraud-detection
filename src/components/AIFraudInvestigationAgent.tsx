import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Brain, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface InvestigationResult {
  status: 'active' | 'idle';
  modelType: string;
  confidenceScore: number;
  recommendedAction: 'approve' | 'block' | 'escalate';
  reasoningFactors: string[];
  transactionId: string;
  timestamp: Date;
}

const generateInvestigationResult = (): InvestigationResult => {
  const actions: ('approve' | 'block' | 'escalate')[] = ['approve', 'block', 'escalate'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  const reasoningByAction = {
    approve: [
      'Transaction amount aligns with customer\'s 6-month baseline pattern',
      'Geolocation matches known trusted locations in customer travel history',
      'Device fingerprint verified against registered devices',
      'Behavioral biometrics correlation: 97.3% match to established profile',
      'Merchant category consistent with customer purchase patterns',
      'Transaction timing falls within normal activity hours for this account'
    ],
    block: [
      'Transaction originated from jurisdiction flagged by FATF as high-risk',
      'Device fingerprint: unrecognized and inconsistent with account history',
      'Transaction velocity anomaly: 340% above established threshold',
      'Amount structuring pattern detected across linked account network',
      'Behavioral biometrics show typing cadence variance of 89%',
      'IP address associated with known fraudulent activity cluster'
    ],
    escalate: [
      'Transaction exhibits elevated amount: +215% above customer baseline',
      'Merchant category falls outside typical spending profile',
      'Geolocation anomaly detected: 350km distance from prior transaction 22 minutes ago',
      'Customer travel notification on file creates conflicting signals',
      'Cross-border transaction to medium-risk jurisdiction requires review',
      'Velocity metrics slightly elevated but not conclusively fraudulent'
    ]
  };

  const selectedFactors = reasoningByAction[action]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4 + Math.floor(Math.random() * 2));

  const confidenceScore = action === 'approve' 
    ? 85 + Math.floor(Math.random() * 15)
    : action === 'block' 
      ? 80 + Math.floor(Math.random() * 20)
      : 65 + Math.floor(Math.random() * 20);

  return {
    status: Math.random() > 0.3 ? 'active' : 'idle',
    modelType: 'Hybrid Classical–Quantum + LLM Agent',
    confidenceScore,
    recommendedAction: action,
    reasoningFactors: selectedFactors,
    transactionId: `TXN-${String(Math.floor(Math.random() * 9999999)).padStart(7, '0')}`,
    timestamp: new Date()
  };
};

export default function AIFraudInvestigationAgent() {
  const [investigation, setInvestigation] = useState<InvestigationResult>(generateInvestigationResult());

  useEffect(() => {
    // Simulate periodic updates to agent status
    const interval = setInterval(() => {
      setInvestigation(prev => ({
        ...prev,
        status: Math.random() > 0.7 ? (prev.status === 'active' ? 'idle' : 'active') : prev.status
      }));
    }, 8000);

    // Simulate new investigation cases periodically
    const caseInterval = setInterval(() => {
      setInvestigation(generateInvestigationResult());
    }, 25000);

    return () => {
      clearInterval(interval);
      clearInterval(caseInterval);
    };
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approve':
        return <CheckCircle className="h-4 w-4" />;
      case 'block':
        return <XCircle className="h-4 w-4" />;
      case 'escalate':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approve':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'block':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'escalate':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
      : 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20';
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <CardTitle>AI Fraud Investigation Agent</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Agent Status and Model */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Agent State</label>
            <Badge className={`${getStatusColor(investigation.status)} border px-3 py-1.5 w-fit`}>
              <span className="mr-2">●</span>
              {investigation.status.charAt(0).toUpperCase() + investigation.status.slice(1)}
            </Badge>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Transaction ID</label>
            <p className="text-sm font-mono text-foreground/80">{investigation.transactionId}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Model Information */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Model</label>
          <div className="bg-muted/40 rounded-md px-3 py-2.5 border border-border/50">
            <p className="text-sm text-foreground/90">{investigation.modelType}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Confidence Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Decision Confidence</label>
            <span className="text-sm font-mono text-foreground/90">{investigation.confidenceScore}%</span>
          </div>
          <Progress value={investigation.confidenceScore} className="h-2" />
        </div>

        <Separator className="my-4" />

        {/* AI Recommendation */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wide">AI-Recommended Action</label>
          <div className="flex items-start space-x-2">
            <Badge className={`${getActionColor(investigation.recommendedAction)} border px-3 py-2 text-sm`}>
              <span className="mr-2">{getActionIcon(investigation.recommendedAction)}</span>
              {investigation.recommendedAction.charAt(0).toUpperCase() + investigation.recommendedAction.slice(1)}
            </Badge>
            <p className="text-xs text-muted-foreground italic pt-1.5">
              Recommendation only — analyst review required
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Investigation Reasoning */}
        <div className="space-y-3">
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Investigation Reasoning</label>
          <div className="bg-muted/30 rounded-md px-4 py-4 border border-border/50">
            <ul className="space-y-2.5">
              {investigation.reasoningFactors.map((factor, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-muted-foreground mt-1 text-xs">•</span>
                  <span className="text-sm leading-relaxed text-foreground/85">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}