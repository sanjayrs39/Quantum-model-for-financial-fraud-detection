import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Globe, MapPin, TrendingUp, Zap, Activity, AlertTriangle, Eye, Filter, X, Download } from 'lucide-react';
import { exportHeatmapReport } from '../utils/exportUtils';

interface HotspotData {
  id: string;
  country: string;
  city: string;
  fraudCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable';
  coordinates: { x: number; y: number };
  fraudTypes: string[];
  avgAmount: number;
  detectionRate: number;
}

const hotspots: HotspotData[] = [
  { 
    id: '1', 
    country: 'Nigeria', 
    city: 'Lagos', 
    fraudCount: 1247, 
    riskLevel: 'critical', 
    trend: 'up', 
    coordinates: { x: 52, y: 58 },
    fraudTypes: ['Wire Transfer', 'Mobile Payment', 'ATM Skimming'],
    avgAmount: 125000,
    detectionRate: 78
  },
  { 
    id: '2', 
    country: 'Ukraine', 
    city: 'Kiev', 
    fraudCount: 923, 
    riskLevel: 'critical', 
    trend: 'up', 
    coordinates: { x: 55, y: 35 },
    fraudTypes: ['Card Fraud', 'Online Banking', 'Cryptocurrency'],
    avgAmount: 89000,
    detectionRate: 82
  },
  { 
    id: '3', 
    country: 'Thailand', 
    city: 'Bangkok', 
    fraudCount: 712, 
    riskLevel: 'high', 
    trend: 'stable', 
    coordinates: { x: 78, y: 65 },
    fraudTypes: ['ATM Withdrawal', 'Card Cloning', 'Mobile Banking'],
    avgAmount: 67000,
    detectionRate: 85
  },
  { 
    id: '4', 
    country: 'Brazil', 
    city: 'São Paulo', 
    fraudCount: 589, 
    riskLevel: 'high', 
    trend: 'down', 
    coordinates: { x: 30, y: 75 },
    fraudTypes: ['Pix Transfer', 'Credit Card', 'Online Purchase'],
    avgAmount: 45000,
    detectionRate: 91
  },
  { 
    id: '5', 
    country: 'India', 
    city: 'Mumbai', 
    fraudCount: 456, 
    riskLevel: 'medium', 
    trend: 'stable', 
    coordinates: { x: 72, y: 60 },
    fraudTypes: ['UPI Fraud', 'ATM Fraud', 'Digital Wallet'],
    avgAmount: 32000,
    detectionRate: 88
  },
  { 
    id: '6', 
    country: 'UK', 
    city: 'London', 
    fraudCount: 298, 
    riskLevel: 'medium', 
    trend: 'down', 
    coordinates: { x: 48, y: 32 },
    fraudTypes: ['Card Present', 'Online Banking', 'APP Fraud'],
    avgAmount: 156000,
    detectionRate: 94
  },
  { 
    id: '7', 
    country: 'Russia', 
    city: 'Moscow', 
    fraudCount: 634, 
    riskLevel: 'high', 
    trend: 'up', 
    coordinates: { x: 58, y: 28 },
    fraudTypes: ['Card Fraud', 'Wire Transfer', 'Cryptocurrency'],
    avgAmount: 78000,
    detectionRate: 76
  },
  { 
    id: '8', 
    country: 'China', 
    city: 'Shanghai', 
    fraudCount: 423, 
    riskLevel: 'medium', 
    trend: 'stable', 
    coordinates: { x: 82, y: 52 },
    fraudTypes: ['Mobile Payment', 'Online Banking', 'QR Code'],
    avgAmount: 54000,
    detectionRate: 89
  },
  { 
    id: '9', 
    country: 'Mexico', 
    city: 'Mexico City', 
    fraudCount: 367, 
    riskLevel: 'medium', 
    trend: 'up', 
    coordinates: { x: 18, y: 62 },
    fraudTypes: ['ATM Fraud', 'Card Skimming', 'Mobile Banking'],
    avgAmount: 38000,
    detectionRate: 83
  },
  { 
    id: '10', 
    country: 'South Africa', 
    city: 'Cape Town', 
    fraudCount: 289, 
    riskLevel: 'medium', 
    trend: 'down', 
    coordinates: { x: 54, y: 85 },
    fraudTypes: ['Card Fraud', 'ATM Skimming', 'Mobile Money'],
    avgAmount: 28000,
    detectionRate: 87
  },
  { 
    id: '11', 
    country: 'USA', 
    city: 'New York', 
    fraudCount: 234, 
    riskLevel: 'low', 
    trend: 'down', 
    coordinates: { x: 25, y: 45 },
    fraudTypes: ['Credit Card', 'ACH Fraud', 'Check Fraud'],
    avgAmount: 187000,
    detectionRate: 96
  },
  { 
    id: '12', 
    country: 'Philippines', 
    city: 'Manila', 
    fraudCount: 345, 
    riskLevel: 'medium', 
    trend: 'up', 
    coordinates: { x: 85, y: 68 },
    fraudTypes: ['Mobile Money', 'Online Banking', 'Remittance'],
    avgAmount: 23000,
    detectionRate: 81
  }
];

export default function FraudHeatmap() {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [animatingHotspots, setAnimatingHotspots] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('global');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filteredHotspots, setFilteredHotspots] = useState(hotspots);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomHotspot = hotspots[Math.floor(Math.random() * hotspots.length)];
      setAnimatingHotspots(prev => new Set([...prev, randomHotspot.id]));
      
      setTimeout(() => {
        setAnimatingHotspots(prev => {
          const newSet = new Set(prev);
          newSet.delete(randomHotspot.id);
          return newSet;
        });
      }, 1500);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = hotspots;
    if (filterRisk !== 'all') {
      filtered = hotspots.filter(hotspot => hotspot.riskLevel === filterRisk);
    }
    setFilteredHotspots(filtered);
  }, [filterRisk]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPulseColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 shadow-red-500/50';
      case 'high': return 'border-orange-500 shadow-orange-500/50';
      case 'medium': return 'border-yellow-500 shadow-yellow-500/50';
      case 'low': return 'border-green-500 shadow-green-500/50';
      default: return 'border-gray-500';
    }
  };

  const exportHeatmapData = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      activeTab,
      summary: {
        totalHotspots: hotspots.length,
        criticalHotspots: hotspots.filter(h => h.riskLevel === 'critical').length,
        totalIncidents: hotspots.reduce((sum, h) => sum + h.incidentCount, 0),
        totalAmount: hotspots.reduce((sum, h) => sum + h.amount, 0)
      },
      regions: hotspots.map(hotspot => ({
        location: hotspot.location,
        country: hotspot.country,
        incidentCount: hotspot.incidentCount,
        amount: hotspot.amount,
        riskLevel: hotspot.riskLevel,
        coordinates: `${hotspot.lat}, ${hotspot.lng}`,
        recentActivity: hotspot.recentActivity,
        trendDirection: hotspot.trend > 0 ? 'increasing' : 'decreasing',
        trendPercentage: Math.abs(hotspot.trend)
      }))
    };

    exportHeatmapReport(reportData);
  };

  const getMarkerSize = (fraudCount: number) => {
    if (fraudCount > 1000) return 'w-6 h-6';
    if (fraudCount > 500) return 'w-5 h-5';
    if (fraudCount > 200) return 'w-4 h-4';
    return 'w-3 h-3';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span>Global Threat Intelligence Map</span>
              <Badge variant="outline" className="ml-2">
                {filteredHotspots.length} hotspots
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time fraud activity monitoring across global financial networks
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Live Intelligence</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={exportHeatmapData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global">Global View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="details">Threat Details</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <div className="relative">
              {/* Enhanced World Map */}
              <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-xl p-8 h-96 overflow-hidden border border-blue-200/20">
                <svg
                  viewBox="0 0 100 60"
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                >
                  {/* Enhanced world map with more detail */}
                  <defs>
                    <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  
                  {/* North America */}
                  <path
                    d="M10,25 L25,20 L35,25 L40,30 L35,35 L30,40 L25,38 L20,42 L15,40 L10,35 Z"
                    fill="url(#continentGradient)"
                    stroke="#3b82f6"
                    strokeWidth="0.2"
                  />
                  
                  {/* Europe */}
                  <path
                    d="M45,25 L55,22 L60,28 L58,32 L52,35 L48,32 L45,28 Z"
                    fill="url(#continentGradient)"
                    stroke="#3b82f6"
                    strokeWidth="0.2"
                  />
                  
                  {/* Asia */}
                  <path
                    d="M60,20 L85,18 L90,25 L88,35 L82,40 L75,42 L70,38 L65,35 L62,30 L60,25 Z"
                    fill="url(#continentGradient)"
                    stroke="#3b82f6"
                    strokeWidth="0.2"
                  />
                  
                  {/* Africa */}
                  <path
                    d="M45,40 L55,38 L58,45 L60,55 L55,58 L50,55 L45,52 L42,48 L45,42 Z"
                    fill="url(#continentGradient)"
                    stroke="#3b82f6"
                    strokeWidth="0.2"
                  />
                  
                  {/* South America */}
                  <path
                    d="M25,45 L35,42 L38,50 L36,58 L32,60 L28,58 L24,52 L25,48 Z"
                    fill="url(#continentGradient)"
                    stroke="#3b82f6"
                    strokeWidth="0.2"
                  />
                  
                  {/* Australia */}
                  <path
                    d="M75,50 L85,48 L88,52 L85,55 L80,56 L75,54 Z"
                    fill="url(#continentGradient)"
                    stroke="#3b82f6"
                    strokeWidth="0.2"
                  />
                </svg>

                {/* Connection lines between hotspots */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {filteredHotspots.slice(0, 6).map((hotspot, index) => {
                    const nextHotspot = filteredHotspots[(index + 1) % 6];
                    return (
                      <line
                        key={`line-${hotspot.id}-${nextHotspot.id}`}
                        x1={`${hotspot.coordinates.x}%`}
                        y1={`${hotspot.coordinates.y}%`}
                        x2={`${nextHotspot.coordinates.x}%`}
                        y2={`${nextHotspot.coordinates.y}%`}
                        stroke="#ef4444"
                        strokeWidth="1"
                        strokeOpacity="0.3"
                        strokeDasharray="2,2"
                        className="animate-pulse"
                      />
                    );
                  })}
                </svg>

                {/* Enhanced Hotspot markers */}
                {filteredHotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${hotspot.coordinates.x}%`,
                      top: `${hotspot.coordinates.y}%`,
                    }}
                    onClick={() => setSelectedHotspot(hotspot)}
                  >
                    <div className="relative">
                      {/* Outer pulse ring */}
                      {animatingHotspots.has(hotspot.id) && (
                        <div className={`absolute inset-0 rounded-full border-2 ${getPulseColor(hotspot.riskLevel)} animate-ping opacity-75`}></div>
                      )}
                      
                      {/* Hotspot marker with size based on fraud count */}
                      <div className={`${getMarkerSize(hotspot.fraudCount)} rounded-full ${getRiskColor(hotspot.riskLevel)} border-2 border-white shadow-xl z-10 relative transform group-hover:scale-125 transition-transform duration-200`}>
                        <div className="absolute inset-0 rounded-full bg-white/40 animate-pulse"></div>
                        <div className="absolute inset-1 rounded-full bg-white/20"></div>
                      </div>
                      
                      {/* Enhanced info popup on hover */}
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                        <div className="font-bold">{hotspot.city}</div>
                        <div>{hotspot.fraudCount} threats</div>
                        <div className="text-xs text-gray-300">₹{hotspot.avgAmount.toLocaleString()} avg</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced hotspot details */}
              {selectedHotspot && (
                <div className="mt-6 p-6 bg-gradient-to-r from-card to-card/80 border rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getRiskColor(selectedHotspot.riskLevel)} shadow-lg`}></div>
                      <h4 className="text-xl font-bold">{selectedHotspot.city}, {selectedHotspot.country}</h4>
                      <Badge className={`${getRiskColor(selectedHotspot.riskLevel)} text-white border-0`}>
                        {selectedHotspot.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedHotspot(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-medium">Fraud Events</span>
                      <div className="text-2xl font-bold text-red-500">{selectedHotspot.fraudCount.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-medium">Avg Amount</span>
                      <div className="text-2xl font-bold">₹{selectedHotspot.avgAmount.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-medium">Detection Rate</span>
                      <div className="text-2xl font-bold text-green-500">{selectedHotspot.detectionRate}%</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-medium">Trend</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className={`h-5 w-5 ${
                          selectedHotspot.trend === 'up' ? 'text-red-500 rotate-45' : 
                          selectedHotspot.trend === 'down' ? 'text-green-500 rotate-180' : 'text-yellow-500'
                        }`} />
                        <span className="capitalize font-bold">{selectedHotspot.trend}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-muted-foreground font-medium">Common Fraud Types:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedHotspot.fraudTypes.map((type) => (
                        <Badge key={type} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Risk Distribution</h3>
                <div className="space-y-3">
                  {['critical', 'high', 'medium', 'low'].map((level) => {
                    const count = hotspots.filter(h => h.riskLevel === level).length;
                    const percentage = (count / hotspots.length) * 100;
                    return (
                      <div key={level} className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${getRiskColor(level)}`}></div>
                        <span className="capitalize font-medium w-20">{level}</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getRiskColor(level)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Top Threat Regions</h3>
                <div className="space-y-3">
                  {hotspots
                    .sort((a, b) => b.fraudCount - a.fraudCount)
                    .slice(0, 5)
                    .map((hotspot, index) => (
                      <div key={hotspot.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="font-bold text-lg text-muted-foreground">#{index + 1}</div>
                        <div className={`w-3 h-3 rounded-full ${getRiskColor(hotspot.riskLevel)}`}></div>
                        <div className="flex-1">
                          <div className="font-medium">{hotspot.city}</div>
                          <div className="text-sm text-muted-foreground">{hotspot.fraudCount} threats</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">₹{hotspot.avgAmount.toLocaleString()}</div>
                          <div className="text-sm text-green-500">{hotspot.detectionRate}% detected</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredHotspots.map((hotspot) => (
                  <div key={hotspot.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getRiskColor(hotspot.riskLevel)}`}></div>
                        <span className="font-medium">{hotspot.city}</span>
                      </div>
                      <Badge className={`${getRiskColor(hotspot.riskLevel)} text-white border-0 text-xs`}>
                        {hotspot.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Threats:</span>
                        <span className="font-medium">{hotspot.fraudCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Amount:</span>
                        <span className="font-medium">₹{hotspot.avgAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Detection:</span>
                        <span className="font-medium text-green-500">{hotspot.detectionRate}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {hotspot.fraudTypes.slice(0, 2).map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                        ))}
                        {hotspot.fraudTypes.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{hotspot.fraudTypes.length - 2}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Legend */}
        <div className="mt-6 flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <span>Critical Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Low Risk</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Real-time Intelligence Feed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}