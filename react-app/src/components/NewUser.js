import React, { Component } from 'react';
import './NewPerson.css';
import Login from './Login';

import { BrowserRouter as Route, Redirect } from 'react-router-dom';

class NewUser extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        username: "",
        password: "",
        type: 0,
      },

      username_exists: false,
      pass_not_match: false,
      retyped: "",
      submitted: false,
    }

    this.handleFChange = this.handleFChange.bind(this);
    this.handleLChange = this.handleLChange.bind(this);
    this.handleCChange = this.handleCChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    
    if (this.state.formData.username !== "" && this.state.formData.password !== "") {
    
      if (this.state.formData.password === this.state.retyped) {
        fetch('http://localhost:8080/users', {
          method: 'POST',
          body: JSON.stringify(this.state.formData),
        })
          .then(response => {
            if(response.status >= 200 && response.status < 300)
              this.setState({
                submitted: true,
                pass_not_match: false,
                username_exists: false,
              });
            else if (response.status === 350)
              this.setState({
                submitted: false,
                pass_not_match: false,
                username_exists: true,
              });
          });
      } else {
        this.setState({
          submitted: false,
          pass_not_match: true,
          username_exists: false,
        })
      }
    
    }
  }

  handleFChange(event) {
    this.state.formData.username = event.target.value;
  }
  handleLChange(event) {
    this.state.formData.password = event.target.value;
  }
  handleCChange(event) {
    this.state.retyped = event.target.value;
  }

  render() {

    if (this.state.submitted === true) {
      return (
        <div>
          <Redirect to='/Login'/>
          <Route exact path='/Login' component={Login}/>
        </div>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Sign Up</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" value={this.state.username} onChange={this.handleFChange}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={this.state.password} onChange={this.handleLChange}/>
            </div>
            <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" className="form-control" value={this.retyped} onChange={this.handleCChange}/>
            </div>
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {
          this.state.username_exists === true &&
          <div>
            <br/>
            <font color="red">
              Username taken.
            </font>
          </div>
        }


        {
          this.state.pass_not_match === true &&
          <div>
            <br/>
            <font color="red">
              Passwords do not match.
            </font>
          </div>
        }

      </div>
    );
  }
}

export default NewUser;
