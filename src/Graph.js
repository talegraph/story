import React from 'react';

import ScatterPlot from './graphs/ScatterPlot';

class GraphContainer extends React.Component {
  componentDidMount() {
    this.graph = new ScatterPlot(this.svg);
    this.graph.draw(this.props.storyPoint, this.props.options);
  }

  componentWillUpdate(nextProps) {
    this.graph.draw(nextProps.storyPoint, nextProps.options);
  }

  render() {
    return (
      <div>
        <svg ref={svg => this.svg = svg}/>
      </div>
    );
  }
}

export default GraphContainer;
