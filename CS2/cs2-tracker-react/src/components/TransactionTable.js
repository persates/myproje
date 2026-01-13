import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCurrencySymbol, formatCurrency, formatDate, sortTransactionArray } from '../utils/helpers';
import Toast from './Toast';
import './TransactionTable.css';

const TransactionTable = () => {
  const { appData, currentSort, setCurrentSort, deleteTransaction, editTransaction, activeWorkspace } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editFormData, setEditFormData] = useState({
    itemName: '',
    dollarRate: '',
    bynogameBuyPrice: '',
    estimatedSteamPrice: '',
    quantity: '',
    steamBuyPrice: '',
    estimatedCSFSellPrice: '',
    actualSellPrice: '',
    currency: 'USD',
    date: '',
    notes: ''
  });

  const period = appData.periods.find(p => p.id === appData.activePeriodId);
  if (!period) return null;

  const handleSort = (field) => {
    if (currentSort.field === field) {
      setCurrentSort({ 
        field, 
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc' 
      });
    } else {
      setCurrentSort({ field, direction: 'desc' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      deleteTransaction(id);
      setToastMessage('İşlem silindi!');
      setShowToast(true);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    if (activeWorkspace === 1) {
      setEditFormData({
        itemName: transaction.itemName,
        dollarRate: transaction.dollarRate || '',
        bynogameBuyPrice: transaction.bynogameBuyPrice || '',
        estimatedSteamPrice: transaction.estimatedSteamPrice || '',
        actualSellPrice: transaction.actualSellPrice || '',
        currency: transaction.currency,
        date: transaction.date,
        notes: transaction.notes
      });
    } else {
      setEditFormData({
        itemName: transaction.itemName,
        quantity: transaction.quantity || 1,
        steamBuyPrice: transaction.steamBuyPrice || 0,
        estimatedCSFSellPrice: transaction.estimatedCSFSellPrice || 0,
        actualSellPrice: transaction.actualSellPrice || '',
        currency: transaction.currency,
        date: transaction.date,
        notes: transaction.notes
      });
    }
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editTransaction(editingId, editFormData);
    setShowEditModal(false);
    setEditingId(null);
    setToastMessage('İşlem güncellendi!');
    setShowToast(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const sorted = sortTransactionArray(period.transactions, currentSort.field, currentSort.direction);

  if (period.transactions.length === 0) {
    return (
      <div className="transactions-section">
        <div className="transactions-header">
          <h2>📊 İşlemler</h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>Henüz işlem yok</h3>
          <p>Yukarıdaki formu kullanarak ilk işleminizi ekleyin!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="transactions-section">
        <div className="transactions-header">
          <h2>📊 İşlemler</h2>
          <div className="sort-controls">
            <button
              className={`sort-btn ${currentSort.field === 'date' ? 'active' : ''}`}
              onClick={() => handleSort('date')}
            >
              📅 Tarihe Göre
            </button>
            <button
              className={`sort-btn ${currentSort.field === 'profit' ? 'active' : ''}`}
              onClick={() => handleSort('profit')}
            >
              💰 Kâra Göre
            </button>
            <button
              className={`sort-btn ${currentSort.field === 'item' ? 'active' : ''}`}
              onClick={() => handleSort('item')}
            >
              🔤 İsme Göre
            </button>
          </div>
        </div>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                {activeWorkspace === 1 ? (
                  <>
                    <th>Eşya</th>
                    <th>Dolar Kuru</th>
                    <th>Bynogame Alış</th>
                    <th>Tahmini Steam <span className="info-icon" title="Steam %87'si hesaplanacaktır">⚠️</span></th>
                    <th>Hedefteki Kâr</th>
                    <th>Gerçek Satış <span className="info-icon" title="Steam %87'si hesaplanacaktır">⚠️</span></th>
                    <th>Gerçek Kâr</th>
                  </>
                ) : (
                  <>
                    <th>İsim</th>
                    <th>Adet</th>
                    <th>Steam Alış Fiyat</th>
                    <th>Tahmini CSF Satış</th>
                    <th>Gerçekleşen Satış Fiyatı</th>
                    <th>Tahmini CSF Satış - Steam Alış</th>
                    <th>Gerçekleşen Satış Fiyatı - Steam Alış</th>
                  </>
                )}
                <th>Tarih</th>
                <th>Notlar</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(t => {
                const currencySymbol = getCurrencySymbol(t.currency);
                
                if (activeWorkspace === 1) {
                  // Workspace 1: Bynogame trading
                  const targetProfitClass = (t.targetProfit || 0) > 0 ? 'positive' : (t.targetProfit || 0) < 0 ? 'negative' : 'zero';
                  const actualProfitClass = t.actualProfit !== null 
                    ? ((t.actualProfit || 0) > 0 ? 'positive' : (t.actualProfit || 0) < 0 ? 'negative' : 'zero')
                    : '';

                  return (
                    <tr key={t.id}>
                      <td><strong>{t.itemName}</strong></td>
                      <td>{formatCurrency(t.dollarRate || 0, currencySymbol)}</td>
                      <td>{formatCurrency(t.bynogameBuyPrice || 0, currencySymbol)}</td>
                      <td>
                        <div className="price-with-net">
                          <span className="original-price">{formatCurrency(t.estimatedSteamPrice || 0, currencySymbol)}</span>
                          <small className="net-price">Net: {formatCurrency(t.estimatedSteamNet || 0, currencySymbol)}</small>
                        </div>
                      </td>
                      <td className={`profit-cell ${targetProfitClass}`}>
                        {(t.targetProfit || 0) >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(t.targetProfit || 0), currencySymbol)}
                      </td>
                      <td>
                        {t.actualSellPrice !== null ? (
                          <div className="price-with-net">
                            <span className="original-price">{formatCurrency(t.actualSellPrice || 0, currencySymbol)}</span>
                            <small className="net-price">Net: {formatCurrency(t.actualSellNet || 0, currencySymbol)}</small>
                          </div>
                        ) : (
                          <span className="not-sold">-</span>
                        )}
                      </td>
                      <td className={`profit-cell ${actualProfitClass}`}>
                        {t.actualProfit !== null 
                          ? `${(t.actualProfit || 0) >= 0 ? '↑' : '↓'} ${formatCurrency(Math.abs(t.actualProfit || 0), currencySymbol)}`
                          : '-'
                        }
                      </td>
                      <td>{formatDate(t.date)}</td>
                      <td>{t.notes || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-small btn-edit" onClick={() => handleEdit(t)}>
                            ✏️ Düzenle
                          </button>
                          <button className="btn-small btn-delete" onClick={() => handleDelete(t.id)}>
                            🗑️ Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  // Workspace 2: Steam to CSF trading
                  const quantity = t.quantity || 1;
                  const steamBuyPrice = t.steamBuyPrice || 0;
                  const estimatedCSFSellPrice = t.estimatedCSFSellPrice || 0;
                  const actualSellPrice = t.actualSellPrice;
                  
                  const totalSteamBuyPrice = steamBuyPrice * quantity;
                  const totalEstimatedCSFSellPrice = estimatedCSFSellPrice * quantity;
                  const totalActualSellPrice = actualSellPrice !== null ? actualSellPrice * quantity : null;
                  
                  const targetProfit = totalEstimatedCSFSellPrice - totalSteamBuyPrice;
                  const actualProfit = totalActualSellPrice !== null ? totalActualSellPrice - totalSteamBuyPrice : null;
                  
                  const targetProfitClass = targetProfit > 0 ? 'positive' : targetProfit < 0 ? 'negative' : 'zero';
                  const actualProfitClass = actualProfit !== null 
                    ? (actualProfit > 0 ? 'positive' : actualProfit < 0 ? 'negative' : 'zero')
                    : '';

                  return (
                    <tr key={t.id}>
                      <td><strong>{t.itemName}</strong></td>
                      <td>{quantity}</td>
                      <td>{formatCurrency(totalSteamBuyPrice, currencySymbol)}</td>
                      <td>{formatCurrency(totalEstimatedCSFSellPrice, currencySymbol)}</td>
                      <td>
                        {totalActualSellPrice !== null 
                          ? formatCurrency(totalActualSellPrice, currencySymbol)
                          : <span className="not-sold">-</span>
                        }
                      </td>
                      <td className={`profit-cell ${targetProfitClass}`}>
                        {targetProfit >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(targetProfit), currencySymbol)}
                      </td>
                      <td className={`profit-cell ${actualProfitClass}`}>
                        {actualProfit !== null 
                          ? `${actualProfit >= 0 ? '↑' : '↓'} ${formatCurrency(Math.abs(actualProfit), currencySymbol)}`
                          : '-'
                        }
                      </td>
                      <td>{formatDate(t.date)}</td>
                      <td>{t.notes || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-small btn-edit" onClick={() => handleEdit(t)}>
                            ✏️ Düzenle
                          </button>
                          <button className="btn-small btn-delete" onClick={() => handleDelete(t.id)}>
                            🗑️ Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && (
        <div className="modal active" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>İşlemi Düzenle</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group mb-20">
                <label htmlFor="editItemName">Eşya Adı</label>
                <input
                  type="text"
                  id="editItemName"
                  name="itemName"
                  value={editFormData.itemName}
                  onChange={handleEditChange}
                />
              </div>
              {activeWorkspace === 1 ? (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="editDollarRate">Dolar Kuru</label>
                      <input
                        type="number"
                        id="editDollarRate"
                        name="dollarRate"
                        value={editFormData.dollarRate}
                        onChange={handleEditChange}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="editBynogameBuyPrice">Bynogame Alış</label>
                      <input
                        type="number"
                        id="editBynogameBuyPrice"
                        name="bynogameBuyPrice"
                        value={editFormData.bynogameBuyPrice}
                        onChange={handleEditChange}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="editEstimatedSteamPrice">
                        Tahmini Steam
                        <span className="info-icon" title="Steam %87'si hesaplanacaktır">⚠️</span>
                      </label>
                      <input
                        type="number"
                        id="editEstimatedSteamPrice"
                        name="estimatedSteamPrice"
                        value={editFormData.estimatedSteamPrice}
                        onChange={handleEditChange}
                        step="0.01"
                        min="0"
                      />
                      {editFormData.estimatedSteamPrice && (
                        <small className="helper-text">
                          Net: {(parseFloat(editFormData.estimatedSteamPrice) * 0.87).toFixed(2)}
                        </small>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="editActualSellPrice">
                        Gerçek Satış
                        <span className="info-icon" title="Steam %87'si hesaplanacaktır">⚠️</span>
                      </label>
                      <input
                        type="number"
                        id="editActualSellPrice"
                        name="actualSellPrice"
                        value={editFormData.actualSellPrice}
                        onChange={handleEditChange}
                        step="0.01"
                        min="0"
                      />
                      {editFormData.actualSellPrice && (
                        <small className="helper-text">
                          Net: {(parseFloat(editFormData.actualSellPrice) * 0.87).toFixed(2)}
                        </small>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="editQuantity">Adet</label>
                      <input
                        type="number"
                        id="editQuantity"
                        name="quantity"
                        value={editFormData.quantity}
                        onChange={handleEditChange}
                        step="1"
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="editSteamBuyPrice">Steam Alış Fiyat</label>
                      <input
                        type="number"
                        id="editSteamBuyPrice"
                        name="steamBuyPrice"
                        value={editFormData.steamBuyPrice}
                        onChange={handleEditChange}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="editEstimatedCSFSellPrice">Tahmini CSF Satış</label>
                      <input
                        type="number"
                        id="editEstimatedCSFSellPrice"
                        name="estimatedCSFSellPrice"
                        value={editFormData.estimatedCSFSellPrice}
                        onChange={handleEditChange}
                        step="0.01"
                        min="0"
                      />
                      {editFormData.estimatedCSFSellPrice && editFormData.steamBuyPrice && (
                        <small className="helper-text">
                          Tahmini Kâr: {(parseFloat(editFormData.estimatedCSFSellPrice) - parseFloat(editFormData.steamBuyPrice)).toFixed(2)}
                        </small>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="editActualSellPrice">Gerçekleşen Satış Fiyatı</label>
                      <input
                        type="number"
                        id="editActualSellPrice"
                        name="actualSellPrice"
                        value={editFormData.actualSellPrice}
                        onChange={handleEditChange}
                    step="0.01"
                    min="0"
                  />
                      {editFormData.actualSellPrice && editFormData.steamBuyPrice && (
                        <small className="helper-text">
                          Gerçek Kâr: {(parseFloat(editFormData.actualSellPrice) - parseFloat(editFormData.steamBuyPrice)).toFixed(2)}
                        </small>
                      )}
                    </div>
                  </div>
                </>
              )}
              <div className="form-group mb-20">
                <label htmlFor="editDate">Tarih</label>
                <input
                  type="date"
                  id="editDate"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group mb-20">
                <label htmlFor="editNotes">Notlar</label>
                <textarea
                  id="editNotes"
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleEditChange}
                  maxLength="500"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </>
  );
};

export default TransactionTable;
