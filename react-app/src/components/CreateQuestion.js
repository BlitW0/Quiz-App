import React, { Component } from 'react';
import './NewPerson.css';

class CreateQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        qid: 0,
        quesbody: "",
        op1: "", c1: false,
        op2: "", c2: false,
        op3: "", c3: false,
        op4: "", c4: false,
      },

      qdata: {},
      ques_exists: false,
      submitted: false,
    }
    this.handleFChange = this.handleFChange.bind(this);
    this.handleO1Change = this.handleO1Change.bind(this);
    this.handleO2Change = this.handleO2Change.bind(this);
    this.handleO3Change = this.handleO3Change.bind(this);
    this.handleO4Change = this.handleO4Change.bind(this);
    this.handleC1Change = this.handleC1Change.bind(this);
    this.handleC2Change = this.handleC2Change.bind(this);
    this.handleC3Change = this.handleC3Change.bind(this);
    this.handleC4Change = this.handleC4Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/quiz/' + this.props.match.params.id);
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({qdata: data}));
  }

  handleSubmit (event) {
    event.preventDefault();


    if (this.state.formData.op1 != "" && this.state.formData.op2 != "" && this.state.formData.op3 != "" && this.state.formData.op4 != "") {
      if (this.state.formData.question_body != "" && (this.state.formData.c1 == true || this.state.formData.c2 == true || this.state.formData.c3 == true || this.state.formData.c4 == true)) {


        

        this.state.formData.qid = parseInt(this.props.match.params.id);

        fetch('http://localhost:8080/addques', {
          method: 'POST',
          body: JSON.stringify(this.state.formData),
        })
          .then(response => {
            if(response.status >= 200 && response.status < 300)
              this.setState({submitted: true, ques_exists: false});
            else if (response.status == 350)
              this.setState({submitted: false, ques_exists: true});
          });
        
      }
    
    }
  }

  handleFChange(event) {
    this.state.formData.quesbody = event.target.value;
  }

  handleO1Change(event) {
    this.state.formData.op1 = event.target.value;
  }
  handleO2Change(event) {
    this.state.formData.op2 = event.target.value;
  }
  handleO3Change(event) {
    this.state.formData.op3 = event.target.value;
  }
  handleO4Change(event) {
    this.state.formData.op4 = event.target.value;
  }

  handleC1Change() {
    this.state.formData.c1 = !this.state.formData.c1;
  }
  handleC2Change() {
    this.state.formData.c2 = !this.state.formData.c2;
  }
  handleC3Change() {
    this.state.formData.c3 = !this.state.formData.c3;
  }
  handleC4Change() {
    this.state.formData.c4 = !this.state.formData.c4;
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Create new question for quiz '{this.state.qdata.name}'</h1>
        </header>
        <br/><br/>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Question</label>
                <input type="text" className="form-control" value={this.state.question_body} onChange={this.handleFChange}/>
            </div>
            <div className="form-group">
                <label>Option 1</label>
                <input type="text" className="form-control" value={this.state.op1} onChange={this.handleO1Change}/>
                <label>Is Option 1 correct?&nbsp; &nbsp;<input type="checkbox" onChange={this.handleC1Change} /></label>
            </div>
            <div className="form-group">
                <label>Option 2</label>
                <input type="text" className="form-control" value={this.state.op2} onChange={this.handleO2Change}/>
                <label>Is Option 2 correct?&nbsp; &nbsp;<input type="checkbox" onChange={this.handleC2Change} /></label>
            </div>
            <div className="form-group">
                <label>Option 3</label>
                <input type="text" className="form-control" value={this.state.op3} onChange={this.handleO3Change}/>
                <label>Is Option 3 correct?&nbsp; &nbsp;<input type="checkbox" onChange={this.handleC3Change} /></label>
            </div>
            <div className="form-group">
                <label>Option 4</label>
                <input type="text" className="form-control" value={this.state.op4} onChange={this.handleO4Change}/>
                <label>Is Option 4 correct?&nbsp; &nbsp;<input type="checkbox" onChange={this.handleC4Change} /></label>
            </div>
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted == true &&
          <div>
            <h2>
              New question added successfully.
            </h2>
          </div>
        }

        <br/><br/><br/>

      </div>
    );
  }
}

export default CreateQuestion;
