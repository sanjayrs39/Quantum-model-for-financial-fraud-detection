import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Network, Users, DollarSign, Search, ZoomIn, ZoomOut, Globe, AlertTriangle, Eye, Target, Filter, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { exportTransactionAnalysis } from '../utils/exportUtils';

interface GraphNode {
  id: string;
  label: string;
  type: 'bank' | 'customer' | 'suspicious' | 'flagged' | 'external';
  x: number;
  y: number;
  connections: string[];
  amount?: number;
  riskScore: number;
  country: string;
  region: string;
}

interface GraphEdge {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  suspicious: boolean;
  type: 'domestic' | 'international' | 'crypto' | 'wire';
  status: 'completed' | 'pending' | 'blocked';
}

const generateGlobalNetworkData = () => {
  const nodes: GraphNode[] = [
    // Central suspicious account
    { id: 'n1', label: 'AC001234', type: 'flagged', x: 400, y: 200, connections: ['n2', 'n3', 'n4', 'n5'], riskScore: 95, country: 'Nigeria', region: 'Africa' },
    
    // Regional suspicious accounts
    { id: 'n2', label: 'AC005678', type: 'suspicious', x: 200, y: 120, connections: ['n1', 'n6', 'n7'], riskScore: 82, country: 'Ukraine', region: 'Europe' },
    { id: 'n3', label: 'AC009012', type: 'suspicious', x: 600, y: 120, connections: ['n1', 'n8', 'n9'], riskScore: 78, country: 'Thailand', region: 'Asia' },
    { id: 'n4', label: 'AC003456', type: 'suspicious', x: 300, y: 320, connections: ['n1', 'n10', 'n11'], riskScore: 75, country: 'Brazil', region: 'South America' },
    { id: 'n5', label: 'AC007890', type: 'suspicious', x: 500, y: 320, connections: ['n1', 'n12', 'n13'], riskScore: 71, country: 'India', region: 'Asia' },
    
    // Secondary network - Europe
    { id: 'n6', label: 'AC011111', type: 'customer', x: 100, y: 80, connections: ['n2'], riskScore: 45, country: 'Poland', region: 'Europe' },
    { id: 'n7', label: 'AC022222', type: 'customer', x: 150, y: 180, connections: ['n2'], riskScore: 38, country: 'Romania', region: 'Europe' },
    
    // Secondary network - Asia
    { id: 'n8', label: 'AC033333', type: 'customer', x: 700, y: 80, connections: ['n3'], riskScore: 52, country: 'Cambodia', region: 'Asia' },
    { id: 'n9', label: 'AC044444', type: 'external', x: 650, y: 180, connections: ['n3'], riskScore: 67, country: 'Myanmar', region: 'Asia' },
    
    // Secondary network - South America
    { id: 'n10', label: 'AC055555', type: 'customer', x: 200, y: 380, connections: ['n4'], riskScore: 41, country: 'Colombia', region: 'South America' },
    { id: 'n11', label: 'AC066666', type: 'customer', x: 250, y: 420, connections: ['n4'], riskScore: 36, country: 'Venezuela', region: 'South America' },
    
    // Secondary network - Asia (India)
    { id: 'n12', label: 'AC077777', type: 'customer', x: 580, y: 380, connections: ['n5'], riskScore: 43, country: 'Bangladesh', region: 'Asia' },
    { id: 'n13', label: 'AC088888', type: 'external', x: 530, y: 420, connections: ['n5'], riskScore: 59, country: 'Nepal', region: 'Asia' },
    
    // Banks and Financial Institutions
    { id: 'b1', label: 'SecureBank', type: 'bank', x: 400, y: 50, connections: ['n1', 'n2', 'n3'], riskScore: 15, country: 'USA', region: 'North America' },
    { id: 'b2', label: 'EuroBank', type: 'bank', x: 100, y: 200, connections: ['n2', 'n6', 'n7'], riskScore: 22, country: 'Germany', region: 'Europe' },
    { id: 'b3', label: 'AsiaFin', type: 'bank', x: 700, y: 200, connections: ['n3', 'n8', 'n9'], riskScore: 28, country: 'Singapore', region: 'Asia' },
    
    // Crypto exchanges
    { id: 'c1', label: 'CryptoEx1', type: 'external', x: 50, y: 350, connections: ['n2', 'n4'], riskScore: 73, country: 'Malta', region: 'Europe' },
    { id: 'c2', label: 'CryptoEx2', type: 'external', x: 750, y: 350, connections: ['n3', 'n5'], riskScore: 68, country: 'Seychelles', region: 'Africa' },
  ];

  const edges: GraphEdge[] = [
    // Main suspicious network
    { from: 'n1', to: 'n2', amount: 2500000, timestamp: '2 mins ago', suspicious: true, type: 'international', status: 'completed' },
    { from: 'n1', to: 'n3', amount: 1800000, timestamp: '5 mins ago', suspicious: true, type: 'international', status: 'completed' },
    { from: 'n1', to: 'n4', amount: 950000, timestamp: '8 mins ago', suspicious: true, type: 'international', status: 'blocked' },
    { from: 'n1', to: 'n5', amount: 3200000, timestamp: '12 mins ago', suspicious: true, type: 'wire', status: 'completed' },
    
    // Regional networks
    { from: 'n2', to: 'n6', amount: 450000, timestamp: '15 mins ago', suspicious: false, type: 'domestic', status: 'completed' },
    { from: 'n2', to: 'n7', amount: 320000, timestamp: '18 mins ago', suspicious: false, type: 'domestic', status: 'completed' },
    { from: 'n3', to: 'n8', amount: 680000, timestamp: '22 mins ago', suspicious: true, type: 'domestic', status: 'pending' },
    { from: 'n3', to: 'n9', amount: 890000, timestamp: '25 mins ago', suspicious: true, type: 'international', status: 'completed' },
    { from: 'n4', to: 'n10', amount: 230000, timestamp: '28 mins ago', suspicious: false, type: 'domestic', status: 'completed' },
    { from: 'n4', to: 'n11', amount: 340000, timestamp: '32 mins ago', suspicious: false, type: 'domestic', status: 'completed' },
    { from: 'n5', to: 'n12', amount: 560000, timestamp: '35 mins ago', suspicious: false, type: 'domestic', status: 'completed' },
    { from: 'n5', to: 'n13', amount: 720000, timestamp: '38 mins ago', suspicious: true, type: 'international', status: 'blocked' },
    
    // Bank connections
    { from: 'b1', to: 'n1', amount: 5000000, timestamp: '1 hour ago', suspicious: true, type: 'wire', status: 'completed' },
    { from: 'b2', to: 'n2', amount: 1200000, timestamp: '1.5 hours ago', suspicious: false, type: 'wire', status: 'completed' },
    { from: 'b3', to: 'n3', amount: 2100000, timestamp: '2 hours ago', suspicious: true, type: 'wire', status: 'completed' },
    
    // Crypto connections
    { from: 'c1', to: 'n2', amount: 1500000, timestamp: '45 mins ago', suspicious: true, type: 'crypto', status: 'completed' },
    { from: 'c1', to: 'n4', amount: 890000, timestamp: '50 mins ago', suspicious: true, type: 'crypto', status: 'blocked' },
    { from: 'c2', to: 'n3', amount: 2300000, timestamp: '55 mins ago', suspicious: true, type: 'crypto', status: 'completed' },
    { from: 'c2', to: 'n5', amount: 1700000, timestamp: '1 hour ago', suspicious: true, type: 'crypto', status: 'completed' },
  ];

  return { nodes, edges };
};

export default function TransactionGraph() {
  const [graphData, setGraphData] = useState(generateGlobalNetworkData());
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const [highlightedCluster, setHighlightedCluster] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('network');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => ({
          ...node,
          riskScore: Math.max(0, Math.min(100, node.riskScore + (Math.random() - 0.5) * 3))
        }))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (type: string, riskScore: number) => {
    switch (type) {
      case 'flagged': return '#ef4444';
      case 'suspicious': return '#f97316';
      case 'bank': return '#3b82f6';
      case 'external': return '#8b5cf6';
      case 'customer': return riskScore > 50 ? '#eab308' : '#22c55e';
      default: return '#6b7280';
    }
  };

  const getEdgeColor = (edge: GraphEdge) => {
    if (edge.status === 'blocked') return '#ef4444';
    if (edge.suspicious) return '#f97316';
    if (edge.type === 'crypto') return '#8b5cf6';
    if (edge.type === 'international') return '#3b82f6';
    return '#6b7280';
  };

  const getEdgeWidth = (edge: GraphEdge) => {
    if (edge.status === 'blocked') return 4;
    if (edge.suspicious) return 3;
    if (edge.amount > 1000000) return 3;
    return 2;
  };

  const exportGraphData = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      searchQuery,
      timeRange,
      summary: {
        totalNodes: graphData.nodes.length,
        totalEdges: graphData.edges.length,
        suspiciousConnections: graphData.edges.filter(e => e.suspicious).length,
        blockedTransactions: graphData.edges.filter(e => e.status === 'blocked').length,
        totalTransactionVolume: graphData.edges.reduce((sum, e) => sum + e.amount, 0)
      },
      nodes: graphData.nodes.map(node => ({
        id: node.id,
        label: node.label,
        type: node.type,
        riskLevel: node.riskLevel,
        balance: node.balance,
        connectionCount: graphData.edges.filter(e => e.source === node.id || e.target === node.id).length,
        flagged: node.flagged
      })),
      transactions: graphData.edges.map(edge => ({
        id: edge.id,
        sourceAccount: edge.source,
        targetAccount: edge.target,
        amount: edge.amount,
        type: edge.type,
        status: edge.status,
        suspicious: edge.suspicious,
        timestamp: edge.timestamp,
        description: edge.description
      }))
    };

    exportTransactionAnalysis(reportData);
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    // Highlight connected nodes and edges
    const cluster = [node.id, ...node.connections];
    setHighlightedCluster(cluster);
  };

  const handleEdgeClick = (edge: GraphEdge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
    setHighlightedCluster([edge.from, edge.to]);
  };

  const detectFraudRing = () => {
    const suspiciousNodes = graphData.nodes
      .filter(n => n.type === 'suspicious' || n.type === 'flagged')
      .map(n => n.id);
    setHighlightedCluster(suspiciousNodes);
  };

  const analyzeFlow = (direction: 'incoming' | 'outgoing') => {
    if (!selectedNode) return;
    
    const relevantEdges = graphData.edges.filter(edge => 
      direction === 'incoming' ? edge.to === selectedNode.id : edge.from === selectedNode.id
    );
    
    const connectedNodes = relevantEdges.map(edge => 
      direction === 'incoming' ? edge.from : edge.to
    );
    
    setHighlightedCluster([selectedNode.id, ...connectedNodes]);
  };

  const filteredNodes = graphData.nodes.filter(node => {
    if (filterRegion !== 'all' && node.region !== filterRegion) return false;
    if (filterType !== 'all' && node.type !== filterType) return false;
    if (searchTerm && !node.label.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !node.country.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredEdges = graphData.edges.filter(edge => {
    const fromNode = graphData.nodes.find(n => n.id === edge.from);
    const toNode = graphData.nodes.find(n => n.id === edge.to);
    return filteredNodes.includes(fromNode!) && filteredNodes.includes(toNode!);
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-blue-500" />
              <span>Global Transaction Network</span>
              <Badge variant="outline" className="ml-2">
                {filteredNodes.length} entities
              </Badge>
            </CardTitle>
            <CardDescription>
              Interactive analysis of global financial transaction patterns and fraud networks
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={exportGraphData}>
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Live Network</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="network">Network View</TabsTrigger>
            <TabsTrigger value="analysis">Flow Analysis</TabsTrigger>
            <TabsTrigger value="intelligence">Threat Intel</TabsTrigger>
          </TabsList>

          <TabsContent value="network">
            {/* Enhanced Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
              <Input
                placeholder="Search accounts or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 h-9"
              />
              
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="Africa">Africa</SelectItem>
                  <SelectItem value="South America">South America</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bank">Banks</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="suspicious">Suspicious</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={detectFraudRing}>
                  <Target className="h-4 w-4 mr-1" />
                  Detect Ring
                </Button>
                <Button size="sm" variant="outline" onClick={() => setHighlightedCluster([])}>
                  Clear
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 ml-auto">
                <Button size="sm" variant="outline" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
                <Button size="sm" variant="outline" onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Enhanced Graph Visualization */}
            <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-800 rounded-xl h-[500px] overflow-hidden border border-blue-200/30">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 800 500"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                className="cursor-grab active:cursor-grabbing"
              >
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Edges */}
                {filteredEdges.map((edge, index) => {
                  const fromNode = graphData.nodes.find(n => n.id === edge.from);
                  const toNode = graphData.nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isHighlighted = highlightedCluster.includes(edge.from) && highlightedCluster.includes(edge.to);
                  const isSelected = selectedEdge?.from === edge.from && selectedEdge?.to === edge.to;
                  
                  return (
                    <g key={index}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={getEdgeColor(edge)}
                        strokeWidth={isSelected ? getEdgeWidth(edge) + 2 : isHighlighted ? getEdgeWidth(edge) + 1 : getEdgeWidth(edge)}
                        strokeDasharray={edge.suspicious ? '8,4' : edge.type === 'crypto' ? '4,4' : 'none'}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => handleEdgeClick(edge)}
                        opacity={isHighlighted || highlightedCluster.length === 0 ? 1 : 0.3}
                      />
                      
                      {/* Arrow marker */}
                      <polygon
                        points={`${toNode.x - 10},${toNode.y - 5} ${toNode.x},${toNode.y} ${toNode.x - 10},${toNode.y + 5}`}
                        fill={getEdgeColor(edge)}
                        opacity={isHighlighted || highlightedCluster.length === 0 ? 1 : 0.3}
                      />
                      
                      {/* Amount label */}
                      {(isHighlighted || highlightedCluster.length === 0) && (
                        <text
                          x={(fromNode.x + toNode.x) / 2}
                          y={(fromNode.y + toNode.y) / 2 - 10}
                          fill="currentColor"
                          className="text-xs fill-foreground font-medium"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          ₹{(edge.amount / 100000).toFixed(1)}L
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {filteredNodes.map((node) => {
                  const isHighlighted = highlightedCluster.includes(node.id);
                  const isSelected = selectedNode?.id === node.id;
                  const baseSize = node.type === 'bank' ? 25 : 20;
                  const size = isSelected ? baseSize + 8 : isHighlighted ? baseSize + 4 : baseSize;
                  
                  return (
                    <g key={node.id}>
                      {/* Node glow effect for suspicious nodes */}
                      {(node.type === 'suspicious' || node.type === 'flagged') && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={size + 5}
                          fill={getNodeColor(node.type, node.riskScore)}
                          opacity="0.2"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Main node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={size}
                        fill={getNodeColor(node.type, node.riskScore)}
                        stroke={isSelected ? '#1f2937' : '#ffffff'}
                        strokeWidth={isSelected ? 4 : 2}
                        className="cursor-pointer transition-all duration-200 drop-shadow-lg"
                        onClick={() => handleNodeClick(node)}
                        opacity={isHighlighted || highlightedCluster.length === 0 ? 1 : 0.4}
                      />
                      
                      {/* Risk score or type indicator */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fill="white"
                        className="text-xs font-bold"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {node.type === 'bank' ? 'B' : node.type === 'external' ? 'E' : node.riskScore}
                      </text>
                      
                      {/* Node label */}
                      <text
                        x={node.x}
                        y={node.y + size + 15}
                        fill="currentColor"
                        className="text-xs fill-foreground font-medium"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {node.label}
                      </text>
                      
                      {/* Country label */}
                      <text
                        x={node.x}
                        y={node.y + size + 28}
                        fill="currentColor"
                        className="text-xs fill-muted-foreground"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {node.country}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedNode && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Flow Analysis: {selectedNode.label}</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={() => analyzeFlow('incoming')}
                      className="w-full justify-start"
                    >
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Analyze Incoming Flows
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => analyzeFlow('outgoing')}
                      className="w-full justify-start"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analyze Outgoing Flows
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="font-semibold">Network Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-red-500">{graphData.nodes.filter(n => n.type === 'flagged').length}</div>
                    <div className="text-sm text-muted-foreground">Flagged Accounts</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-500">{graphData.nodes.filter(n => n.type === 'suspicious').length}</div>
                    <div className="text-sm text-muted-foreground">Suspicious Accounts</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">{graphData.edges.filter(e => e.type === 'crypto').length}</div>
                    <div className="text-sm text-muted-foreground">Crypto Transactions</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{graphData.edges.filter(e => e.type === 'international').length}</div>
                    <div className="text-sm text-muted-foreground">International Transfers</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intelligence">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {graphData.nodes
                  .filter(node => node.type === 'suspicious' || node.type === 'flagged')
                  .sort((a, b) => b.riskScore - a.riskScore)
                  .map((node) => (
                    <div key={node.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{node.label}</span>
                        <Badge className={`text-white border-0`} style={{ backgroundColor: getNodeColor(node.type, node.riskScore) }}>
                          {node.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Risk Score:</span>
                          <span className="font-medium">{node.riskScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Country:</span>
                          <span>{node.country}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Connections:</span>
                          <span>{node.connections.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Details Panels */}
        {selectedNode && (
          <div className="mt-6 p-6 bg-gradient-to-r from-card to-card/80 border rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg" 
                  style={{ backgroundColor: getNodeColor(selectedNode.type, selectedNode.riskScore) }}
                ></div>
                <h4 className="text-xl font-bold">{selectedNode.label}</h4>
                <Badge className="text-white border-0" style={{ backgroundColor: getNodeColor(selectedNode.type, selectedNode.riskScore) }}>
                  {selectedNode.type.toUpperCase()}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Risk Score</span>
                <div className="text-2xl font-bold" style={{ color: getNodeColor(selectedNode.type, selectedNode.riskScore) }}>
                  {selectedNode.riskScore}%
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Location</span>
                <div className="font-semibold">{selectedNode.country}</div>
                <div className="text-xs text-muted-foreground">{selectedNode.region}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Connections</span>
                <div className="text-2xl font-bold">{selectedNode.connections.length}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Status</span>
                <div className="font-semibold capitalize">{selectedNode.type}</div>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-muted-foreground font-medium">Connected Accounts:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedNode.connections.map(connId => {
                  const connectedNode = graphData.nodes.find(n => n.id === connId);
                  return connectedNode ? (
                    <Badge 
                      key={connId} 
                      variant="secondary" 
                      className="text-xs cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleNodeClick(connectedNode)}
                    >
                      {connectedNode.label} ({connectedNode.country})
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {selectedEdge && (
          <div className="mt-6 p-6 bg-gradient-to-r from-card to-card/80 border rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold">Transaction Details</h4>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEdge(null)}>
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Amount</span>
                <div className="text-2xl font-bold">₹{selectedEdge.amount.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Type</span>
                <div className="font-semibold capitalize">{selectedEdge.type}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Status</span>
                <Badge className={`${
                  selectedEdge.status === 'blocked' ? 'bg-red-500' :
                  selectedEdge.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                } text-white border-0`}>
                  {selectedEdge.status.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Time</span>
                <div className="font-semibold">{selectedEdge.timestamp}</div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Legend */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium mb-3">Entity Types</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Flagged Account</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span>Suspicious Account</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>Bank/Institution</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span>External Entity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Regular Customer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>At-Risk Customer</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Transaction Types</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-red-500" style={{ borderTop: '3px dashed' }}></div>
                <span>Suspicious Transfer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-purple-500" style={{ borderTop: '2px dashed' }}></div>
                <span>Crypto Transaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-blue-500"></div>
                <span>International Wire</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-gray-500"></div>
                <span>Domestic Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}