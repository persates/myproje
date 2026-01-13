import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import './TotalStats.css';

const TotalStats = () => {
  const { appData, activeWorkspace } = useApp();
  const [showModal, setShowModal] = useState(false);

  // Tüm dönemlerdeki tüm işlemleri topla
  const getAllTransactions = () => {
    const allTransactions = [];
    appData.periods.forEach(period => {
      period.transactions.forEach(transaction => {
        allTransactions.push({
          ...transaction,
          periodName: period.name
        });
      });
    });
    return allTransactions;
  };

  const allTransactions = getAllTransactions();

  // Toplamları hesapla
  const calculateTotals = () => {
    let totalBynogameBuy = 0;
    let totalEstimatedSteamNet = 0;
    let totalActualSellNet = 0;
    let totalTargetProfit = 0;
    let totalActualProfit = 0;
    let completedTransactions = 0;
    let totalQuantity = 0;
    let totalSteamBuy = 0;
    let totalEstimatedCSFSell = 0;
    let totalActualSell = 0;

    allTransactions.forEach(t => {
      if (activeWorkspace === 1) {
        totalBynogameBuy += t.bynogameBuyPrice || 0;
        totalEstimatedSteamNet += t.estimatedSteamNet || 0;
        totalTargetProfit += t.targetProfit || 0;
        
        if (t.actualProfit !== null) {
          totalActualProfit += t.actualProfit;
          totalActualSellNet += t.actualSellNet || 0;
          completedTransactions++;
        }
      } else {
        // Workspace 2
        const quantity = t.quantity || 1;
        totalQuantity += quantity;
        totalSteamBuy += (t.steamBuyPrice || 0) * quantity;
        totalEstimatedCSFSell += (t.estimatedCSFSellPrice || 0) * quantity;
        
        const estimatedProfit = ((t.estimatedCSFSellPrice || 0) * quantity) - ((t.steamBuyPrice || 0) * quantity);
        totalTargetProfit += estimatedProfit;
        
        if (t.actualSellPrice !== null) {
          const actualSellTotal = t.actualSellPrice * quantity;
          const steamBuyTotal = (t.steamBuyPrice || 0) * quantity;
          totalActualSell += actualSellTotal;
          totalActualProfit += (actualSellTotal - steamBuyTotal);
          completedTransactions++;
        }
      }
    });

    return {
      totalBynogameBuy,
      totalEstimatedSteamNet,
      totalActualSellNet,
      totalTargetProfit,
      totalActualProfit,
      completedTransactions,
      totalTransactions: allTransactions.length,
      totalQuantity,
      totalSteamBuy,
      totalEstimatedCSFSell,
      totalActualSell
    };
  };

  const totals = calculateTotals();
  const currencySymbol = '$';

  return (
    <>
      <button className="total-stats-button" onClick={() => setShowModal(true)}>
        {activeWorkspace === 1 ? '📊 Toplam İşlemler' : '📊 Toplam İşlemleR'}
        <span className="stats-badge">{allTransactions.length}</span>
      </button>

      {showModal && (
        <div className="modal active" onClick={() => setShowModal(false)}>
          <div className="modal-content total-stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 Tüm Dönemler - Toplam İstatistikler</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="total-summary">
              <div className="summary-card">
                <div className="summary-label">Toplam İşlem Sayısı</div>
                <div className="summary-value">{totals.totalTransactions}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Tamamlanan İşlemler</div>
                <div className="summary-value">{totals.completedTransactions}</div>
              </div>
              {activeWorkspace === 1 ? (
                <>
                  <div className="summary-card">
                    <div className="summary-label">Toplam Bynogame Alış</div>
                    <div className="summary-value">{formatCurrency(totals.totalBynogameBuy, currencySymbol)}</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-label">Tahmini Steam Satış</div>
                    <div className="summary-value">{formatCurrency(totals.totalEstimatedSteamNet, currencySymbol)}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="summary-card">
                    <div className="summary-label">Toplam Adet</div>
                    <div className="summary-value">{totals.totalQuantity}</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-label">Toplam Steam Alış</div>
                    <div className="summary-value">{formatCurrency(totals.totalSteamBuy, currencySymbol)}</div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-label">Toplam Tahmini CSF Satış</div>
                    <div className="summary-value">{formatCurrency(totals.totalEstimatedCSFSell, currencySymbol)}</div>
                  </div>
                </>
              )}
              <div className="summary-card">
                <div className="summary-label">{activeWorkspace === 1 ? 'Tahmini Toplam Steam Kâr' : 'Tahmini Toplam Kâr'}</div>
                <div className={`summary-value ${totals.totalTargetProfit >= 0 ? 'positive' : 'negative'}`}>
                  {totals.totalTargetProfit >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(totals.totalTargetProfit), currencySymbol)}
                </div>
              </div>
              <div className="summary-card highlight">
                <div className="summary-label">Gerçekleşen Toplam Kâr</div>
                <div className={`summary-value ${totals.totalActualProfit >= 0 ? 'positive' : 'negative'}`}>
                  {totals.totalActualProfit >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(totals.totalActualProfit), currencySymbol)}
                </div>
              </div>
            </div>

            <div className="transactions-list">
              <h3>Tüm İşlemler ({allTransactions.length})</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Dönem</th>
                      <th>İsim</th>
                      {activeWorkspace === 2 && <th>Adet</th>}
                      {activeWorkspace === 1 ? (
                        <>
                          <th>Dolar Kuru</th>
                          <th>Bynogame Alış</th>
                          <th>Tahmini Net</th>
                        </>
                      ) : (
                        <>
                          <th>Steam Alış</th>
                          <th>Tahmini CSF Satış</th>
                        </>
                      )}
                      <th>Hedef Kâr</th>
                      <th>Gerçek Satış</th>
                      <th>Gerçek Kâr</th>
                      <th>Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.map(t => {
                      let targetProfit, actualProfit;
                      
                      if (activeWorkspace === 1) {
                        targetProfit = t.targetProfit || 0;
                        actualProfit = t.actualProfit;
                      } else {
                        const quantity = t.quantity || 1;
                        const steamBuyTotal = (t.steamBuyPrice || 0) * quantity;
                        const estimatedCSFTotal = (t.estimatedCSFSellPrice || 0) * quantity;
                        const actualSellTotal = t.actualSellPrice !== null ? t.actualSellPrice * quantity : null;
                        
                        targetProfit = estimatedCSFTotal - steamBuyTotal;
                        actualProfit = actualSellTotal !== null ? actualSellTotal - steamBuyTotal : null;
                      }
                      
                      const targetProfitClass = targetProfit > 0 ? 'positive' : targetProfit < 0 ? 'negative' : 'zero';
                      const actualProfitClass = actualProfit !== null 
                        ? (actualProfit > 0 ? 'positive' : actualProfit < 0 ? 'negative' : 'zero')
                        : '';

                      return (
                        <tr key={t.id}>
                          <td><span className="period-badge">{t.periodName}</span></td>
                          <td><strong>{t.itemName}</strong></td>
                          {activeWorkspace === 2 && <td>{t.quantity || 1}</td>}
                          {activeWorkspace === 1 ? (
                            <>
                              <td>{formatCurrency(t.dollarRate || 0, currencySymbol)}</td>
                              <td>{formatCurrency(t.bynogameBuyPrice || 0, currencySymbol)}</td>
                              <td>{formatCurrency(t.estimatedSteamNet || 0, currencySymbol)}</td>
                            </>
                          ) : (
                            <>
                              <td>{formatCurrency((t.steamBuyPrice || 0) * (t.quantity || 1), currencySymbol)}</td>
                              <td>{formatCurrency((t.estimatedCSFSellPrice || 0) * (t.quantity || 1), currencySymbol)}</td>
                            </>
                          )}
                          <td className={`profit-cell ${targetProfitClass}`}>
                            {targetProfit >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(targetProfit), currencySymbol)}
                          </td>
                          <td>
                            {activeWorkspace === 1 ? (
                              t.actualSellPrice !== null 
                                ? formatCurrency(t.actualSellNet || 0, currencySymbol)
                                : <span className="not-sold">-</span>
                            ) : (
                              t.actualSellPrice !== null 
                                ? formatCurrency(t.actualSellPrice * (t.quantity || 1), currencySymbol)
                                : <span className="not-sold">-</span>
                            )}
                          </td>
                          <td className={`profit-cell ${actualProfitClass}`}>
                            {actualProfit !== null 
                              ? `${actualProfit >= 0 ? '↑' : '↓'} ${formatCurrency(Math.abs(actualProfit), currencySymbol)}`
                              : '-'
                            }
                          </td>
                          <td>{formatDate(t.date)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalStats;
