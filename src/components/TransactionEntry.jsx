import React, {useState} from 'react';
import api from '../api';

export default function TransactionEntry(){
  const [desc,setDesc] = useState('');
  const [amount,setAmount] = useState(0);
  const [debit,setDebit] = useState('');
  const [credit,setCredit] = useState('');
  const companyId = 1;

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post('/accounts/transactions', {
        company_id: companyId,
        description: desc,
        amount,
        debit_account_id: debit,
        credit_account_id: credit,
        recorded_by: 1
      });
      alert('transaction recorded');
    } catch (err) { console.error(err); alert('error'); }
  };

  return (
    <div className="card">
      <h2>Record Transaction</h2>
      <form onSubmit={submit}>
        <div className="form-row"><label>Description</label><input value={desc} onChange={e=>setDesc(e.target.value)} /></div>
        <div className="form-row"><label>Amount</label><input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} /></div>
        <div className="form-row"><label>Debit Account ID</label><input value={debit} onChange={e=>setDebit(e.target.value)} /></div>
        <div className="form-row"><label>Credit Account ID</label><input value={credit} onChange={e=>setCredit(e.target.value)} /></div>
        <button className="button">Record</button>
      </form>
    </div>
  );
}