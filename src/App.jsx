import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Home, 
  Layers, 
  Map, 
  Calculator, 
  Compass, 
  Ruler, 
  Info, 
  Users,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Percent,
  Grid
} from 'lucide-react';

// Master Plan Core Data
const developerData = {
  villas: {
    title: "Standalone Villas",
    unitCount: 1050,
    unitPct: 15,
    buildingCount: 1050,
    netLandFeddans: 60.00,
    landPct: 36.4,
    avgPlotArea: 240, 
    maxFootprintPct: 40, 
    groundFootprint: 96.00, 
    heightLimit: "G+2 [11, 16]m",
    avgBUA: 288, 
    rooftopLimit: 24.00, 
    setbacks: { front: 4, rear: 6, side: 3, separation: null },
    color: "#6366f1", // indigo-500
    hoverColor: "#4f46e5",
    lightColor: "#e0e7ff",
    icon: Home
  },
  townhouses: {
    title: "Townhouses",
    unitCount: 1750,
    unitPct: 25,
    buildingCount: 1750,
    netLandFeddans: 55.00,
    landPct: 33.3,
    avgPlotArea: 132, 
    maxFootprintPct: 45, 
    groundFootprint: 59.40, 
    heightLimit: "G+2 [11, 16]m",
    avgBUA: 178.2, 
    rooftopLimit: 14.85, 
    setbacks: { front: 4, rear: 6, side: 0, separation: "N/A" },
    color: "#0d9488", // teal-600
    hoverColor: "#0f766e",
    lightColor: "#ccfbf1",
    icon: Layers
  },
  apartments: {
    title: "Apartment Buildings",
    unitCount: 4200,
    unitPct: 60,
    buildingCount: 175,
    netLandFeddans: 50.00,
    landPct: 30.3,
    avgPlotArea: 1200, 
    maxFootprintPct: 40, 
    groundFootprint: 480.00, 
    heightLimit: "G+5 floors",
    avgBUA: 120, 
    rooftopLimit: 120.00, 
    setbacks: { front: 4, rear: 6, side: null, separation: 8 },
    color: "#f97316", // orange-500
    hoverColor: "#ea580c",
    lightColor: "#ffedd5",
    icon: Building
  }
};

// Custom interactive SVG Donut Component
function ProportionalDonut({ data, mode }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const chartData = useMemo(() => {
    const valueKey = mode === 'land' ? 'netLandFeddans' : 'unitCount';
    const total = data.reduce((sum, item) => sum + item[valueKey], 0);
    let cumulativePercent = 0;

    return data.map((item, index) => {
      const val = item[valueKey];
      const percentage = (val / total) * 100;
      const startPercent = cumulativePercent;
      cumulativePercent += percentage;

      const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * (percent - 0.25));
        const y = Math.sin(2 * Math.PI * (percent - 0.25));
        return [x, y];
      };

      const [startX, startY] = getCoordinatesForPercent(startPercent / 100);
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent / 100);
      const largeArcFlag = percentage > 50 ? 1 : 0;

      // Draw outer sector arc
      const pathData = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `L 0 0`,
        `Z`
      ].join(' ');

      return {
        ...item,
        percentage,
        pathData,
        value: val,
        index
      };
    });
  }, [data, mode]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-56">
        <svg viewBox="-1.15 -1.15 2.3 2.3" className="transform -rotate-90 w-full h-full">
          {chartData.map((slice) => {
            const isHovered = hoveredIdx === slice.index;
            return (
              <path
                key={slice.key}
                d={slice.pathData}
                fill={slice.color}
                opacity={hoveredIdx !== null && !isHovered ? 0.5 : 1}
                className="transition-all duration-300 cursor-pointer origin-center"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredIdx(slice.index)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
          {/* Donut mask */}
          <circle cx="0" cy="0" r="0.65" fill="#ffffff" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {hoveredIdx !== null ? (
            <>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {chartData[hoveredIdx].title.split(' ')[0]}
              </span>
              <span className="text-2xl font-black text-slate-900 leading-tight">
                {chartData[hoveredIdx].percentage.toFixed(1)}%
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {mode === 'land' 
                  ? `${chartData[hoveredIdx].value} Fed` 
                  : `${chartData[hoveredIdx].value.toLocaleString()} Units`}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-slate-900 leading-tight">
                {mode === 'land' ? '165.0' : '7,000'}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {mode === 'land' ? 'Feddans' : 'Units'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend Block */}
      <div className="mt-5 w-full space-y-2">
        {chartData.map((slice) => (
          <div 
            key={slice.key}
            onMouseEnter={() => setHoveredIdx(slice.index)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`flex justify-between items-center px-3 py-1.5 rounded-lg transition-all border ${
              hoveredIdx === slice.index 
                ? 'bg-slate-50 border-slate-200 shadow-sm' 
                : 'border-transparent hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-xs font-bold text-slate-700">{slice.title}</span>
            </div>
            <span className="text-xs font-black text-slate-800">
              {mode === 'land' ? `${slice.value} Fed` : `${slice.value.toLocaleString()} Units`} ({slice.percentage.toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 165 Grid block component representating actual 165 Feddans
function FeddanGrid() {
  const gridCells = useMemo(() => {
    let cells = [];
    // 60 Villas (indigo), 55 Townhouses (teal), 50 Apartments (orange)
    for (let i = 0; i < 60; i++) cells.push({ type: 'villas', color: '#6366f1' });
    for (let i = 0; i < 55; i++) cells.push({ type: 'townhouses', color: '#0d9488' });
    for (let i = 0; i < 50; i++) cells.push({ type: 'apartments', color: '#f97316' });
    return cells;
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Grid className="h-4 w-4 text-indigo-500" />
            165 Feddans Visual Land Allocation
          </h3>
          <p className="text-xs text-slate-500">Each block represents 1 Net Feddan (4,200 m²)</p>
        </div>
        <div className="flex items-center space-x-4 text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#6366f1]" />
            <span>Villas (60)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#0d9488]" />
            <span>Towns (55)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#f97316]" />
            <span>Apartments (50)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-11 sm:grid-cols-[repeat(15,minmax(0,1fr))] md:grid-cols-[repeat(22,minmax(0,1fr))] gap-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
        {gridCells.map((cell, idx) => (
          <div 
            key={idx} 
            style={{ backgroundColor: cell.color }} 
            className="aspect-square rounded-[3px] opacity-85 hover:opacity-100 transition-opacity cursor-pointer relative group"
            title={`Feddan #${idx + 1} (${cell.type})`}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-1 whitespace-nowrap z-30">
              1 Feddan {cell.type.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Custom interactive SVG Bar Chart Component
function CustomBarChart({ data, activeMetric, label }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const maxVal = useMemo(() => {
    return Math.max(...data.map(item => item[activeMetric])) * 1.15;
  }, [data, activeMetric]);

  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>

      <div className="relative h-60 flex items-end justify-between pt-6 px-4">
        <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col justify-between pointer-events-none">
          {[1, 0.75, 0.5, 0.25].map((ratio) => (
            <div key={ratio} className="w-full border-t border-dashed border-slate-200 relative">
              <span className="absolute left-0 -top-2 text-[9px] font-semibold text-slate-400 bg-slate-50 px-1">
                {(maxVal * ratio).toFixed(0)}
              </span>
            </div>
          ))}
        </div>

        {data.map((item, idx) => {
          const pctHeight = (item[activeMetric] / maxVal) * 100;
          const isHovered = hoveredBar === idx;

          return (
            <div 
              key={item.key} 
              className="flex flex-col items-center w-1/4 group z-10 animate-fade-in"
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <span className={`text-xs font-black transition-all duration-300 mb-1.5 ${
                isHovered ? 'text-slate-950 scale-110 -translate-y-0.5' : 'text-slate-600'
              }`}>
                {item[activeMetric].toLocaleString()}
              </span>

              <div className="w-12 sm:w-16 bg-slate-200/80 rounded-t-lg overflow-hidden transition-all duration-300">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500 relative"
                  style={{ 
                    height: `${pctHeight}%`, 
                    backgroundColor: isHovered ? item.hoverColor : item.color,
                    minHeight: '4px'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              </div>

              <span className="text-[11px] font-bold text-slate-700 mt-2 text-center whitespace-nowrap">
                {item.title.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [selectedType, setSelectedType] = useState('villas');
  const [barMetric, setBarMetric] = useState('avgPlotArea'); 
  
  // Calculator inputs
  const [calcVillasLand, setCalcVillasLand] = useState(60.00);
  const [calcTownhouseLand, setCalcTownhouseLand] = useState(55.00);
  const [calcApartmentLand, setCalcApartmentLand] = useState(50.00);

  // Transform developerData into array format for mapping charts
  const chartCompatibleData = useMemo(() => {
    return [
      { key: 'villas', ...developerData.villas },
      { key: 'townhouses', ...developerData.townhouses },
      { key: 'apartments', ...developerData.apartments }
    ];
  }, []);

  const totalUnits = useMemo(() => {
    return developerData.villas.unitCount + developerData.townhouses.unitCount + developerData.apartments.unitCount;
  }, []);

  const totalLand = useMemo(() => {
    return developerData.villas.netLandFeddans + developerData.townhouses.netLandFeddans + developerData.apartments.netLandFeddans;
  }, []);

  // Handlers for calculator
  const calcResults = useMemo(() => {
    const villasUnits = Math.round(calcVillasLand * 17.5);
    const villasFootprintArea = (villasUnits * developerData.villas.groundFootprint);
    
    const townhouseUnits = Math.round(calcTownhouseLand * (1750 / 55));
    const townhouseFootprintArea = (townhouseUnits * developerData.townhouses.groundFootprint);

    const apartmentBuildings = Math.round(calcApartmentLand * (175 / 50));
    const apartmentUnits = apartmentBuildings * 24;
    const apartmentFootprintArea = (apartmentBuildings * developerData.apartments.groundFootprint);

    const totalCalcUnits = villasUnits + townhouseUnits + apartmentUnits;
    const totalCalcLand = Number(calcVillasLand) + Number(calcTownhouseLand) + Number(calcApartmentLand);
    
    return {
      villas: { units: villasUnits, footprint: villasFootprintArea },
      townhouses: { units: townhouseUnits, footprint: townhouseFootprintArea },
      apartments: { buildings: apartmentBuildings, units: apartmentUnits, footprint: apartmentFootprintArea },
      totalUnits: totalCalcUnits,
      totalLand: totalCalcLand
    };
  }, [calcVillasLand, calcTownhouseLand, calcApartmentLand]);

  const barLabel = useMemo(() => {
    if (barMetric === 'avgPlotArea') return 'Average Plot Area (m²)';
    if (barMetric === 'avgBUA') return 'Average Unit Size (BUA in m²)';
    return 'Ground Footprint Area (m²)';
  }, [barMetric]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Upper Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Developer Master Plan Analytics</h1>
                <p className="text-xs text-slate-500">Net Residential Master Plan Visualizer</p>
              </div>
            </div>
            
            <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Product Mix & Land</span>
              </button>
              <button
                onClick={() => setActiveTab('setbacks')}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'setbacks' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Ruler className="h-4 w-4" />
                <span>Setbacks & Heights</span>
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'calculator' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>Simulation Sandbox</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: VISUAL CHARTS OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Header / Subheader Explainer */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10 scale-150">
                <Compass className="w-96 h-96" />
              </div>
              <div className="relative z-10 max-w-3xl">
                <span className="bg-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Product Mix Visualization
                </span>
                <h2 className="text-3xl font-black mt-3 leading-tight">Proportional Allocation & Land Efficiency</h2>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Comparing the balanced target of <span className="font-semibold text-white">7,000 residential units</span> to the physical <span className="font-semibold text-white">165.00 Net Feddans</span> of development land. 
                  Observe how multi-family density frees up horizontal space.
                </p>
              </div>
            </div>

            {/* Main Side-by-Side Pie/Donut Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Card A: 165 Feddan Land Partition */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Map className="h-5 w-5 text-indigo-500" />
                      Land Partitioning (165 Feddans)
                    </h2>
                    <p className="text-xs text-slate-500">Physical horizontal land footprint allocation</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">3 Typologies</span>
                </div>
                <ProportionalDonut data={chartCompatibleData} mode="land" />
              </div>

              {/* Card B: Product Mix (7,000 Units) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald-500" />
                      Product Mix Split (7,000 Units)
                    </h2>
                    <p className="text-xs text-slate-500">Zoning yield and household density split</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Requested Target</span>
                </div>
                <ProportionalDonut data={chartCompatibleData} mode="units" />
              </div>

            </div>

            {/* Map Block Grid Visual representation */}
            <FeddanGrid />

            {/* Bar Charts for Sizing Comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-500" />
                      Physical Dimension Scaling Metrics
                    </h3>
                    <p className="text-xs text-slate-500">Highlighting land footprint, plot sizes, and final built-up area sizes</p>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setBarMetric('avgPlotArea')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        barMetric === 'avgPlotArea' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Plot Area
                    </button>
                    <button 
                      onClick={() => setBarMetric('avgBUA')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        barMetric === 'avgBUA' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      BUA Size
                    </button>
                    <button 
                      onClick={() => setBarMetric('groundFootprint')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        barMetric === 'groundFootprint' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Footprint
                    </button>
                  </div>
                </div>

                <CustomBarChart 
                  data={chartCompatibleData} 
                  activeMetric={barMetric} 
                  label={barLabel} 
                />
              </div>

              {/* Informational Insights */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Master Plan Insights</h3>
                  <div className="space-y-4 text-xs text-slate-600 leading-relaxed mt-4">
                    <div className="border-l-4 border-orange-500 pl-3">
                      <span className="font-bold text-slate-900 block">The Apartment Efficiency</span>
                      Apartments consume only <strong>30.3%</strong> of the master plan's physical space (50.00 Feddans) while generating <strong>60%</strong> of the overall unit capacity (4,200 units).
                    </div>
                    <div className="border-l-4 border-indigo-500 pl-3">
                      <span className="font-bold text-slate-900 block">Villa Footprint Density</span>
                      Villas demand <strong>36.4%</strong> of physical land (60.00 Feddans) but generate only <strong>15%</strong> of compound housing yield (1,050 units).
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-indigo-50 border border-indigo-200/40 p-4 rounded-xl text-[11px] text-indigo-950 flex items-start gap-2">
                  <Info className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Toggle metrics on the bar chart to compare the plot areas, footprint layouts, and built-up areas (BUA).
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE SETBACKS & HEIGHTS */}
        {activeTab === 'setbacks' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="md:flex md:justify-between md:items-center border-b border-slate-100 pb-6 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Setbacks & Height Visualizer</h2>
                  <p className="text-sm text-slate-500">Analyze the layout boundaries and physical elevations prescribed for each zoning category.</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  {Object.keys(developerData).map((key) => {
                    const type = developerData[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedType(key)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                          selectedType === key 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {type.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Schematic 2D Graphic */}
                <div className="lg:col-span-2 bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px] border border-slate-200 relative overflow-hidden">
                  
                  {/* Outer Plot Boundary */}
                  <div className="w-full max-w-[500px] aspect-[16/10] bg-white border-2 border-dashed border-slate-400 rounded-lg p-8 relative flex flex-col justify-between">
                    <span className="absolute top-2 left-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Plot Boundaries</span>
                    
                    {/* Road Indication */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Access Road</span>
                      <div className="h-4 w-0.5 bg-indigo-300 border-dashed border-l mt-1"></div>
                    </div>

                    {/* Left/Right Separation Guidelines */}
                    <div className="flex-1 flex justify-between items-center relative py-6">
                      
                      {/* Left Boundary Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-slate-200 rounded"></div>
                      
                      {/* Left/Front Setback Measurement arrow */}
                      <div className="absolute left-0 top-[20%] right-auto flex items-center space-x-1" style={{ width: `${developerData[selectedType].setbacks.front * 8}%` }}>
                        <div className="h-0.5 bg-rose-500 w-full relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        </div>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1 rounded absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          {developerData[selectedType].setbacks.front}m Front
                        </span>
                      </div>

                      {/* Actual Building Footprint */}
                      <div 
                        className="mx-auto h-full flex flex-col justify-between items-center rounded-lg border-2 shadow-sm transition-all p-4 text-center relative"
                        style={{
                          backgroundColor: developerData[selectedType].lightColor,
                          borderColor: developerData[selectedType].color,
                          width: `${(100 - (developerData[selectedType].setbacks.front + developerData[selectedType].setbacks.rear) * 5.5)}%`
                        }}
                      >
                        <span className="text-xs font-bold" style={{ color: developerData[selectedType].color }}>{developerData[selectedType].title}</span>
                        <div className="text-[10px] font-medium text-slate-600 mt-1">
                          Footprint Area: {developerData[selectedType].groundFootprint} m²
                        </div>
                        
                        {/* Height Limit tag */}
                        <div className="mt-2 text-[10px] font-bold text-slate-900 bg-white border px-1.5 py-0.5 rounded">
                          Height: {developerData[selectedType].heightLimit}
                        </div>
                      </div>

                      {/* Right/Rear Setback Measurement arrow */}
                      <div className="absolute right-0 bottom-[20%] left-auto flex items-center space-x-1" style={{ width: `${developerData[selectedType].setbacks.rear * 8}%` }}>
                        <div className="h-0.5 bg-rose-500 w-full relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        </div>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1 rounded absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          {developerData[selectedType].setbacks.rear}m Rear
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Setbacks details panel */}
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-base font-bold text-slate-900 mb-4">Boundary Regulations</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-200">
                        <span className="text-sm font-semibold text-slate-600">Front Setback (F)</span>
                        <span className="text-sm font-black text-slate-900">{developerData[selectedType].setbacks.front} Meters</span>
                      </div>

                      <div className="flex justify-between items-center py-2.5 border-b border-slate-200">
                        <span className="text-sm font-semibold text-slate-600">Rear Setback (R)</span>
                        <span className="text-sm font-black text-slate-900">{developerData[selectedType].setbacks.rear} Meters</span>
                      </div>

                      <div className="flex justify-between items-center py-2.5 border-b border-slate-200">
                        <span className="text-sm font-semibold text-slate-600">Side Setbacks (S)</span>
                        <span className="text-sm font-black text-slate-900">
                          {developerData[selectedType].setbacks.side !== null 
                            ? `${developerData[selectedType].setbacks.side} Meters` 
                            : 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-sm font-semibold text-slate-600">Separation Distance</span>
                        <span className="text-sm font-black text-slate-900">
                          {developerData[selectedType].setbacks.separation !== null 
                            ? `${developerData[selectedType].setbacks.separation} Meters` 
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-start space-x-3 shadow-sm">
                    <Info className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Compliance Warning</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Footprint maximum ratios are strictly enforced. Exceeding the max Ground Footprint ({developerData[selectedType].maxFootprintPct}%) will void municipal layout validation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DENSITY SIMULATION */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Live Density & Yield Simulator</h2>
                <p className="text-xs text-slate-500">Modify land sizes to estimate future resident unit capacities based on optimal zoning constraints.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sliders Area */}
                <div className="space-y-6 lg:col-span-1">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
                    <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Adjust Land Area (Feddans)</h3>
                    
                    {/* Villa land slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-indigo-700">Villas Land</span>
                        <span className="font-bold text-slate-800">{calcVillasLand} Feddans</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        step="0.5"
                        value={calcVillasLand} 
                        onChange={(e) => setCalcVillasLand(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    {/* Townhouse land slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-teal-700">Townhouses Land</span>
                        <span className="font-bold text-slate-800">{calcTownhouseLand} Feddans</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        step="0.5"
                        value={calcTownhouseLand} 
                        onChange={(e) => setCalcTownhouseLand(Number(e.target.value))}
                        className="w-full accent-teal-600"
                      />
                    </div>

                    {/* Apartment land slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-orange-700">Apartments Land</span>
                        <span className="font-bold text-slate-800">{calcApartmentLand} Feddans</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        step="0.5"
                        value={calcApartmentLand} 
                        onChange={(e) => setCalcApartmentLand(Number(e.target.value))}
                        className="w-full accent-orange-600"
                      />
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-2">
                    <span className="font-bold">Density Conversion Standard:</span>
                    <p className="leading-relaxed">
                      Units outputs scale with actual mathematical density targets determined in zoning laws. Ground Footprints are derived directly from spatial limits.
                    </p>
                  </div>
                </div>

                {/* Simulation Output Screen */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Realtime KPI totals */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Simulated Unit Yield</span>
                      <span className="text-3xl font-black text-indigo-600 mt-2">{calcResults.totalUnits.toLocaleString()} Units</span>
                      <span className="text-xs text-slate-400 mt-1">Across total land master plan</span>
                    </div>

                    <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Simulated Land footprint</span>
                      <span className="text-3xl font-black text-teal-600 mt-2">{calcResults.totalLand.toFixed(2)} Feddans</span>
                      <span className="text-xs text-slate-400 mt-1">Sum of individual allocation</span>
                    </div>
                  </div>

                  {/* Detailed breakdown list */}
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Property Typology</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Simulated Area</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Target Yield</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ground Footprint</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-600">Standalone Villas</td>
                          <td className="px-6 py-4 whitespace-nowrap">{calcVillasLand} Feddans</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">{calcResults.villas.units} Units</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-600">{calcResults.villas.footprint.toLocaleString()} m²</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-teal-600">Townhouses</td>
                          <td className="px-6 py-4 whitespace-nowrap">{calcTownhouseLand} Feddans</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">{calcResults.townhouses.units} Units</td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-600">{calcResults.townhouses.footprint.toLocaleString()} m²</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-orange-600">Apartments</td>
                          <td className="px-6 py-4 whitespace-nowrap">{calcApartmentLand} Feddans</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                            {calcResults.apartments.buildings} Bldgs ({calcResults.apartments.units} Units)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-600">{calcResults.apartments.footprint.toLocaleString()} m²</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
