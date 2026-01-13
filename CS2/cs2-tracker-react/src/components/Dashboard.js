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
