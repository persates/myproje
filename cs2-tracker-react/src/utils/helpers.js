export const getCurrencySymbol = (currency) => {
  const symbols = { 'TL': '₺', 'USD': '$', 'EUR': '€' };
  return symbols[currency] || currency;
};

export const formatCurrency = (amount, symbol) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${symbol}0.00`;
  }
  return `${symbol}${Number(amount).toFixed(2)}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('tr-TR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

export const sortTransactionArray = (transactions, field, direction) => {
  const sorted = [...transactions];
  
  sorted.sort((a, b) => {
    let aVal, bVal;
    
    switch(field) {
      case 'date':
        aVal = new Date(a.date);
        bVal = new Date(b.date);
        break;
      case 'profit':
        aVal = a.sellPrice - a.buyPrice;
        bVal = b.sellPrice - b.buyPrice;
        break;
      case 'item':
        aVal = a.itemName.toLowerCase();
        bVal = b.itemName.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};
