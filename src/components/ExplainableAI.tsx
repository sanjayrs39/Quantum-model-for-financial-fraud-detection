import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Brain, TrendingUp, MapPin, Clock, DollarSign, Smartphone, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { exportAIExplanationReport } from '../utils/exportUtils';

interface AIExplanation {
  id: string;
  transactionId: string;
  accountId: string;
  amount: number;
  riskScore: number;
  decision: 'block' | 'flag' | 'approve';
  confidence: number;
  factors: {
    factor: string;
    weight: number;
    contribution: number;
    description: string;
    icon: React.ReactNode;
  }[];
  modelVersion: string;
  processingTime: number;
  timestamp: Date;
}

const generateAIExplanations = (): AIExplanation[] => {
  const factors = [
    {
      factor: 'Transaction Amount',
      icon: <DollarSign className="h-4 w-4" />,
      descriptions: [
        'Amount significantly higher than typical transaction pattern',
        'Amount within normal range for this customer',
        'Unusually large transaction for account type'
      ]
    },
    {
      factor: 'Geolocation Risk',
      icon: <MapPin className="h-4 w-4" />,
      descriptions: [
        'Transaction from high-risk geographic location',
        'Location consistent with customer travel history',
        'First-time transaction from this location'
      ]
    },
    {
      factor: 'Temporal Pattern',
      icon: <Clock className="h-4 w-4" />,
      descriptions: [
        'Transaction at unusual time outside normal hours',
        'Transaction timing consistent with user behavior',
        'Rapid succession of transactions detected'
      ]
    },
    {
      factor: 'Device Fingerprint',
      icon: <Smartphone className="h-4 w-4" />,
      descriptions: [
        'New device not previously associated with account',
        'Recognized device with normal fingerprint',
        'Device fingerprint shows signs of manipulation'
      ]
    },
    {
      factor: 'Velocity Analysis',
      icon: <TrendingUp className="h-4 w-4" />,
      descriptions: [
        'Transaction velocity exceeds normal thresholds',
        'Normal transaction frequency for this customer',
        'Burst pattern indicating potential fraud'
      ]
    }
  ];

  return Array.from({ length: 8 }, (_, i) => {
    const riskScore = Math.floor(Math.random() * 100);
    const decision = riskScore > 80 ? 'block' : riskScore > 60 ? 'flag' : 'approve';
    const confidence = 70 + Math.floor(Math.random() * 30);
    
    const selectedFactors = factors
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + Math.floor(Math.random() * 2))
      .map((factor, index) => {
        const weight = 15 + Math.floor(Math.random() * 25);
        const contribution = Math.floor(Math.random() * weight);
        return {
          factor: factor.factor,
          weight,
          contribution,
          description: factor.descriptions[Math.floor(Math.random() * factor.descriptions.length)],
          icon: factor.icon
        };
      });

    return {
      id: `ai-${i + 1}`,
      transactionId: `TXN${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      accountId: `AC${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      amount: Math.floor(Math.random() * 500000) + 10000,
      riskScore,
      decision: decision as 'block' | 'flag' | 'approve',
      confidence,
      factors: selectedFactors,
      modelVersion: `FraudNet-v${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 10)}`,
      processingTime: Math.floor(Math.random() * 150) + 50,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    };
  });
};

export default function ExplainableAI() {
  const [explanations, setExplanations] = useState<AIExplanation[]>([]);
  const [selectedExplanation, setSelectedExplanation] = useState<AIExplanation | null>(null);

  useEffect(() => {
    setExplanations(generateAIExplanations());
    
    const interval = setInterval(() => {
      const newExplanation = generateAIExplanations()[0];
      setExplanations(prev => [{ ...newExplanation, id: `ai-${Date.now()}` }, ...prev.slice(0, 9)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'block': return 'bg-red-500';
      case 'flag': return 'bg-orange-500';
      case 'approve': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'block': return <AlertTriangle className="h-4 w-4" />;
      case 'flag': return <AlertTriangle className="h-4 w-4" />;
      case 'approve': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Set first explanation as selected by default
  useEffect(() => {
    if (explanations.length > 0 && !selectedExplanation) {
      setSelectedExplanation(explanations[0]);
    }
  }, [explanations, selectedExplanation]);

  const exportAIReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalExplanations: explanations.length,
        highRiskDecisions: explanations.filter(e => e.riskScore > 70).length,
        blockRecommendations: explanations.filter(e => e.recommendation === 'block').length,
        flagRecommendations: explanations.filter(e => e.recommendation === 'flag').length,
        averageConfidence: Math.round(explanations.reduce((sum, e) => sum + e.confidence, 0) / explanations.length || 0)
      },
      explanations: explanations.map(exp => ({
        transactionId: exp.transactionId,
        riskScore: exp.riskScore,
        confidence: exp.confidence,
        recommendation: exp.recommendation,
        primaryReason: exp.primaryReason,
        keyFactors: exp.keyFactors.map(f => `${f.factor} (${f.impact}%)`).join(', '),
        details: exp.details
      }))
    };

    exportAIExplanationReport(reportData);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <span>Explainable AI Panel</span>
            </CardTitle>
            <CardDescription>
              Understanding AI decision-making process for fraud detection
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportAIReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Decisions List */}
          <div className="space-y-3">
            <h3 className="font-medium">Recent AI Decisions</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {explanations.map((explanation) => (
                <div 
                  key={explanation.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedExplanation?.id === explanation.id ? 'bg-accent' : 'bg-card/50 hover:bg-card/80'
                  }`}
                  onClick={() => setSelectedExplanation(explanation)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{explanation.transactionId}</div>
                      <div className="text-xs text-muted-foreground">{explanation.accountId}</div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={`${getDecisionColor(explanation.decision)} text-white border-0 text-xs`}>
                        {getDecisionIcon(explanation.decision)}
                        <span className="ml-1">{explanation.decision.toUpperCase()}</span>
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {explanation.confidence}% confidence
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Amount:</span> ₹{explanation.amount.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Risk:</span> {explanation.riskScore}%
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Time:</span> {explanation.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  <Progress value={explanation.riskScore} className="mt-2 h-1" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Explanation Details */}
          <div>
            <h3 className="font-medium mb-3">AI Decision Analysis</h3>
            {selectedExplanation ? (
              <Tabs defaultValue="factors" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="factors">Factors</TabsTrigger>
                  <TabsTrigger value="model">Model</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="factors" className="space-y-4">
                  <div className="p-4 bg-card border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Decision Summary</h4>
                      <Badge className={`${getDecisionColor(selectedExplanation.decision)} text-white border-0`}>
                        {selectedExplanation.decision.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Risk Score:</span>
                        <div className="font-medium">{selectedExplanation.riskScore}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <div className="font-medium">{selectedExplanation.confidence}%</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Risk Assessment</span>
                        <span className="font-medium">{selectedExplanation.riskScore}%</span>
                      </div>
                      <Progress value={selectedExplanation.riskScore} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-3">Contributing Factors</h4>
                    <div className="space-y-3">
                      {selectedExplanation.factors.map((factor, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {factor.icon}
                              <span className="font-medium text-sm">{factor.factor}</span>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">{factor.contribution}%</div>
                              <div className="text-xs text-muted-foreground">weight: {factor.weight}%</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">{factor.description}</div>
                          <Progress value={factor.contribution} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="model" className="space-y-4">
                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-3">Model Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-muted-foreground">Model Version:</span>
                          <div className="font-medium">{selectedExplanation.modelVersion}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Processing Time:</span>
                          <div className="font-medium">{selectedExplanation.processingTime}ms</div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Algorithm:</span>
                        <div className="font-medium">Gradient Boosted Decision Trees</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Training Data:</span>
                        <div className="font-medium">2.5M transactions (updated daily)</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Feature Count:</span>
                        <div className="font-medium">247 behavioral & transactional features</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-3">Model Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Precision</span>
                          <span className="font-medium">94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Recall</span>
                          <span className="font-medium">91.8%</span>
                        </div>
                        <Progress value={91.8} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>F1 Score</span>
                          <span className="font-medium">93.0%</span>
                        </div>
                        <Progress value={93.0} className="h-2" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-3">Decision Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <div className="font-medium">Transaction Received</div>
                          <div className="text-muted-foreground">{selectedExplanation.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <div className="font-medium">Feature Extraction Complete</div>
                          <div className="text-muted-foreground">+12ms</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="text-sm">
                          <div className="font-medium">Risk Assessment</div>
                          <div className="text-muted-foreground">+{selectedExplanation.processingTime - 30}ms</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getDecisionColor(selectedExplanation.decision)}`}></div>
                        <div className="text-sm">
                          <div className="font-medium">Decision: {selectedExplanation.decision.toUpperCase()}</div>
                          <div className="text-muted-foreground">+{selectedExplanation.processingTime}ms</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-card border rounded-lg">
                    <h4 className="font-medium mb-3">Processing Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data preprocessing</span>
                        <span>12ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Feature engineering</span>
                        <span>23ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Model inference</span>
                        <span>{selectedExplanation.processingTime - 45}ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Result formatting</span>
                        <span>10ms</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total processing time</span>
                        <span>{selectedExplanation.processingTime}ms</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-card border rounded-lg">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a transaction to view AI decision analysis</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}