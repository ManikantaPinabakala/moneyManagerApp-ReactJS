import {v4 as uuidv4} from 'uuid'

import {Component} from 'react'
import MoneyDetails from '../MoneyDetails'
import TransactionItem from '../TransactionItem'
import './index.css'

const transactionTypeOptions = [
  {
    optionId: 'INCOME',
    displayText: 'Income',
  },
  {
    optionId: 'EXPENSES',
    displayText: 'Expenses',
  },
]

class MoneyManager extends Component {
  state = {
    titleInput: '',
    amountInput: '',
    typeInput: 'INCOME',
    balance: 0,
    income: 0,
    expenses: 0,
    historyList: [],
  }

  onTitleChange = event => {
    this.setState({titleInput: event.target.value})
  }

  onAmountChange = event => {
    this.setState({amountInput: event.target.value})
  }

  onTypeChange = event => {
    this.setState({typeInput: event.target.value})
  }

  onTransactionAdd = event => {
    event.preventDefault()

    const {titleInput, amountInput, typeInput} = this.state

    if (titleInput !== '' && amountInput !== '') {
      const amount = parseInt(amountInput)
      const transactionType = transactionTypeOptions.find(
        eachTypeOption => eachTypeOption.optionId === typeInput,
      )

      const newTransactionInHistory = {
        id: uuidv4(),
        title: titleInput,
        amount,
        type: transactionType.displayText,
      }

      if (typeInput === 'INCOME') {
        this.setState(prevState => ({
          balance: prevState.balance + amount,
          income: prevState.income + amount,
          historyList: [...prevState.historyList, newTransactionInHistory],
          titleInput: '',
          amountInput: '',
          typeInput: 'INCOME',
        }))
      } else {
        this.setState(prevState => ({
          balance: prevState.balance - amount,
          expenses: prevState.expenses + amount,
          historyList: [...prevState.historyList, newTransactionInHistory],
          titleInput: '',
          amountInput: '',
          typeInput: 'INCOME',
        }))
      }
    }
  }

  onDeleteTransaction = transactionId => {
    const {historyList} = this.state
    const transactionToBeDeleted = historyList.find(
      eachTransaction => eachTransaction.id === transactionId,
    )
    const updatedHistoryList = historyList.filter(
      eachTransaction => eachTransaction.id !== transactionId,
    )

    if (transactionToBeDeleted.type === 'INCOME') {
      this.setState(prevState => ({
        balance: prevState.balance - transactionToBeDeleted.amount,
        income: prevState.income - transactionToBeDeleted.amount,
        historyList: updatedHistoryList,
      }))
    } else {
      this.setState(prevState => ({
        balance: prevState.balance + transactionToBeDeleted.amount,
        expenses: prevState.expenses - transactionToBeDeleted.amount,
        historyList: updatedHistoryList,
      }))
    }
  }

  render() {
    const {
      titleInput,
      amountInput,
      typeInput,
      balance,
      income,
      expenses,
      historyList,
    } = this.state

    return (
      <div className="bg-container">
        <div className="user-details-container">
          <h1 className="user-greeting">Hi, Richard</h1>
          <p className="welcome-text">
            Welcome back to your{' '}
            <span className="money-manager-text">Money Manager</span>
          </p>
        </div>
        <MoneyDetails balance={balance} income={income} expenses={expenses} />
        <div className="add-transaction-history-container">
          <div className="add-transaction-container">
            <h1 className="add-transaction-heading">Add Transaction</h1>
            <form className="form" onSubmit={this.onTransactionAdd}>
              <label htmlFor="titleInput" className="label-style">
                TITLE
              </label>
              <input
                type="text"
                placeholder="TITLE"
                id="titleInput"
                className="input-field"
                value={titleInput}
                onChange={this.onTitleChange}
              />
              <label htmlFor="amountInput" className="label-style">
                AMOUNT
              </label>
              <input
                type="text"
                placeholder="AMOUNT"
                id="amountInput"
                className="input-field"
                value={amountInput}
                onChange={this.onAmountChange}
              />
              <label htmlFor="transactionTypeInput" className="label-style">
                TYPE
              </label>
              <select
                className="input-field"
                onChange={this.onTypeChange}
                value={typeInput}
              >
                <option value={transactionTypeOptions[0].optionId}>
                  {transactionTypeOptions[0].displayText}
                </option>
                <option value={transactionTypeOptions[1].optionId}>
                  {transactionTypeOptions[1].displayText}
                </option>
              </select>
              <button type="submit" className="add-button">
                Add
              </button>
            </form>
          </div>
          <div className="history-container">
            <h1 className="history-heading">History</h1>
            <div className="table-labels-container">
              <p className="table-label label-1">Title</p>
              <p className="table-label label-2">Amount</p>
              <p className="table-label label-3">Type</p>
              <p className="table-label"> </p>
            </div>
            <ul className="transaction-list">
              {historyList.map(eachTransaction => (
                <TransactionItem
                  key={eachTransaction.id}
                  transactionDetails={eachTransaction}
                  onDeleteTransaction={this.onDeleteTransaction}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default MoneyManager
