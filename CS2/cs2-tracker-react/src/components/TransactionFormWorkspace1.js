import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTodayDate } from '../utils/helpers';
import Toast from './Toast';
import './TransactionForm.css';

const TransactionFormWorkspace1 = () => {
  const { addTransaction } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    itemName: '',
    dollarRate: '',
    bynogameBuyPrice: '',
    estimatedSteamPrice: '',
    actualSellPrice: '',
    currency: 'USD',
    date: getTodayDate(),
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction(formData);
    setFormData({
      itemName: '',
      dollarRate: '',
      bynogameBuyPrice: '',
      estimatedSteamPrice: '',
      actualSellPrice: '',
      currency: 'USD',
      date: getTodayDate(),
      notes: ''
    });
    setToastMessage('İşlem başarıyla eklendi!');
    setShowToast(true);
  };

  const handleClear = () => {
    setFormData({
      itemName: '',
      dollarRate: '',
      bynogameBuyPrice: '',
      estimatedSteamPrice: '',
      actualSellPrice: '',
      currency: 'USD',
      date: getTodayDate(),
      notes: ''
    });
  };

  return (
    <>
      <div className="transaction-form">
        <h2>➕ Yeni İşlem Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dollarRate">Dolar Kuru *</label>
              <input
                type="number"
                id="dollarRate"
                name="dollarRate"
                value={formData.dollarRate}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                placeholder="örn: 34.50"
              />
            </div>
            <div className="form-group">
              <label htmlFor="itemName">Eşya Adı *</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
                placeholder="örn: AK-47 | Redline"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bynogameBuyPrice">Bynogame Alış Fiyatı *</label>
              <input
                type="number"
                id="bynogameBuyPrice"
                name="bynogameBuyPrice"
                value={formData.bynogameBuyPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label htmlFor="estimatedSteamPrice">
                Tahmini Steam Satış Fiyatı
                <span className="info-icon" title="Steam %87'si hesaplanacaktır">⚠️</span>
              </label>
              <input
                type="number"
                id="estimatedSteamPrice"
                name="estimatedSteamPrice"
                value={formData.estimatedSteamPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
              {formData.estimatedSteamPrice && (
                <small className="helper-text">
                  Net: ${(parseFloat(formData.estimatedSteamPrice) * 0.87).toFixed(2)}
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="actualSellPrice">
                Gerçek Satış Fiyatı
                <span className="info-icon" title="Steam %87'si hesaplanacaktır">⚠️</span>
              </label>
              <input
                type="number"
                id="actualSellPrice"
                name="actualSellPrice"
                value={formData.actualSellPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
              {formData.actualSellPrice && (
                <small className="helper-text">
                  Net: ${(parseFloat(formData.actualSellPrice) * 0.87).toFixed(2)}
                </small>
              )}
            </div>
          </div>
          <div className="form-group mb-20">
            <label htmlFor="notes">Notlar (İsteğe bağlı)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              maxLength="500"
              placeholder="İşlem hakkında notlar..."
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Temizle
            </button>
            <div className="button-wrapper">
              <button type="submit" className="spiderverse-button">
                İşlem Ekle
                <div className="glitch-layers">
                  <div className="glitch-layer layer-1">İşlem Ekle</div>
                  <div className="glitch-layer layer-2">İşlem Ekle</div>
                </div>
                <div className="noise"></div>
                <div className="glitch-slice"></div>
              </button>
            </div>
          </div>
        </form>
      </div>
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </>
  );
};

export default TransactionFormWorkspace1;
