import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const [appData, setAppData] = useState({
    periods: [],
    activePeriodId: null
  });

  const [currentSort, setCurrentSort] = useState({ field: 'date', direction: 'desc' });

  useEffect(() => {
    loadPeriods();
  }, [activeWorkspace]);

  useEffect(() => {
    if (appData.periods.length > 0) {
      savePeriods();
    }
  }, [appData]);

  const getStorageKey = () => `cs2TrackerData_workspace_${activeWorkspace}`;
  const getSharedPeriodsKey = () => 'cs2TrackerData_shared_periods';

  const savePeriods = () => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(appData));
      // Dönem listesini paylaşımlı olarak kaydet (sadece id, name, createdDate)
      const sharedPeriods = appData.periods.map(p => ({
        id: p.id,
        name: p.name,
        createdDate: p.createdDate
      }));
      localStorage.setItem(getSharedPeriodsKey(), JSON.stringify(sharedPeriods));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Depolama alanı dolu!');
      } else {
        console.error('Veri kaydedilirken hata oluştu:', e);
      }
    }
  };

  const loadPeriods = () => {
    try {
      const sharedPeriodsData = localStorage.getItem(getSharedPeriodsKey());
      const sharedPeriods = sharedPeriodsData ? JSON.parse(sharedPeriodsData) : null;

      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        const data = JSON.parse(stored);
        if (data && data.periods && Array.isArray(data.periods)) {
          // Eğer paylaşımlı dönemler varsa, onları kullan
          if (sharedPeriods && sharedPeriods.length > 0) {
            // Mevcut dönemleri paylaşımlı dönemlerle senkronize et
            const syncedPeriods = sharedPeriods.map(sharedPeriod => {
              const existingPeriod = data.periods.find(p => p.id === sharedPeriod.id);
              return existingPeriod || {
                ...sharedPeriod,
                transactions: []
              };
            });
            setAppData({
              periods: syncedPeriods,
              activePeriodId: data.activePeriodId || syncedPeriods[0].id
            });
          } else {
            setAppData(data);
          }
          if (!data.activePeriodId && data.periods.length > 0) {
            setAppData(prev => ({ ...prev, activePeriodId: data.periods[0].id }));
          }
        }
      } else if (sharedPeriods && sharedPeriods.length > 0) {
        // Bu workspace'te veri yok ama paylaşımlı dönemler var
        const newPeriods = sharedPeriods.map(sp => ({
          ...sp,
          transactions: []
        }));
        setAppData({
          periods: newPeriods,
          activePeriodId: newPeriods[0].id
        });
      } else {
        if (activeWorkspace === 1) {
          createSampleData();
        } else {
          setAppData({ periods: [], activePeriodId: null });
        }
      }
    } catch (e) {
      console.error('Veriler yüklenirken hata oluştu:', e);
    }
  };

  const switchWorkspace = (workspaceId) => {
    setActiveWorkspace(workspaceId);
  };

  const createPeriod = (name) => {
    const period = {
      id: 'period_' + Date.now(),
      name: name || `Dönem ${appData.periods.length + 1}`,
      createdDate: new Date().toISOString().split('T')[0],
      transactions: []
    };
    setAppData(prev => ({
      periods: [...prev.periods, period],
      activePeriodId: period.id
    }));
    return period;
  };

  const switchPeriod = (periodId) => {
    setAppData(prev => ({ ...prev, activePeriodId: periodId }));
  };

  const deletePeriod = (periodId) => {
    if (appData.periods.length === 1) {
      return { success: false, message: 'Son dönem silinemez!' };
    }

    // Her iki workspace'ten de sil
    [1, 2].forEach(wsId => {
      const key = `cs2TrackerData_workspace_${wsId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored);
        const newPeriods = data.periods.filter(p => p.id !== periodId);
        const newActivePeriodId = data.activePeriodId === periodId ? newPeriods[0]?.id : data.activePeriodId;
        localStorage.setItem(key, JSON.stringify({
          periods: newPeriods,
          activePeriodId: newActivePeriodId
        }));
      }
    });

    setAppData(prev => {
      const newPeriods = prev.periods.filter(p => p.id !== periodId);
      const newActivePeriodId = prev.activePeriodId === periodId ? newPeriods[0].id : prev.activePeriodId;
      return {
        periods: newPeriods,
        activePeriodId: newActivePeriodId
      };
    });
    return { success: true, message: 'Dönem silindi!' };
  };

  const addTransaction = (data) => {
    let transaction;
    
    if (activeWorkspace === 1) {
      // Workspace 1: Bynogame trading
      transaction = {
        id: 'trans_' + Date.now(),
        itemName: data.itemName,
        dollarRate: parseFloat(data.dollarRate),
        bynogameBuyPrice: parseFloat(data.bynogameBuyPrice),
        estimatedSteamPrice: parseFloat(data.estimatedSteamPrice),
        estimatedSteamNet: parseFloat(data.estimatedSteamPrice) * 0.87,
        targetProfit: (parseFloat(data.estimatedSteamPrice) * 0.87) - parseFloat(data.bynogameBuyPrice),
        actualSellPrice: data.actualSellPrice ? parseFloat(data.actualSellPrice) : null,
        actualSellNet: data.actualSellPrice ? parseFloat(data.actualSellPrice) * 0.87 : null,
        actualProfit: data.actualSellPrice ? (parseFloat(data.actualSellPrice) * 0.87) - parseFloat(data.bynogameBuyPrice) : null,
        currency: data.currency,
        date: data.date,
        notes: data.notes || '',
        workspaceType: 1
      };
    } else {
      // Workspace 2: Steam to CSF trading
      const quantity = parseFloat(data.quantity);
      const steamBuyPrice = parseFloat(data.steamBuyPrice);
      const estimatedCSFSellPrice = parseFloat(data.estimatedCSFSellPrice);
      const actualSellPrice = data.actualSellPrice ? parseFloat(data.actualSellPrice) : null;
      
      transaction = {
        id: 'trans_' + Date.now(),
        quantity: quantity,
        itemName: data.itemName,
        steamBuyPrice: steamBuyPrice,
        estimatedCSFSellPrice: estimatedCSFSellPrice,
        targetProfit: estimatedCSFSellPrice - steamBuyPrice,
        actualSellPrice: actualSellPrice,
        actualProfit: actualSellPrice ? actualSellPrice - steamBuyPrice : null,
        currency: data.currency,
        date: data.date,
        notes: data.notes || '',
        workspaceType: 2
      };
    }

    setAppData(prev => ({
      ...prev,
      periods: prev.periods.map(p =>
        p.id === prev.activePeriodId
          ? { ...p, transactions: [...p.transactions, transaction] }
          : p
      )
    }));
    return transaction;
  };

  const editTransaction = (id, data) => {
    setAppData(prev => ({
      ...prev,
      periods: prev.periods.map(p =>
        p.id === prev.activePeriodId
          ? {
              ...p,
              transactions: p.transactions.map(t =>
                t.id === id
                  ? {
                      ...t,
                      itemName: data.itemName,
                      dollarRate: parseFloat(data.dollarRate),
                      bynogameBuyPrice: parseFloat(data.bynogameBuyPrice),
                      estimatedSteamPrice: parseFloat(data.estimatedSteamPrice),
                      estimatedSteamNet: parseFloat(data.estimatedSteamPrice) * 0.87,
                      targetProfit: (parseFloat(data.estimatedSteamPrice) * 0.87) - parseFloat(data.bynogameBuyPrice),
                      actualSellPrice: data.actualSellPrice ? parseFloat(data.actualSellPrice) : null,
                      actualSellNet: data.actualSellPrice ? parseFloat(data.actualSellPrice) * 0.87 : null,
                      actualProfit: data.actualSellPrice ? (parseFloat(data.actualSellPrice) * 0.87) - parseFloat(data.bynogameBuyPrice) : null,
                      currency: data.currency,
                      date: data.date,
                      notes: data.notes || ''
                    }
                  : t
              )
            }
          : p
      )
    }));
  };

  const deleteTransaction = (id) => {
    setAppData(prev => ({
      ...prev,
      periods: prev.periods.map(p =>
        p.id === prev.activePeriodId
          ? { ...p, transactions: p.transactions.filter(t => t.id !== id) }
          : p
      )
    }));
  };

  const calculateStats = (periodId) => {
    const period = appData.periods.find(p => p.id === periodId);
    if (!period) return null;

    const transactions = period.transactions;
    const stats = {
      totalBuy: 0,
      totalSell: 0,
      totalProfit: 0,
      transactionCount: transactions.length,
      mostProfitable: null,
      leastProfitable: null
    };

    if (activeWorkspace === 1) {
      // Workspace 1: Bynogame trading (ESKİ MANTIK)
      transactions.forEach(t => {
        stats.totalBuy += t.bynogameBuyPrice || 0;
        const profit = t.actualProfit !== null ? t.actualProfit : t.targetProfit || 0;
        stats.totalSell += (t.actualProfit !== null ? t.actualSellNet : t.estimatedSteamNet) || 0;

        if (!stats.mostProfitable || profit > (stats.mostProfitable.actualProfit !== null ? stats.mostProfitable.actualProfit : stats.mostProfitable.targetProfit || 0)) {
          stats.mostProfitable = t;
        }
        if (!stats.leastProfitable || profit < (stats.leastProfitable.actualProfit !== null ? stats.leastProfitable.actualProfit : stats.leastProfitable.targetProfit || 0)) {
          stats.leastProfitable = t;
        }
      });
    } else {
      // Workspace 2: Steam to CSF trading (YENİ MANTIK)
      transactions.forEach(t => {
        const quantity = t.quantity || 1;
        const steamBuyPrice = t.steamBuyPrice || 0;
        const estimatedCSFSellPrice = t.estimatedCSFSellPrice || 0;
        const actualSellPrice = t.actualSellPrice;
        
        const buyAmount = steamBuyPrice * quantity;
        const estimatedSellAmount = estimatedCSFSellPrice * quantity;
        const actualSellAmount = actualSellPrice !== null ? actualSellPrice * quantity : null;
        
        stats.totalBuy += buyAmount;
        stats.totalSell += actualSellAmount !== null ? actualSellAmount : estimatedSellAmount;
        
        const profit = actualSellAmount !== null 
          ? (actualSellAmount - buyAmount) 
          : (estimatedSellAmount - buyAmount);

        if (!stats.mostProfitable || profit > (stats.mostProfitable._calculatedProfit || 0)) {
          stats.mostProfitable = { ...t, _calculatedProfit: profit };
        }
        if (!stats.leastProfitable || profit < (stats.leastProfitable._calculatedProfit || 0)) {
          stats.leastProfitable = { ...t, _calculatedProfit: profit };
        }
      });
    }

    stats.totalProfit = stats.totalSell - stats.totalBuy;
    return stats;
  };

  const createSampleData = () => {
    const period1 = {
      id: 'period_' + Date.now(),
      name: 'Ocak 2024',
      createdDate: '2024-01-01',
      transactions: [
        {
          id: 'trans_1',
          itemName: 'AK-47 | Redline',
          dollarRate: 34.50,
          bynogameBuyPrice: 150.00,
          estimatedSteamPrice: 200.00,
          estimatedSteamNet: 174.00,
          targetProfit: 24.00,
          actualSellPrice: 210.00,
          actualSellNet: 182.70,
          actualProfit: 32.70,
          currency: 'TL',
          date: '2024-01-15',
          notes: 'Steam Market\'ten alındı'
        },
        {
          id: 'trans_2',
          itemName: 'AWP | Asiimov',
          dollarRate: 34.50,
          bynogameBuyPrice: 500.00,
          estimatedSteamPrice: 550.00,
          estimatedSteamNet: 478.50,
          targetProfit: -21.50,
          actualSellPrice: null,
          actualSellNet: null,
          actualProfit: null,
          currency: 'TL',
          date: '2024-01-18',
          notes: 'Henüz satılmadı'
        },
        {
          id: 'trans_3',
          itemName: 'M4A4 | Howl',
          dollarRate: 34.50,
          bynogameBuyPrice: 5000.00,
          estimatedSteamPrice: 6000.00,
          estimatedSteamNet: 5220.00,
          targetProfit: 220.00,
          actualSellPrice: 6200.00,
          actualSellNet: 5394.00,
          actualProfit: 394.00,
          currency: 'TL',
          date: '2024-01-20',
          notes: 'Hızlı satış'
        }
      ]
    };

    const period2 = {
      id: 'period_' + (Date.now() + 1),
      name: 'Şubat 2024',
      createdDate: '2024-02-01',
      transactions: [
        {
          id: 'trans_4',
          itemName: 'Karambit | Fade',
          dollarRate: 34.60,
          bynogameBuyPrice: 15000.00,
          estimatedSteamPrice: 18000.00,
          estimatedSteamNet: 15660.00,
          targetProfit: 660.00,
          actualSellPrice: 18500.00,
          actualSellNet: 16095.00,
          actualProfit: 1095.00,
          currency: 'TL',
          date: '2024-02-05',
          notes: 'Yüksek talep dönemi'
        },
        {
          id: 'trans_5',
          itemName: 'Glock-18 | Fade',
          dollarRate: 34.60,
          bynogameBuyPrice: 8000.00,
          estimatedSteamPrice: 9000.00,
          estimatedSteamNet: 7830.00,
          targetProfit: -170.00,
          actualSellPrice: null,
          actualSellNet: null,
          actualProfit: null,
          currency: 'TL',
          date: '2024-02-12',
          notes: 'Henüz satılmadı'
        }
      ]
    };

    setAppData({
      periods: [period1, period2],
      activePeriodId: period1.id
    });
  };

  const value = {
    appData,
    currentSort,
    setCurrentSort,
    createPeriod,
    switchPeriod,
    deletePeriod,
    addTransaction,
    editTransaction,
    deleteTransaction,
    calculateStats,
    activeWorkspace,
    switchWorkspace
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
