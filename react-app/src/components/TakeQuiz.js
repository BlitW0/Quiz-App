import React, { Component } from 'react';
import './DeletePerson.css';
import Home from './Home';

import { BrowserRouter as Route, Redirect } from 'react-router-dom';

class TakeQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz_id: 0,
      quiz_data: {},
      quizzes: [],
      questions: [],
      options: [],
      truth: [false, false, false, false],
      q_index: 0,
      score: 0,
      over: false,
    }

    if ("id" in props.match.params) {
      const request2 = new Request('http://127.0.0.1:8080/getques/' + this.props.match.params.id);
      fetch(request2)
        .then(response => response.json())
          .then(data => {
            const request1 = new Request('http://127.0.0.1:8080/getoptions/' + data[0].ID);
            fetch(request1)
              .then(response => response.json())
                .then(data1 => this.setState({
                  questions: data,
                  options: data1
                }));
          });
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.uncheck = this.uncheck.bind(this);
  }

  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/getquizzes');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({quizzes: data}));

    if ("id" in this.props.match.params) {
      const request1 = new Request('http://127.0.0.1:8080/quiz/' + this.props.match.params.id);
      fetch(request1)
        .then(response => response.json())
          .then(data => this.setState({quiz_data: data}));
    }
  }

  handleSubmit (event) {
    event.preventDefault();
    if (this.state.quiz_id != 0) {
      this.props.history.push(`/TakeQuiz/${this.state.quiz_id}`);
      window.location.reload();
    } else {
      window.location.reload();
    }
  }

  handleSubmit1 (event) {
    event.preventDefault();

    let inc = 1;
    this.state.options.map((item, key) => {
        if (item.IsCorrect != this.state.truth[key])
          inc = 0;
      }
    );
    this.state.score += inc;

    this.state.truth = [false, false, false, false];
    if (this.state.q_index < this.state.questions.length - 1) {
      this.uncheck();
      const request1 = new Request('http://127.0.0.1:8080/getoptions/' + this.state.questions[this.state.q_index + 1].ID);
      fetch(request1)
        .then(response => response.json())
          .then(data1 => this.setState({
            options: data1,
            q_index: this.state.q_index + 1,
          }));
    } else {

      let sent = {Username: localStorage.getItem("username"), Qid: parseInt(this.props.match.params.id), Score: this.state.score}

      fetch('http://localhost:8080/addrec', {
        method: 'POST',
        body: JSON.stringify(sent),
      })
        .then(response => {
          if(response.status >= 200 && response.status < 300)
            this.props.history.push('/ViewTaken');
        });
    }
  }

  handleChange(event) {
    this.state.quiz_id = event.target.value;
  }

  uncheck() {
    var uncheck = document.getElementsByTagName('input');
    for(var i = 0; i < uncheck.length; i++)
      if(uncheck[i].type == 'checkbox')
        uncheck[i].checked = false;
  }

  
  render() {

    let type = localStorage.getItem("type");

    if (type != 0) {
      return (
        <div>
          <Redirect to={'/'}/>
          <Route exact path='/' component={Home} />
        </div>
      );
    } else if (type == 0) {

      if (this.props.match.params.id == undefined) {
      
        return (
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Choose a Quiz</h1>
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
                <button type="submit" className="btn btn-default">Submit</button>
              </div>
          </form>

          </div>
        );
      } else {

        return (
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">
                {this.state.quiz_data.name}
                &nbsp;&nbsp;&nbsp;
                Score: {this.state.score}
              </h1>
            </header>
              
            <div className="container">
            <br/>
              <form onSubmit={this.handleSubmit1}>
                {
                  this.state.questions[this.state.q_index] != undefined &&
                  <div>
                    <h2>
                      {this.state.questions[this.state.q_index].Body}
                    </h2>
                    <br/>
                  </div>
                }
                {
                  this.state.options.map((item, key) => 
                    <div key={key}>
                      <input type="checkbox" onChange={() => {
                        this.state.truth[key] = !this.state.truth[key];
                      }}/>&nbsp; &nbsp;
                      <label><h4>{item.Body}</h4></label>
                    </div>
                  )
                }
                <br/>
                <button type="submit" className="btn btn-default">Submit</button>
              </form>
            </div>
            <br/><br/>

            {
              this.state.no_resp == true &&
              <div>
                Please choose an option.
              </div>
            }

          </div>
        );
      }

    }
  }
}

export default TakeQuiz;
