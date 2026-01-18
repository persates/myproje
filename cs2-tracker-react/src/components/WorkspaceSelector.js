import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrencySymbol } from '../utils/helpers';
import './WorkspaceSelector.css';

const WorkspaceSelector = () => {
  const { activeWorkspace, switchWorkspace, appData, calculateStats } = useApp();
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const calculateTotalProfits = () => {
    // DOĞRUDAN localStorage'tan her iki workspace'i de oku - DİNAMİK
    const getWorkspaceData = (workspaceId) => {
      try {
        const key = `cs2TrackerData_workspace_${workspaceId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          return data.periods || [];
        }
      } catch (e) {
        console.error(`Workspace ${workspaceId} verileri okunamadı:`, e);
      }
      return [];
    };

    const workspace1Periods = getWorkspaceData(1);
    const workspace2Periods = getWorkspaceData(2);

    // Workspace 1 (BY => ST) için Gerçekleşen Toplam Kâr
    let workspace1TotalActualProfit = 0;
    workspace1Periods.forEach(period => {
      period.transactions.forEach(t => {
        if (t.actualProfit !== null && t.actualProfit !== undefined) {
          workspace1TotalActualProfit += t.actualProfit;
        }
      });
    });

    // Workspace 2 (ST => CSF) için Gerçekleşen Toplam Kâr
    let workspace2TotalActualProfit = 0;
    workspace2Periods.forEach(period => {
      period.transactions.forEach(t => {
        const quantity = t.quantity || 1;
        if (t.actualSellPrice !== null && t.actualSellPrice !== undefined) {
          const actualSellTotal = t.actualSellPrice * quantity;
          const steamBuyTotal = (t.steamBuyPrice || 0) * quantity;
          workspace2TotalActualProfit += (actualSellTotal - steamBuyTotal);
        }
      });
    });

    // BY => ST (📊 Toplam İşlemler) - ST => CSF (📊 Toplam İşlemleR) = Fark
    // Pozitif değerleri çıkart (mutlak değerler üzerinden)
    const difference = Math.abs(workspace1TotalActualProfit) - Math.abs(workspace2TotalActualProfit);
    
    // Para birimini bul
    let currency = 'USD';
    const allPeriods = [...workspace1Periods, ...workspace2Periods];
    for (const period of allPeriods) {
      if (period.transactions && period.transactions.length > 0) {
        currency = period.transactions[0].currency || 'USD';
        break;
      }
    }

    console.log('BY => ST (📊 Toplam İşlemler) Gerçekleşen Toplam Kâr:', workspace1TotalActualProfit);
    console.log('ST => CSF (📊 Toplam İşlemleR) Gerçekleşen Toplam Kâr:', workspace2TotalActualProfit);
    console.log('Fark (BY => ST - ST => CSF):', difference);

    return { 
      workspace1TotalProfit: workspace1TotalActualProfit, 
      workspace2TotalProfit: workspace2TotalActualProfit, 
      difference, 
      currency 
    };
  };

  const renderComparisonModal = () => {
    if (!showComparisonModal) return null;

    const { workspace1TotalProfit, workspace2TotalProfit, difference, currency } = calculateTotalProfits();
    const currencySymbol = getCurrencySymbol(currency);
    const isPositive = difference >= 0;

    return (
      <div className="modal active" onClick={() => setShowComparisonModal(false)}>
        <div className="modal-content comparison-modal-simple" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>📊 Toplam Kâr/Zarar Karşılaştırması</h2>
            <button className="close-btn" onClick={() => setShowComparisonModal(false)}>✕</button>
          </div>
          
          <div className="comparison-simple">
            <div className="workspace-total">
              <div className="workspace-label-big">BY ⇒ ST</div>
              <div className="workspace-value-big">{formatCurrency(Math.abs(workspace1TotalProfit), currencySymbol)}</div>
              <div className="workspace-subtitle">
                Gerçekleşen Toplam {workspace1TotalProfit >= 0 ? 'Kâr' : 'Zarar'}
              </div>
            </div>

            <div className="comparison-operator">-</div>

            <div className="workspace-total">
              <div className="workspace-label-big">ST ⇒ CSF</div>
              <div className="workspace-value-big">{formatCurrency(Math.abs(workspace2TotalProfit), currencySymbol)}</div>
              <div className="workspace-subtitle">
                Gerçekleşen Toplam {workspace2TotalProfit >= 0 ? 'Kâr' : 'Zarar'}
              </div>
            </div>

            <div className="comparison-equals">=</div>

            <div className="difference-total">
              <div className={`difference-big ${isPositive ? 'profit' : 'loss'}`}>
                {isPositive ? '🔥' : '❌'} {formatCurrency(Math.abs(difference), currencySymbol)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="workspace-selector">
        <div className="workspace-buttons">
          <button
            className={`workspace-btn ${activeWorkspace === 1 ? 'active' : ''}`}
            onClick={() => switchWorkspace(1)}
          >
            <span>BY ⇒ ST</span>
          </button>
          <button
            className={`workspace-btn ${activeWorkspace === 2 ? 'active' : ''}`}
            onClick={() => switchWorkspace(2)}
          >
            <span>ST ⇒ CSF</span>
          </button>
        </div>
      </div>
      
      <button className="comparison-btn" onClick={() => setShowComparisonModal(true)}>
        📊
      </button>

      {renderComparisonModal()}
    </>
  );
};

export default WorkspaceSelector;
