import React from 'react';
import { useApp } from '../context/AppContext';
import { getCurrencySymbol, formatCurrency } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const { appData, calculateStats, activeWorkspace } = useApp();
  const stats = calculateStats(appData.activePeriodId);

  if (!stats) return null;

  const currency = stats.transactionCount > 0 ? stats.mostProfitable?.currency || 'USD' : 'USD';
  const currencySymbol = getCurrencySymbol(currency);

  // Tahmini Kar hesaplama
  const period = appData.periods.find(p => p.id === appData.activePeriodId);
  let estimatedProfit = 0;
  
  if (period && period.transactions) {
    period.transactions.forEach(t => {
      if (activeWorkspace === 1) {
        // Workspace 1: Tahmini Steam Net - Bynogame Alış
        estimatedProfit += (t.estimatedSteamNet || 0) - (t.bynogameBuyPrice || 0);
      } else {
        // Workspace 2: (Tahmini CSF Satış * Adet) - (Steam Alış * Adet)
        const quantity = t.quantity || 1;
        estimatedProfit += ((t.estimatedCSFSellPrice || 0) * quantity) - ((t.steamBuyPrice || 0) * quantity);
      }
    });
  }

  return (
    <div className="dashboard">
      <div className="stat-card">
        <div className="stat-label">📥 Toplam Alış</div>
        <div className="stat-value">{formatCurrency(stats.totalBuy, currencySymbol)}</div>
        <div className="stat-subtitle">{stats.transactionCount} işlem</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">📤 Toplam Satış</div>
        <div className="stat-value">{formatCurrency(stats.totalSell, currencySymbol)}</div>
        <div className="stat-subtitle">{stats.transactionCount} işlem</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">💰 Tahmini Kar</div>
        <div className={`stat-value ${estimatedProfit >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(estimatedProfit, currencySymbol)}
        </div>
        <div className="stat-subtitle">
          {activeWorkspace === 1 ? 'Steam Net - Bynogame' : 'CSF - Steam'}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">📊 İşlem Sayısı</div>
        <div className="stat-value">{stats.transactionCount}</div>
        <div className="stat-subtitle">Toplam işlem</div>
      </div>

      {stats.mostProfitable && (
        <div className="stat-card profit">
          <div className="stat-label">🏆 En Kârlı İşlem</div>
          <div className="stat-value positive">
            {formatCurrency(
              activeWorkspace === 1 
                ? (stats.mostProfitable.actualProfit || 0)
                : (stats.mostProfitable._calculatedProfit || 0),
              getCurrencySymbol(stats.mostProfitable.currency)
            )}
          </div>
          <div className="stat-subtitle">{stats.mostProfitable.itemName}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
