import * as d3 from "d3";

// Canvas setup
const canvasWidth = 960;
const canvasHeight = 580;

const svg = d3.select('body')
    .append('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);

// Draw chart

let margins = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};

// Process the data file
var d = require('../data.csv')
function type(d) {
    return {
        x: +d['3utr'],
        y: +d['nrqavg'],
        mirna: d['mirna']
    }
}
d3.csv(d, type, (error, data) => {
    if (error) {
        console.error(error);
    } else {
        drawPlot(data);
    }
})

function drawPlot(data){
    let plotGroup = svg.append('g')
    .classed('plot', true)
    .attr('transform', `translate(${margins.left},${margins.top})`);
    
    let plotWidth = canvasWidth - margins.left - margins.right;
    let plotHeight = canvasHeight - margins.top - margins.bottom;    

    const curveWidth = 40;

    // Setup scale
    let minX = d3.min(data, d => d.x);
    let maxX = d3.max(data, d => d.x);
    let maxY = d3.max(data, d => d.y);
    // console.log({
    //     minX: minX,
    //     maxX: maxX,
    //     maxY: maxY
    // })
    let xScale = d3.scaleLinear()
    .domain([0,maxX+40])
    .range([0,plotWidth]);

    let yScale = d3.scaleLinear()
    .domain([0,maxY])
    .range([plotHeight,0]);
    
    // draw axis
    plotGroup.append("g")
    .call(d3.axisLeft(yScale))
    
    plotGroup.append("g")
    .attr("transform", "translate(0,"+plotHeight+")")
    .call(d3.axisBottom(xScale).ticks(20));
    
    // Calculate curve data
    const getCurvePoints = (x,y,w) => {
        // console.log({
            //     scaleX: xScale(x),
            //     scaleY: yScale(y),
            //     scale0: yScale(0),
            // })
            // console.log({ x, y, w })
            return [
                {x: x-w, y: 0},
                {x: x, y:y},
                {x: x+w, y:0}
        ];
    }
    data = data.map(d => getCurvePoints(d.x, d.y, curveWidth))
    // console.log(data)
    
    // draw curves
    let curveFn = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveCardinal);
    let colorFn = d3.scaleOrdinal().range(d3.schemeCategory20c)
    let curveGroup = plotGroup.append("g");
    let curves = curveGroup.selectAll('path').data(data);
    curves.enter().append("path")
    .attr("fill", d => colorFn(d.mirna))
    .attr("fill-opacity", "0.3")
    .attr('d', curveFn);

    curves.exit().remove();
}


class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}