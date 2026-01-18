import React from 'react';
import { useApp } from '../context/AppContext';
import TransactionFormWorkspace1 from './TransactionFormWorkspace1';
import TransactionFormWorkspace2 from './TransactionFormWorkspace2';

const TransactionForm = () => {
  const { activeWorkspace } = useApp();

  if (activeWorkspace === 1) {
    return <TransactionFormWorkspace1 />;
  }

  return <TransactionFormWorkspace2 />;
};

export default TransactionForm;
