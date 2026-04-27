import React, { useState, useMemo } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { Calculator as CalcIcon, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PaintCalculator.module.css';

const PAINT_COVERAGE = {
  Primer: { sqft: 100, sqm: 9.3 }, // per liter
  Emulsion: { sqft: 140, sqm: 13 },
  Texture: { sqft: 50, sqm: 4.6 }
};

const SURFACE_MULTIPLIERS = {
  Smooth: 1.0,
  Rough: 1.2,
  New: 1.3
};

const PaintCalculator = () => {
  const navigate = useNavigate();
  // Settings
  const [unit, setUnit] = useState('sqft'); // 'sqft' or 'sqm'
  const [paintType, setPaintType] = useState('Emulsion');
  const [surfaceType, setSurfaceType] = useState('Smooth');
  const [wastagePercent, setWastagePercent] = useState(0);
  
  // Dimensions
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [includeCeiling, setIncludeCeiling] = useState(false);
  const [coats, setCoats] = useState(0);
  
  // Openings tracking
  const [openings, setOpenings] = useState([]);

  const addOpening = (type) => {
    const defaultW = type === 'Window' ? 3 : 3;
    const defaultH = type === 'Window' ? 4 : 7;
    setOpenings([...openings, { id: Date.now(), type, width: defaultW, height: defaultH }]);
  };

  const updateOpening = (id, field, value) => {
    setOpenings(openings.map(op => op.id === id ? { ...op, [field]: Number(value) } : op));
  };

  const removeOpening = (id) => {
    setOpenings(openings.filter(op => op.id !== id));
  };

  // Mathematical computations
  const calculations = useMemo(() => {
    // 1. Total Wall Area
    const wallArea = 2 * ((length * height) + (width * height));
    
    // 2. Add ceiling if selected
    const ceilingArea = includeCeiling ? (length * width) : 0;
    const grossArea = wallArea + ceilingArea;
    
    // 3. Deductions (Openings)
    const deductionArea = openings.reduce((acc, op) => acc + (op.width * op.height), 0);
    
    // 4. Net Paintable Area
    const netArea = Math.max(0, grossArea - deductionArea);
    
    // 5. Apply surface condition multiplier and coats
    const surfaceMultiplier = SURFACE_MULTIPLIERS[surfaceType];
    const totalAreaToCover = (netArea * surfaceMultiplier) * coats;
    
    // 6. Conversions and Limits
    const coveragePerLiter = PAINT_COVERAGE[paintType][unit];
    const litersNeeded = totalAreaToCover / coveragePerLiter;
    
    // 7. Wastage
    const finalLiters = litersNeeded * (1 + (wastagePercent / 100));
    
    return {
      wallArea,
      ceilingArea,
      grossArea,
      deductionArea,
      netArea,
      totalAreaToCover,
      finalLiters: Math.ceil(finalLiters * 10) / 10 // round 1 decimal
    };
  }, [length, width, height, includeCeiling, coats, openings, paintType, surfaceType, wastagePercent, unit]);

  // Determine Packaging
  const packaging = useMemo(() => {
    let remaining = calculations.finalLiters;
    const packs = { '10L': 0, '4L': 0, '1L': 0 };
    
    while (remaining >= 9) { packs['10L']++; remaining -= 10; }
    while (remaining >= 3.5) { packs['4L']++; remaining -= 4; }
    if (remaining > 0) { packs['1L'] += Math.ceil(remaining); }
    
    return packs;
  }, [calculations.finalLiters]);

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContainer}>
        <div className={styles.header}>
          <h1><span role="img" aria-label="abacus">🧮</span> Paint Calculator Pro</h1>
          <p>Professional grade area management. Estimate exactly how much surface you have and what it demands.</p>
        </div>

        <div className={styles.unitToggle}>
          <button className={`${styles.unitBtn} ${unit === 'sqft' ? styles.active : ''}`} onClick={() => setUnit('sqft')}>Feet (sq ft)</button>
          <button className={`${styles.unitBtn} ${unit === 'sqm' ? styles.active : ''}`} onClick={() => setUnit('sqm')}>Meters (m²)</button>
        </div>

        <div className={styles.calculatorLayout}>
          
          <div className={styles.inputSection}>
            <div className={styles.card}>
              <h3>1. Area Geometry</h3>
              
              <div className={styles.inputGroup}>
                <label>Room Length</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setLength(Math.max(0, length - 1))}><Minus size={16}/></button>
                  <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} />
                  <button onClick={() => setLength(length + 1)}><Plus size={16}/></button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Room Width</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setWidth(Math.max(0, width - 1))}><Minus size={16}/></button>
                  <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
                  <button onClick={() => setWidth(width + 1)}><Plus size={16}/></button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Wall Height</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setHeight(Math.max(0, height - 1))}><Minus size={16}/></button>
                  <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                  <button onClick={() => setHeight(height + 1)}><Plus size={16}/></button>
                </div>
              </div>

              <label className={styles.checkboxLabel} style={{marginTop: '1rem'}}>
                <input type="checkbox" checked={includeCeiling} onChange={e => setIncludeCeiling(e.target.checked)} />
                Include Ceiling Area
              </label>
            </div>

            <div className={styles.card}>
              <h3>2. Subtractions (Openings)</h3>
              <p style={{fontSize: '0.85rem', color: '#888', marginBottom: '1rem'}}>Specify the actual sizes of windows and doors being excluded.</p>
              
              <div className={styles.openingsList}>
                {openings.map((op, idx) => (
                  <div key={op.id} className={styles.openingItem}>
                    <span className={styles.openingType}>{op.type} {idx + 1}</span>
                    <input type="number" className={styles.dimInput} value={op.width} onChange={(e) => updateOpening(op.id, 'width', e.target.value)} placeholder="W" />
                    <span style={{color: '#888'}}>x</span>
                    <input type="number" className={styles.dimInput} value={op.height} onChange={(e) => updateOpening(op.id, 'height', e.target.value)} placeholder="H" />
                    <button className={styles.removeOpeningBtn} onClick={() => removeOpening(op.id)}><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
              
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button className={styles.addOpeningBtn} onClick={() => addOpening('Window')}><Plus size={16}/> Window</button>
                <button className={styles.addOpeningBtn} onClick={() => addOpening('Door')}><Plus size={16}/> Door</button>
              </div>
            </div>

            <div className={styles.card}>
              <h3>3. Material Efficiency & Loss</h3>
              
              <div className={styles.inputGroup} style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>
                <label>Paint Type</label>
                <select className={styles.selectInput} value={paintType} onChange={e => setPaintType(e.target.value)}>
                  <option value="Primer">Primer (High Coverage)</option>
                  <option value="Emulsion">Emulsion (Standard Paint)</option>
                  <option value="Texture">Texture (Heavy / Low Coverage)</option>
                </select>
              </div>

              <div className={styles.inputGroup} style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>
                <label>Surface Condition</label>
                <select className={styles.selectInput} value={surfaceType} onChange={e => setSurfaceType(e.target.value)}>
                  <option value="Smooth">Smooth / Pre-painted (Standard Absorption)</option>
                  <option value="Rough">Rough / Textured (High Absorption)</option>
                  <option value="New">New Wall / Fresh Plaster (Very High Absorption)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Number of Coats</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setCoats(Math.max(0, coats - 1))}><Minus size={16}/></button>
                  <input type="number" value={coats} onChange={(e) => setCoats(Number(e.target.value))} />
                  <button onClick={() => setCoats(coats + 1)}><Plus size={16}/></button>
                </div>
              </div>

              <div className={styles.inputGroup} style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>
                <label>Real-world Wastage buffer</label>
                <select className={styles.selectInput} value={wastagePercent} onChange={e => setWastagePercent(Number(e.target.value))}>
                  <option value={0}>0% (No wastage buffer)</option>
                  <option value={5}>5% (Professional painter, rigid control)</option>
                  <option value={10}>10% (Standard / Safe buffer)</option>
                  <option value={15}>15% (DIY / Spillage / Complex routing)</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.resultSection}>
            <div className={styles.resultCard}>
              <CalcIcon size={48} color="#00C9FF" className={styles.resultIcon} />
              <h2>Estimated Paint Required</h2>
              <div className={styles.bigNumber}>
                {calculations.finalLiters} <span className={styles.unit}>Liters</span>
              </div>
              <p className={styles.desc}>Based on a {PAINT_COVERAGE[paintType][unit]} {unit === 'sqft' ? 'sq ft' : 'm²'}/L coverage capacity.</p>
              
              <div className={styles.breakdown}>
                <div className={styles.breakdownRow}>
                  <span>Base Wall Area</span>
                  <span>{calculations.wallArea} {unit}</span>
                </div>
                {includeCeiling && (
                  <div className={styles.breakdownRow}>
                    <span>Ceiling Area</span>
                    <span>+ {calculations.ceilingArea} {unit}</span>
                  </div>
                )}
                <div className={styles.breakdownRow}>
                  <span>Total Deductions (Openings)</span>
                  <span style={{color: '#ff4b4b'}}>- {calculations.deductionArea} {unit}</span>
                </div>
                <div className={styles.breakdownRow} style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginBottom: '1rem'}}>
                  <span>Net Paintable Surface</span>
                  <span>{calculations.netArea} {unit}</span>
                </div>

                <div className={styles.breakdownRow}>
                  <span>Multiple Coats (x{coats})</span>
                  <span>{calculations.netArea * coats} {unit}</span>
                </div>
                <div className={styles.breakdownRow} style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem'}}>
                  <span>Surface Porosity Loss (x{SURFACE_MULTIPLIERS[surfaceType]})</span>
                  <span style={{color: '#ffd000'}}>+ {Math.round(calculations.totalAreaToCover - (calculations.netArea * coats))} {unit}</span>
                </div>
              </div>

              <div className={styles.breakdown} style={{background: 'rgba(0, 201, 255, 0.05)', borderColor: 'rgba(0, 201, 255, 0.2)'}}>
                <h4 style={{margin: '0 0 1rem 0', color: '#00C9FF'}}>Smart Packaging Suggestion</h4>
                {packaging['10L'] > 0 && <div className={styles.breakdownRow}><span>10 Liter Buckets</span><span>{packaging['10L']} packs</span></div>}
                {packaging['4L'] > 0 && <div className={styles.breakdownRow}><span>4 Liter Buckets</span><span>{packaging['4L']} packs</span></div>}
                {packaging['1L'] > 0 && <div className={styles.breakdownRow}><span>1 Liter Buckets</span><span>{packaging['1L']} packs</span></div>}
                
                <p style={{fontSize:'0.8rem', color:'#888', marginTop: '1rem', marginBottom: 0}}>
                  Includes +{wastagePercent}% safety buffer for accidental spills and roller waste.
                </p>
              </div>

              <button className={styles.shopBtn} onClick={() => navigate('/shop')}>Shop Recommended Paints</button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaintCalculator;
