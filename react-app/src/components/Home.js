import React, { Component } from 'react';
import './Home.css'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Quiz App</h1>
        </header>
        <div>
          {
            !("username" in localStorage) && 
            <h4>
              <br/>
              Please login to continue.
              <br/>
              If you do not have an account you can sign up.
            </h4>
          }
        </div>
      </div>
    );
  }
}

export default Home;
