import React, { Component } from 'react';
import './NewPerson.css';
import './Home.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        username: "",
        password: "",
        type: 0,
      },
      not_found: false,
      pass_wrong: false,
      authenticated: false,
    }
    this.handleFChange = this.handleFChange.bind(this);
    this.handleLChange = this.handleLChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    
    if (this.state.formData.username !== "" && this.state.formData.password !== "") {

      console.log('http://localhost:8080/users/' + this.state.formData.username);
    
      fetch('http://localhost:8080/checkuser', {
        method: 'POST',
        body: JSON.stringify(this.state.formData),
      })
        .then(response => {
          console.log(response.status);
          if(response.status >= 200 && response.status < 300) {

            // Store username and type of user in local browser data
            localStorage.setItem("username", this.state.formData.username);
            localStorage.setItem("type", response.status == 205 ? 1 : 0);

            this.setState({authenticated: true, pass_wrong: false, not_found: false});

            // Redirect to Quizzes page
            this.props.history.push('/Quizzes');
            window.location.reload();

          } else if (response.status == 350)
            this.setState({authenticated: false, pass_wrong: true, not_found: false,});
          else
            this.setState({authenticated: false, not_found: true, pass_wrong: false,});
        });
    
    }
  }

  handleFChange(event) {
    this.state.formData.username = event.target.value;
  }
  handleLChange(event) {
    this.state.formData.password = event.target.value;
  }

  render() {

    
    // if (this.state.authenticated === true) {
    //   return (
    //     <div>
    //       <Redirect to='/Quizzes'/>
    //       <Route exact path='/Quizzes' Component={Quizzes}/>
    //     </div>
    //   );
    // }

    return (

      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Login</h1>
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
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>


        {
          this.state.pass_wrong === true &&
            <div>
              <br/>
              <font color="red">
                Wrong password entered.
              </font>
            </div>
        }

        {
          this.state.not_found === true &&
            <div>
              <br/>
              <font color="red">
                User not found.
              </font>
            </div>
        }

      </div>
      
    );
  }
}

export default Login;
