import React, { Component } from 'react';
import './DeletePerson.css';
import Home from './Home';

import { BrowserRouter as Route, Redirect } from 'react-router-dom';

class DeleteQuiz extends Component {
  constructor() {
    super();
    this.state = {
      del_id: {
        id: 0,
      },
      data: [],
      submitted: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/getquizzes');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/quiz/' + this.state.del_id['id'], {
     method: 'DELETE',
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300){
          this.setState({submitted: true});
        }
      });
  }

  handleChange(event) {
    this.state.del_id['id'] = event.target.value;
  }
  
  render() {

    let type = localStorage.getItem("type");

    if (type == null) {
      return (
        <div>
          <Redirect to={'/'}/>
          <Route exact path='/' component={Home} />
        </div>
      );
    } else if (type == 1) {

      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Delete a Quiz</h1>
          </header>

          <div className="container">
            <form onSubmit={this.handleSubmit}>
              <br/>
              <table className="table-hover">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Genre</th>
                  </tr>
                </thead>
                <tbody>{this.state.data.map((item, key) =>
                      <tr key = {key}>
                          <td>
                              <input type = "radio" value = {item.id} onChange = {this.handleChange} name = "group name"/>
                          </td>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.genre}</td>
                      </tr>
                  )}
                </tbody>
              </table>
              <br></br>
              <button type="submit" className="btn btn-default">Submit</button>
            </form>
            <br></br>
          </div>

        { this.state.submitted && this.state.del_id['id'] != 0 &&
          <div>
            <h2>
              Quiz deleted successfully.
            </h2>
              Refresh to see changes.
          </div>
        }

        </div>
      );

    } else {
      return (
        <div>
          <Redirect to={'/'}/>
          <Route exact path='/' component={Home} />
        </div>
      );
    }
  }
}

export default DeleteQuiz;
