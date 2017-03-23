import React, { Component } from 'react';
import axios from 'axios';
import GraphPub from './GraphPub';
import './App.css';

const data = [];

class App extends Component {
constructor(props){
  super(props);
  this.state = {
    index: 0
  };
}
componentDidMount() {
  axios.get('/story.json')
    .then(res => {
      this.setState({story: res.data});
    });
}
render() {
    const story = this.state.story;
    if (story) {
      return (
        <div className="App">
          <GraphPub
            story={story} />
          <div className="right">
            <div className="story">
              <h2>{story.title}</h2>
              <p>{story.description}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Loading story</div>
    }
  }
}

export default App;
