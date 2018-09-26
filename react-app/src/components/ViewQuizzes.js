import React, { Component } from 'react';
import './ViewPeople.css';
import Home from './Home';
import Quizzes from './Quizzes';

import { BrowserRouter as Route, Redirect } from 'react-router-dom';

class ViewQuizzes extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/getquizzes');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
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
            <h1 className="App-title">View All Quizzes</h1>
          </header>

          <div className="container">
            <br/>
            <table className="table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>{this.state.data.map(function(item, key) {
                  return (
                      <tr key = {key}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.genre}</td>
                      </tr>
                    )
                })}
              </tbody>
            </table>
          </div>
          <br/><br/>
        </div>
      );
    } else {
      return (
        <div>
          <Redirect to={'/Quizzes'}/>
          <Route exact path='/Quizzes' component={Quizzes} />
        </div>
      );
    }
  }
}

export default ViewQuizzes;
