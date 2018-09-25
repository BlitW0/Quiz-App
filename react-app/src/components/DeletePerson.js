import React, { Component } from 'react';
import './DeletePerson.css';

class DeletePerson extends Component {
  constructor() {
    super();
    this.state = {
      del_id: {
        id: 0,
      },
      data: [],
      submitted: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/people/');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/people/' + this.state.del_id['id'], {
     method: 'DELETE',
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300){
          this.setState({submitted: true});
        }
      });
  }

  handleChange(event) {
    this.state.del_id['id'] = event.target.value;
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Delete a Person</h1>
        </header>

        <form onSubmit={this.handleSubmit}>
          <table className="table-hover">
            <thead>
              <tr>
                <th>Select</th>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>{this.state.data.map((item, key) =>
                  <tr key = {key}>
                      <td><input type = "radio" value = {item.id} onChange = {this.handleChange} 
                      name = "group name"
                      /></td>
                      <td>{item.id}</td>
                      <td>{item.firstname}</td>
                      <td>{item.lastname}</td>
                      <td>{item.city}</td>
                  </tr>
              )}
            </tbody>
        </table>
        <br></br>
        <button type="submit" className="btn btn-default">Submit</button>
       </form>
       <br></br>

      { this.state.submitted && this.state.del_id['id'] != 0 &&
        <div>
          <h2>
            Person deleted successfully.
          </h2>
            Refresh to see changes.
        </div>
      }

      </div>
    );
  }
}

export default DeletePerson;
