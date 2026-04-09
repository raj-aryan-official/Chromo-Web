import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { Calculator as CalcIcon, Plus, Minus } from 'lucide-react';
import styles from './PaintCalculator.module.css';

const PaintCalculator = () => {
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(9);
  const [windows, setWindows] = useState(1);
  const [doors, setDoors] = useState(1);
  const [coats, setCoats] = useState(2);

  // Simple paint estimation logic
  // Total Wall Area = 2 * (L*H + W*H)
  const totalWallArea = 2 * ((length * height) + (width * height));
  const deductions = (windows * 15) + (doors * 21); // Approx sq ft
  const netArea = Math.max(0, totalWallArea - deductions);
  const totalCoverage = netArea * coats;
  
  // Assuming 1 Gallon covers ~350 sq ft
  const gallonsNeeded = Math.ceil(totalCoverage / 350);

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContainer}>
        <div className={styles.header}>
          <h1><span role="img" aria-label="abacus">🧮</span> Paint Calculator</h1>
          <p>Estimate the exact amount of paint you need for your next project.</p>
        </div>

        <div className={styles.calculatorLayout}>
          
          <div className={styles.inputSection}>
            <div className={styles.card}>
              <h3>Room Dimensions (ft)</h3>
              
              <div className={styles.inputGroup}>
                <label>Room Length</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setLength(Math.max(1, length - 1))}><Minus size={16}/></button>
                  <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} />
                  <button onClick={() => setLength(length + 1)}><Plus size={16}/></button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Room Width</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setWidth(Math.max(1, width - 1))}><Minus size={16}/></button>
                  <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
                  <button onClick={() => setWidth(width + 1)}><Plus size={16}/></button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Wall Height</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setHeight(Math.max(1, height - 1))}><Minus size={16}/></button>
                  <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                  <button onClick={() => setHeight(height + 1)}><Plus size={16}/></button>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3>Deductions & Finish</h3>
              
              <div className={styles.inputGroup}>
                <label>Number of Windows</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setWindows(Math.max(0, windows - 1))}><Minus size={16}/></button>
                  <input type="number" value={windows} onChange={(e) => setWindows(Number(e.target.value))} />
                  <button onClick={() => setWindows(windows + 1)}><Plus size={16}/></button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Number of Doors</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setDoors(Math.max(0, doors - 1))}><Minus size={16}/></button>
                  <input type="number" value={doors} onChange={(e) => setDoors(Number(e.target.value))} />
                  <button onClick={() => setDoors(doors + 1)}><Plus size={16}/></button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Number of Coats</label>
                <div className={styles.numberInput}>
                  <button onClick={() => setCoats(Math.max(1, coats - 1))}><Minus size={16}/></button>
                  <input type="number" value={coats} onChange={(e) => setCoats(Number(e.target.value))} />
                  <button onClick={() => setCoats(coats + 1)}><Plus size={16}/></button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.resultSection}>
            <div className={styles.resultCard}>
              <CalcIcon size={48} color="#00C9FF" className={styles.resultIcon} />
              <h2>You will need</h2>
              <div className={styles.bigNumber}>
                {gallonsNeeded} <span className={styles.unit}>Gallons</span>
              </div>
              <p className={styles.desc}>(Approx. {gallonsNeeded * 3.78} Liters)</p>
              
              <div className={styles.breakdown}>
                <div className={styles.breakdownRow}>
                  <span>Total Wall Area</span>
                  <span>{totalWallArea} sq ft</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Deductions</span>
                  <span>- {deductions} sq ft</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Net Paintable Area</span>
                  <span>{netArea} sq ft</span>
                </div>
                <div className={styles.breakdownRow} style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem'}}>
                  <span>Total With Coats (x{coats})</span>
                  <span>{totalCoverage} sq ft</span>
                </div>
              </div>

              <button className={styles.shopBtn}>Shop Recommended Paints</button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaintCalculator;
