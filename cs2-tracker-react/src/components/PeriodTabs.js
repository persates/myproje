import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './PeriodTabs.css';

const PeriodTabs = () => {
  const { appData, switchPeriod, deletePeriod, createPeriod } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [periodName, setPeriodName] = useState('');

  const handleDeletePeriod = (periodId, event) => {
    event.stopPropagation();
    
    const result = deletePeriod(periodId);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleCreatePeriod = () => {
    createPeriod(periodName.trim() || undefined);
    setPeriodName('');
    setShowModal(false);
  };

  return (
    <>
      <div className="period-section">
        <div className="period-tabs">
          {appData.periods.map(period => (
            <div
              key={period.id}
              className={`period-tab ${period.id === appData.activePeriodId ? 'active' : ''}`}
              onClick={() => switchPeriod(period.id)}
            >
              {period.name}
              {appData.periods.length > 1 && (
                <button
                  className="delete-period"
                  onClick={(e) => handleDeletePeriod(period.id, e)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="new-period-btn" onClick={() => setShowModal(true)}>
          ➕ Yeni Dönem
        </button>
      </div>

      {showModal && (
        <div className="modal active" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Yeni Dönem Oluştur</h3>
            <div className="form-group mb-20">
              <label htmlFor="periodName">Dönem Adı</label>
              <input
                type="text"
                id="periodName"
                value={periodName}
                onChange={(e) => setPeriodName(e.target.value)}
                placeholder="Orn: Donem 1 "
                onKeyPress={(e) => e.key === 'Enter' && handleCreatePeriod()}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                İptal
              </button>
              <button className="btn btn-primary" onClick={handleCreatePeriod}>
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PeriodTabs;
