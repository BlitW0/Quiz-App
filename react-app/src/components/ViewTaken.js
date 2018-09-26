import React, { Component } from 'react';
import './ViewPeople.css';
import Home from './Home';

import { BrowserRouter as Route, Redirect } from 'react-router-dom';

class ViewTaken extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      no_data: false,
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/gettaken/' + localStorage.getItem("username"));
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
    } else if (type == 0) {

      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">View All Quizzes Taken</h1>
          </header>

          <div className="container">
            <br/>
            
            {
              this.state.no_data == false ?
              <table className="table-hover">
                <thead>
                  <tr>
                    <th>Quiz Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>{this.state.data.map(function(item, key) {
                    return (
                        <tr key = {key}>
                            <td>{item.Name}</td>
                            <td>{item.Score}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
              :
              <h2>No Quizzes Taken</h2>
            }
          </div>
          <br/><br/>
        
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

export default ViewTaken;
