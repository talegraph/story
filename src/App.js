import React, { Component } from 'react';
import axios from 'axios';
import GraphContainer from './Graph.js';
import './App.css';

const data = [];

class App extends Component {

constructor(props){
  super(props);
  this.state = {
    index: 0
  };

  this.indexClick = this.indexClick.bind(this);
}

  componentDidMount() {
    axios.get('/story.json')
      .then(res => {

        this.setState({story: res.data});
      });
  }

  indexClick(index){
    this.setState({
      index: index
    });
    // console.log(res.data.options);
  }

  render() {
    const story = this.state.story;
    if (story) {
      const listStoryPoints = story.storyPoints.map((storyPoint, index) => {
        const goTo = () => this.indexClick(index);
        return <button onClick={goTo}>{storyPoint.title}</button>
      });
      const stoPo = story.storyPoints[this.state.index];
      return (
        <div className="App">
          <div className="left">
            <div className="buttons">
              {listStoryPoints}
            </div>
            <div className="graph">
              <GraphContainer
                storyPoint={stoPo} options={story.options} />
            </div>
            <div className="text">
              <h2>{stoPo.title}</h2>
              <p>{stoPo.description}</p>
            </div>
          </div>
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
