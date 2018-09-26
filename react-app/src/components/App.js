import React, { Component } from 'react';
import Home from './Home';
import NewUser from './NewUser';
import Login from './Login';
import ViewUsers from './ViewUsers';
import DeleteUser from './DeleteUser';
import ViewQuizzes from './ViewQuizzes';
import DeleteQuiz from './DeleteQuiz';
import NewQuiz from './NewQuiz';
import ModifyQuiz from './ModifyQuiz';
import CreateQuestion from './CreateQuestion';
import TakeQuiz from './TakeQuiz';
import ViewTaken from './ViewTaken';

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
                  {
                    "username" in localStorage ?

                    localStorage.getItem("type") == 1 ?
                      <ul className="nav navbar-nav navbar-right">
                        <li><Link to={'/NewQuiz'}>Create Quiz</Link></li>
                        <li><Link to={'/ModifyQuiz'}>Modify Quiz</Link></li>
                        <li><Link to={'/DeleteQuiz'}>Delete Quiz</Link></li>
                        <li><Link to={'/ViewQuizzes'}>View Quizzes</Link></li>
                        <li><Link to={'/DeleteUser'}>Delete User</Link></li>
                        <li><Link to={'/ViewUsers'}>View Users</Link></li>
                        <li><Link to={'/'}>{localStorage.getItem("username")}</Link></li>
                        <li><Link to={'/'} onClick={this.Logout}>Logout</Link></li>
                      </ul>
                    :
                      <ul className="nav navbar-nav navbar-right">
                        <li><Link to={'/TakeQuiz'}>Take a Quiz</Link></li>
                        <li><Link to={'/ViewTaken'}>Previous Results</Link></li>
                        <li><Link to ={'/'}>{localStorage.getItem("username")}</Link></li>
                        <li><Link to={'/'} onClick={this.Logout}>Logout</Link></li>
                      </ul>

                    :
                    
                    <ul className="nav navbar-nav">
                      <li><Link to={'/NewUser'}>Sign Up</Link></li>
                      <li><Link to={'/Login'}>Login</Link></li>
                    </ul>
                  }
              </div>
            </nav>
            <Switch>
                 <Route exact path='/' component={Home} />

                 <Route exact path='/NewUser' component={NewUser}/>
                 <Route exact path='/Login' component={Login}/>
                 <Route exact path='/ViewUsers' component={ViewUsers}/>
                 <Route exact path='/DeleteUser' component={DeleteUser}/>
                 <Route exact path='/ViewQuizzes' component={ViewQuizzes}/>
                 <Route exact path='/DeleteQuiz' component={DeleteQuiz}/>
                 <Route exact path='/NewQuiz'component={NewQuiz}/>
                 <Route exact path='/ModifyQuiz' component={ModifyQuiz}/>
                 <Route exact path='/ModifyQuiz/:id/1' component={CreateQuestion}/>
                 <Route exact path='/TakeQuiz/' component={TakeQuiz}/>
                 <Route exact path='/TakeQuiz/:id' component={TakeQuiz}/>
                 <Route exact path='/ViewTaken' component={ViewTaken}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
