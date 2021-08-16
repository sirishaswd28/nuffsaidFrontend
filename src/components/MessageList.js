import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Api from '../api'
import '../app.css';

class MessageList extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      messages: [],
      type1Count: 0,
      type2Count: 0,
      type3Count: 0
    }
  }

  api = new Api({
    messageCallback: (message) => {
      this.messageCallback(message)
    },
  })

  componentDidMount() {
    this.api.start()
  }

  messageCallback(message) {
    const { messages } = this.state;
    this.setState({
      messages: [...messages.slice(), message]
    }, () => {
      // Included to support initial direction. Please remove upon completion
      // console.log(messages)
    })
  }

  arrangeTypesInRow(messages) {
    if (!messages || messages.length === 0) {
      return [];
    }
    const arr = [];
    const col1 = [];
    const col2 = [];
    const col3 = [];
    for (let i = 0; i < messages.length; i++) {
      const item = messages[i];
      const ar = item.priority === 1 ? col1 : item.priority === 2 ? col2 : col3;
      ar.push(item);
    }
    const max = col1.length > col2.length ? (col1.length > col3.length ? col1.length : col3.length) : (col2.length > col3.length ? col2.length : col3.length);
    for (let i = 0; i < max; i++) {
      const row = [];
      row.push(col1[i] ? col1[i] : null);
      row.push(col2[i] ? col2[i] : null);
      row.push(col3[i] ? col3[i] : null);
      arr.push(row);
    }
    return arr;
  }



  renderButton() {
    const isApiStarted = this.api.isStarted()
    return (
      <div className="btn-div">
        <Button
          variant="contained" color={isApiStarted ? 'secondary' : 'primary'}
          onClick={() => {
            if (isApiStarted) {
              this.api.stop()
            } else {
              this.api.start()
            }
            this.forceUpdate()
          }}
        >
          {isApiStarted ? 'Stop' : 'Start'}
        </Button>
        <Button variant="contained" onClick={() => { this.btnClearMsgClck() }}>Clear</Button>
      </div >
    )
  }

  renderRows(rows) {
    if (!rows || rows.length === 0) {
      return [];
    }
    return <tbody>
      {
        rows.map((el, i) => <tr key={'el' + i}>
          {
            el.map((td, j) => td ?
              <td key={'td' + j}>
                <div className="td-div">
                  <p className="p-msg">{td.message}</p>
                  <div className="btn-clear">
                    <span onClick={() => { this.btnClearSpecific(td) }}>Clear </span>
                  </div>
                </div>
              </td> : <td key={'td' + j}></td>)
          }
        </tr>)
      }
    </tbody>
  }

  countTypes(rows) {
    let c1 = 0;
    let c2 = 0;
    let c3 = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j]) {
          row[j].priority === 1 ? c1++ : row[j].priority === 2 ? c2++ : c3++;
        }
      }
    }
    return { c1, c2, c3 };
  }

  btnClearMsgClck() {
    this.setState({ messages: [] });
  }

  btnClearSpecific(td) {
    const msgs = this.state.messages;
    if (!td) {
      return;
    }
    const index = msgs.findIndex(el => el.message === td.message && el.priority == td.priority);
    if (index > -1) {
      msgs.splice(index, 1);
    }
    this.setState({ messages: msgs });
  }

  render() {
    const rows = this.arrangeTypesInRow(this.state.messages);
    const counts = this.countTypes(rows);
    return (
      <div>
        {this.renderButton()}
        <table>
          <tr>
            <th><div>
              <h2>Error Type 1</h2>
              <strong>Count {counts.c1}</strong>
            </div></th>
            <th><div>
              <h2>Warning Type 2</h2>
              <strong>Count {counts.c2}</strong>
            </div></th>
            <th><div>
              <h2>Info Type 3</h2>
              <strong>Count {counts.c3}</strong>
            </div></th>
          </tr>
          {this.renderRows(rows)}
        </table>
      </div>
    )
  }
}

export default MessageList
