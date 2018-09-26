import React, { Component } from 'react';
import './DeletePerson.css';
import Home from './Home';

import { BrowserRouter as Route, Redirect } from 'react-router-dom';

class ModifyQuiz extends Component {
  constructor() {
    super();
    this.state = {
      quiz_id: 0,
      modify_type: 0,
      quizzes: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTChange = this.handleTChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/getquizzes');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({quizzes: data}));
  }

  handleSubmit (event) {
    event.preventDefault();
    if (this.state.quiz_id != 0 && this.state.modify_type != 0)
      this.props.history.push(`/ModifyQuiz/${this.state.quiz_id}/${this.state.modify_type}`);
  }

  handleChange(event) {
    this.state.quiz_id = event.target.value;
  }

  handleTChange(event) {
    this.state.modify_type = event.target.value;
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
            <h1 className="App-title">Modify Quiz Data</h1>
          </header>
        
          <form onSubmit={this.handleSubmit}>
            <div className="container">
            <br/>
              <div className="form-group">
                <label><h4>Select a quiz</h4></label>
                <select className="form-control" id="sel" onChange={this.handleChange}>
                  <option value={0}>Choose...</option>
                  {
                    this.state.quizzes.map((item, key) =>
                      <option value={item.id} key={key}>{item.name}</option>
                    )
                  }
                </select>
              </div>
              <div className="form-group">
                <input type="radio" value={1} onChange={this.handleTChange} name="group"/> &nbsp;
                <label><h5>Create a Question</h5></label>
                <br/>
                <input type="radio" value={2} onChange={this.handleTChange} name="group"/> &nbsp;
                <label><h5>Edit a Question</h5></label>
                <br/>
                <input type="radio" value={1} onChange={this.handleTChange} name="group"/> &nbsp;
                <label><h5>Delete a Question</h5></label>
              </div>

              <button type="submit" className="btn btn-default">Submit</button>
            </div>
        </form>

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

export default ModifyQuiz;
