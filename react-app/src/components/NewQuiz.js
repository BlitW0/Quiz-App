import React, { Component } from 'react';
import './NewPerson.css';

class NewQuiz extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        name: "",
        genre: "",
      },

      exists: false,
      submitted: false,
    }
    this.handleFChange = this.handleFChange.bind(this);
    this.handleLChange = this.handleLChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    
    if (this.state.formData.name != "" && this.state.formData.genre != "") {

      fetch('http://localhost:8080/addquiz', {
        method: 'POST',
        body: JSON.stringify(this.state.formData),
      })
        .then(response => {
          if(response.status >= 200 && response.status < 300)
            this.setState({submitted: true, exists: false});
          else if (response.status == 350)
            this.setState({submitted: false, exists: true});
        });
    
    }
  }

  handleFChange(event) {
    this.state.formData.name = event.target.value;
  }
  handleLChange(event) {
    this.state.formData.genre = event.target.value;
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Create a New Quiz</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Quiz Name</label>
                <input type="text" className="form-control" value={this.state.name} onChange={this.handleFChange}/>
            </div>
            <div className="form-group">
                <label>Genre</label>
                <input type="text" className="form-control" value={this.state.genre} onChange={this.handleLChange}/>
            </div>
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {
          this.state.exists == true &&
          <div>
            <font color="red">
              Quiz already exists.
            </font>
          </div>
        }

        { 
          this.state.submitted == true &&
          <div>
            <h2>
              New quiz successfully added.
            </h2>
              Refresh to see the changes.
          </div>
        }

      </div>
    );
  }
}

export default NewQuiz;
