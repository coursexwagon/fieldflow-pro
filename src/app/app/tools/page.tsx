'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Calculator, 
  Gauge, 
  BookOpen,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

// Refrigerant PT Chart Data (simplified)
const refrigerantData = {
  'R-410A': [
    { temp: 30, psi: 101 },
    { temp: 35, psi: 110 },
    { temp: 40, psi: 120 },
    { temp: 45, psi: 130 },
    { temp: 50, psi: 141 },
    { temp: 55, psi: 153 },
    { temp: 60, psi: 165 },
    { temp: 65, psi: 178 },
    { temp: 70, psi: 192 },
    { temp: 75, psi: 207 },
    { temp: 80, psi: 222 },
    { temp: 85, psi: 238 },
    { temp: 90, psi: 255 },
    { temp: 95, psi: 273 },
    { temp: 100, psi: 292 },
  ],
  'R-22': [
    { temp: 30, psi: 50 },
    { temp: 35, psi: 55 },
    { temp: 40, psi: 61 },
    { temp: 45, psi: 67 },
    { temp: 50, psi: 74 },
    { temp: 55, psi: 81 },
    { temp: 60, psi: 89 },
    { temp: 65, psi: 97 },
    { temp: 70, psi: 106 },
    { temp: 75, psi: 116 },
    { temp: 80, psi: 126 },
    { temp: 85, psi: 137 },
    { temp: 90, psi: 149 },
    { temp: 95, psi: 161 },
    { temp: 100, psi: 175 },
  ],
  'R-32': [
    { temp: 30, psi: 145 },
    { temp: 35, psi: 159 },
    { temp: 40, psi: 173 },
    { temp: 45, psi: 188 },
    { temp: 50, psi: 205 },
    { temp: 55, psi: 222 },
    { temp: 60, psi: 241 },
    { temp: 65, psi: 260 },
    { temp: 70, psi: 281 },
    { temp: 75, psi: 304 },
    { temp: 80, psi: 327 },
    { temp: 85, psi: 352 },
    { temp: 90, psi: 379 },
    { temp: 95, psi: 406 },
    { temp: 100, psi: 436 },
  ],
};

type ToolView = 'menu' | 'pt-chart' | 'calculator' | 'converter' | 'codes';

export default function ToolsPage() {
  const [view, setView] = useState<ToolView>('menu');
  const [selectedRefrigerant, setSelectedRefrigerant] = useState<keyof typeof refrigerantData>('R-410A');
  
  // Calculator state
  const [btu, setBtu] = useState('24000');
  const [tons, setTons] = useState('2');

  // Convert BTU to Tons
  const convertBtuToTons = (btuValue: string) => {
    const btuNum = parseFloat(btuValue) || 0;
    setBtu(btuValue);
    setTons((btuNum / 12000).toFixed(2));
  };

  const convertTonsToBtu = (tonsValue: string) => {
    const tonsNum = parseFloat(tonsValue) || 0;
    setTons(tonsValue);
    setBtu((tonsNum * 12000).toFixed(0));
  };

  // Menu view
  if (view === 'menu') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold mb-1">Tools</h1>
          <p className="text-[#71717a] text-sm mb-6">HVAC calculators and reference charts</p>

          <div className="space-y-2">
            <button
              onClick={() => setView('pt-chart')}
              className="w-full flex items-center gap-4 p-4 bg-[#141414] border border-[#27272a] hover:border-[#3f3f46] transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center">
                <Thermometer className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">PT Chart</p>
                <p className="text-sm text-[#71717a]">Pressure-Temperature for refrigerants</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#3f3f46]" />
            </button>

            <button
              onClick={() => setView('calculator')}
              className="w-full flex items-center gap-4 p-4 bg-[#141414] border border-[#27272a] hover:border-[#3f3f46] transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center">
                <Calculator className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">BTU Calculator</p>
                <p className="text-sm text-[#71717a]">Convert BTU to Tons and back</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#3f3f46]" />
            </button>

            <button
              onClick={() => setView('converter')}
              className="w-full flex items-center gap-4 p-4 bg-[#141414] border border-[#27272a] hover:border-[#3f3f46] transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center">
                <Gauge className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Unit Converter</p>
                <p className="text-sm text-[#71717a]">CFM, velocity, and more</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#3f3f46]" />
            </button>

            <button
              onClick={() => setView('codes')}
              className="w-full flex items-center gap-4 p-4 bg-[#141414] border border-[#27272a] hover:border-[#3f3f46] transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#1f1f1f] border border-[#27272a] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Code Reference</p>
                <p className="text-sm text-[#71717a]">NEC and mechanical codes</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#3f3f46]" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // PT Chart view
  if (view === 'pt-chart') {
    const data = refrigerantData[selectedRefrigerant];
    
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <button
          onClick={() => setView('menu')}
          className="flex items-center gap-2 text-[#a1a1aa] mb-4 cursor-pointer hover:text-[#fafafa] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold mb-1">PT Chart</h1>
          <p className="text-[#71717a] text-sm mb-4">Pressure-Temperature reference</p>

          {/* Refrigerant Selector */}
          <div className="flex gap-2 mb-6">
            {(Object.keys(refrigerantData) as Array<keyof typeof refrigerantData>).map((ref) => (
              <button
                key={ref}
                onClick={() => setSelectedRefrigerant(ref)}
                className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  selectedRefrigerant === ref
                    ? 'bg-[#f59e0b] text-[#0a0a0a]'
                    : 'bg-[#141414] border border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                }`}
              >
                {ref}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-[#141414] border border-[#27272a]">
            <div className="grid grid-cols-2 text-center border-b border-[#27272a]">
              <div className="p-3 text-xs text-[#71717a] uppercase tracking-wide border-r border-[#27272a]">
                Temp (°F)
              </div>
              <div className="p-3 text-xs text-[#71717a] uppercase tracking-wide">
                PSI
              </div>
            </div>
            
            {data.map((row, i) => (
              <div 
                key={row.temp} 
                className={`grid grid-cols-2 text-center ${
                  i < data.length - 1 ? 'border-b border-[#27272a]' : ''
                }`}
              >
                <div className="p-3 font-mono text-sm border-r border-[#27272a]">
                  {row.temp}°F
                </div>
                <div className="p-3 font-mono text-sm text-[#f59e0b]">
                  {row.psi} PSI
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#52525b] mt-4">
            Values are approximate. Always verify with manufacturer specs.
          </p>
        </motion.div>
      </div>
    );
  }

  // Calculator view
  if (view === 'calculator') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <button
          onClick={() => setView('menu')}
          className="flex items-center gap-2 text-[#a1a1aa] mb-4 cursor-pointer hover:text-[#fafafa] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold mb-1">BTU Calculator</h1>
          <p className="text-[#71717a] text-sm mb-6">Convert between BTU and Tons</p>

          <div className="space-y-6">
            {/* BTU Input */}
            <div className="bg-[#141414] border border-[#27272a] p-4">
              <label className="block text-xs text-[#71717a] uppercase tracking-wide mb-2">
                BTU/hr
              </label>
              <input
                type="number"
                value={btu}
                onChange={(e) => convertBtuToTons(e.target.value)}
                className="w-full bg-transparent text-3xl font-mono font-bold text-[#f59e0b] outline-none"
                placeholder="24000"
              />
            </div>

            <div className="text-center text-[#3f3f46]">=</div>

            {/* Tons Output */}
            <div className="bg-[#141414] border border-[#27272a] p-4">
              <label className="block text-xs text-[#71717a] uppercase tracking-wide mb-2">
                Tons
              </label>
              <input
                type="number"
                value={tons}
                onChange={(e) => convertTonsToBtu(e.target.value)}
                className="w-full bg-transparent text-3xl font-mono font-bold text-[#fafafa] outline-none"
                placeholder="2"
                step="0.5"
              />
            </div>
          </div>

          <div className="mt-8 p-4 bg-[#1f1f1f] border border-[#27272a]">
            <p className="text-xs text-[#71717a] mb-2">Quick Reference</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-[#a1a1aa]">1 Ton = 12,000 BTU</div>
              <div className="text-[#a1a1aa]">1.5 Ton = 18,000 BTU</div>
              <div className="text-[#a1a1aa]">2 Ton = 24,000 BTU</div>
              <div className="text-[#a1a1aa]">2.5 Ton = 30,000 BTU</div>
              <div className="text-[#a1a1aa]">3 Ton = 36,000 BTU</div>
              <div className="text-[#a1a1aa]">5 Ton = 60,000 BTU</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Converter view
  if (view === 'converter') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <button
          onClick={() => setView('menu')}
          className="flex items-center gap-2 text-[#a1a1aa] mb-4 cursor-pointer hover:text-[#fafafa] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold mb-1">Unit Converter</h1>
          <p className="text-[#71717a] text-sm mb-6">Common HVAC conversions</p>

          <div className="space-y-4">
            <div className="bg-[#141414] border border-[#27272a] p-4">
              <p className="text-xs text-[#71717a] uppercase tracking-wide mb-3">Area</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#52525b] text-xs">1 sq ft</p>
                  <p className="text-[#a1a1aa]">= 0.093 m²</p>
                </div>
                <div>
                  <p className="text-[#52525b] text-xs">1 m²</p>
                  <p className="text-[#a1a1aa]">= 10.764 sq ft</p>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#27272a] p-4">
              <p className="text-xs text-[#71717a] uppercase tracking-wide mb-3">Airflow</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#52525b] text-xs">1 CFM</p>
                  <p className="text-[#a1a1aa]">= 0.472 L/s</p>
                </div>
                <div>
                  <p className="text-[#52525b] text-xs">400 CFM</p>
                  <p className="text-[#a1a1aa]">= 1 Ton airflow</p>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#27272a] p-4">
              <p className="text-xs text-[#71717a] uppercase tracking-wide mb-3">Temperature</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#52525b] text-xs">°F to °C</p>
                  <p className="text-[#a1a1aa]">(°F - 32) × 5/9</p>
                </div>
                <div>
                  <p className="text-[#52525b] text-xs">°C to °F</p>
                  <p className="text-[#a1a1aa]">(°C × 9/5) + 32</p>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#27272a] p-4">
              <p className="text-xs text-[#71717a] uppercase tracking-wide mb-3">Pressure</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#52525b] text-xs">1 PSI</p>
                  <p className="text-[#a1a1aa]">= 2.31 ft H₂O</p>
                </div>
                <div>
                  <p className="text-[#52525b] text-xs">1 in. w.g.</p>
                  <p className="text-[#a1a1aa]">= 0.036 PSI</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Codes view
  if (view === 'codes') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <button
          onClick={() => setView('menu')}
          className="flex items-center gap-2 text-[#a1a1aa] mb-4 cursor-pointer hover:text-[#fafafa] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold mb-1">Code Reference</h1>
          <p className="text-[#71717a] text-sm mb-6">Quick reference for common codes</p>

          <div className="space-y-4">
            <div className="bg-[#141414] border border-[#27272a] p-4">
              <p className="text-xs text-[#f59e0b] uppercase tracking-wide mb-2">NEC 440 - AC Equipment</p>
              <ul className="space-y-2 text-sm text-[#a1a1aa]">
                <li>• Min circuit ampacity (MCA) on nameplate</li>
                <li>• Max fuse/breaker (MOP) on nameplate</li>
                <li>• Disconnect within sight of equipment</li>
                <li>• Branch circuit: 125% of RLA</li>
              </ul>
            </div>

            <div className="bg-[#141414] border border-[#27272a] p-4">
              <p className="text-xs text-[#f59e0b] uppercase tracking-wide mb-2">IMC - Mechanical</p>
              <ul className="space-y-2 text-sm text-[#a1a1aa]">
                <li>• Condenser: 12&quot; clearance min</li>
                <li>• Service access: 30&quot; x 30&quot; min</li>
                <li>• Outdoor: 3 ft from property line</li>
                <li>• Duct joints: mechanical fasteners</li>
              </ul>
            </div>

            <div className="bg-[#141414] border border-[#27272a] p-4">
              <p className="text-xs text-[#f59e0b] uppercase tracking-wide mb-2">EPA 608</p>
              <ul className="space-y-2 text-sm text-[#a1a1aa]">
                <li>• Must be certified to handle refrigerant</li>
                <li>• Cannot vent refrigerant to atmosphere</li>
                <li>• Must use recovery equipment</li>
                <li>• Log all refrigerant additions</li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-[#52525b] mt-6">
            Always refer to current local codes. This is a quick reference only.
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
}
