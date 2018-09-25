import React, { Component } from 'react';
import DeletePerson from './DeletePerson';
import ViewPeople from './ViewPeople';
import EditPerson from './EditPerson';
import NewPerson from './NewPerson';
import Home from './Home';
import NewUser from './NewUser';
import Login from './Login';
import Quizzes from './Quizzes'


import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

class App extends Component {

  constructor(props) {
    super(props);
    this.Logout = this.Logout.bind(this);
  }

  Logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("type");
    window.location.reload();
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <Link className="navbar-brand" to={'/'}>Quiz App</Link>
                </div>
                {/* <ul className="nav navbar-nav"> */}
                  {/* <li><Link to={'/'}>Home</Link></li>
                  <li><Link to={'/NewPerson'}>Create Person</Link></li>
                  <li><Link to={'/EditPerson'}>Edit Person</Link></li>
                  <li><Link to={'/DeletePerson'}>Delete Person</Link></li>
                  <li><Link to={'/ViewPeople'}>View People</Link></li> */}
                  {
                    "username" in localStorage ?

                    <ul className="nav navbar-nav navbar-right">
                      <li><Link to={'/Quizzes'}>{localStorage.getItem("username")}</Link></li>
                      <li><Link to={'/'} onClick={this.Logout}>Logout</Link></li>
                    </ul>

                    :
                    
                    <ul className="nav navbar-nav">
                      <li><Link to={'/NewUser'}>Sign Up</Link></li>
                      <li><Link to={'/Login'}>Login</Link></li>
                    </ul>
                  }
                {/* </ul> */}
              </div>
            </nav>
            <Switch>
                 <Route exact path='/' component={Home} />
                 {/* <Route exact path='/NewPerson' component={NewPerson} />
                 <Route exact path='/EditPerson' component={EditPerson} />
                 <Route exact path='/DeletePerson' component={DeletePerson} />
                 <Route exact path='/ViewPeople' component={ViewPeople} /> */}

                 <Route exact path='/NewUser' component={NewUser}/>
                 <Route exact path='/Login' component={Login}/>
                 <Route exact path='/Quizzes' component={Quizzes}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
