import React from 'react';
import { Card } from './ui/card';
import { ShieldCheck, Lock, CheckCircle2, XCircle, Activity, Clock, FileCheck } from 'lucide-react';
import { Badge } from './ui/badge';

export default function AIGuardrailsPanel() {
  const guardrailControls = [
    { name: 'Autonomous Execution', status: 'disabled', description: 'AI cannot take direct action on accounts', critical: true },
    { name: 'Confidence Threshold Enforcement', status: 'enabled', description: 'Min. 85% confidence required for recommendations', critical: true },
    { name: 'Policy Compliance Validation', status: 'enabled', description: 'All decisions validated against RBI/SEBI/AML rules', critical: true },
    { name: 'Audit Logging', status: 'enabled', description: 'Complete decision trail recorded for regulatory review', critical: true },
    { name: 'Human Review Requirement', status: 'enabled', description: 'High-risk actions require analyst approval', critical: false },
    { name: 'Bias Detection Monitoring', status: 'enabled', description: 'Statistical fairness checks on decision patterns', critical: false },
  ];

  const performanceMetrics = [
    { metric: 'Agent Decision Accuracy', value: '94.2%', target: '≥ 90%', status: 'good', period: 'Rolling 30 days' },
    { metric: 'False Positive Rate', value: '8.3%', target: '≤ 10%', status: 'good', period: 'Rolling 30 days' },
    { metric: 'Average Investigation Latency', value: '1.8s', target: '≤ 3.0s', status: 'good', period: 'Rolling 24 hours' },
    { metric: 'Policy Compliance Score', value: '100%', target: '100%', status: 'good', period: 'Rolling 7 days' },
  ];

  const evaluationHistory = [
    { timestamp: '2025-12-13 14:00:00', type: 'Model Performance', result: 'Pass', score: '94.2%' },
    { timestamp: '2025-12-13 12:00:00', type: 'Bias Audit', result: 'Pass', score: '98.1%' },
    { timestamp: '2025-12-13 08:00:00', type: 'Policy Compliance', result: 'Pass', score: '100%' },
    { timestamp: '2025-12-12 20:00:00', type: 'Model Performance', result: 'Pass', score: '93.8%' },
  ];

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">AI Guardrails & Evaluation Status</h3>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            All Systems Operational
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Guardrail Controls */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm uppercase tracking-wide text-muted-foreground">Safety Controls & Constraints</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {guardrailControls.map((control, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4 bg-muted/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {control.status === 'enabled' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{control.name}</p>
                  </div>
                  {control.critical && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      Critical
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground ml-6">{control.description}</p>
                <div className="mt-2 ml-6">
                  <Badge 
                    variant="outline" 
                    className={
                      control.status === 'enabled' 
                        ? 'bg-green-50 text-green-700 border-green-200 text-xs' 
                        : 'bg-red-50 text-red-700 border-red-200 text-xs'
                    }
                  >
                    {control.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm uppercase tracking-wide text-muted-foreground">Performance & Accuracy Metrics</h4>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Metric</th>
                  <th className="text-left px-4 py-3 font-medium">Current Value</th>
                  <th className="text-left px-4 py-3 font-medium">Target</th>
                  <th className="text-left px-4 py-3 font-medium">Period</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {performanceMetrics.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{metric.metric}</td>
                    <td className="px-4 py-3">{metric.value}</td>
                    <td className="px-4 py-3 text-muted-foreground">{metric.target}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{metric.period}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant="outline" 
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        On Target
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluation History */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm uppercase tracking-wide text-muted-foreground">Recent Evaluation Results</h4>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                  <th className="text-left px-4 py-3 font-medium">Evaluation Type</th>
                  <th className="text-left px-4 py-3 font-medium">Score</th>
                  <th className="text-left px-4 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {evaluationHistory.map((evaluation, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{evaluation.timestamp}</td>
                    <td className="px-4 py-3">{evaluation.type}</td>
                    <td className="px-4 py-3 font-semibold">{evaluation.score}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant="outline" 
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {evaluation.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Last Evaluation Timestamp */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileCheck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Last Evaluation Completed</p>
                <p className="text-xs text-muted-foreground">2025-12-13 14:00:00 UTC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Next Scheduled Evaluation</p>
              <p className="text-xs text-muted-foreground">2025-12-13 16:00:00 UTC</p>
            </div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-900">
            <strong>Regulatory Compliance:</strong> All AI agent operations comply with RBI guidelines on automated decision-making in financial services. 
            Human oversight is enforced for all high-risk determinations. Complete audit trails are maintained for regulatory inspection.
          </p>
        </div>
      </div>
    </Card>
  );
}
