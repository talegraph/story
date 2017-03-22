import * as d3 from 'd3';
import mapValues from 'lodash/mapValues';

class Graph {
  mapData(data, dimensions, dataKey) {
    return data.map(d => {
      const newDatum = mapValues(dimensions, (value, key) => {
        return d[value];
      });
      newDatum.id = d[dataKey];
      return newDatum;
    })
  }

  hasDimensions(dimensions, userDimensions) {
    return dimensions.every(dimension => {
      return userDimensions[dimension.attr] || dimension.optional;
    });
  }
}

class ScatterPlot extends Graph {
  constructor(svg) {
    super();
    this.width = svg.parentNode.clientWidth;
    this.height = 400;
    this.margin = 30;
    this.svg = d3.select(svg)
      .attr('width', this.width)
      .attr('height', this.height);
    this.xAxis = this.svg.append('g')
      .attr('class', 'xAxis');
    this.yAxis = this.svg.append('g')
      .attr('class', 'yAxis');
  }

  draw(storyPoint, options) {
    const {dimensions} = storyPoint;
    const data = this.mapData(storyPoint.data, dimensions, options.dataKey);

    if (this.hasDimensions(ScatterPlot.DIMENSIONS, dimensions)) {
      const getX = d => d.x;
      const getY = d => d.y;
      const getR = d => d.r;
      const getLabel = d => d.label;
      const getColor = d => d.color;

      const xMin = d3.min(data, getX);
      const xMax = d3.max(data, getX);

      const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([this.margin, this.width - this.margin]);

      const yMin = d3.min(data, getY);
      const yMax = d3.max(data, getY);

      const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([this.height - this.margin, this.margin]);

      const rMin = d3.min(data, getR);
      const rMax = d3.max(data, getR);

      const rScale = d3.scaleLinear()
        .domain([rMin, rMax])
        .range([10, 20]);

      const colorScale = d3.scaleOrdinal()
        .range(options.colors);

      this.xAxis.transition()
        .attr('transform', `translate(0, ${this.height - this.margin})`)
        .call(d3.axisBottom(xScale));

      this.yAxis.transition()
        .attr('transform', `translate(${this.margin}, 0)`)
        .call(d3.axisLeft(yScale));

      const circles = this.svg.selectAll('.circle')
        .data(data, d => {
          return d.id;
        });

      const exit = circles.exit();

      exit.select('circle')
        .transition()
        .attr('r', 0);

      if (dimensions.label) {
        exit.select('text')
          .transition()
          .attr('fill-opacity', 0);
      }

      exit.transition()
        .remove();

      const enter = circles.enter()
        .append('g')
        .attr('class', 'circle')
        .attr('transform', d => {
          const x = xScale(getX(d));
          const y = yScale(getY(d));
          return `translate(${x}, ${y})`
        });
      enter.append('circle')
        .attr('r', 0);

      enter.merge(circles)
        .attr('fill', d => {
          return dimensions.color ?
            colorScale(getColor(d)) :
            options.colors[0];
        })
        .transition()
        .attr('transform', d => {
          const x = xScale(getX(d));
          const y = yScale(getY(d));
          return `translate(${x}, ${y})`
        });

      enter.merge(circles)
        .select('circle')
        .transition()
        .attr('r', d => {
          return rScale(getR(d));
        });

      if (dimensions.label) {
        enter.append('text')
          .attr('font-size', 10)
          .style('fill', '#000')
          .text(d => getLabel(d));
      }
    }
  }
}

ScatterPlot.DIMENSIONS = [{
  attr: 'x',
  label: 'X'
}, {
  attr: 'y',
  label: 'Y'
}, {
  attr: 'r',
  label: 'Radius'
}, {
  attr: 'label',
  label: 'Label',
  optional: true
}, {
  attr: 'color',
  label: 'Color',
  optional: true
}];

ScatterPlot.OPTIONS = [{

}]

export default ScatterPlot;
