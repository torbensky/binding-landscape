import * as d3 from "d3";

// Canvas setup
const canvasWidth = 960;
const canvasHeight = 480;

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

// Load the data file
var d = require('../data.csv')
d3.csv(d, (error, data) => {
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
    
    let curveFn = d3.line()
    .x((d) => {return d.x;})
    .y((d) => {return d.y;})
    .curve(d3.curveBasis);

    const curveWidth = 40;

    // Setup scale
    let minX = d3.min(data, function(d) { return +d['3utr'] });
    let maxX = d3.max(data, function(d) { return +d['3utr'] });
    let maxY = d3.max(data, function(d) { return +d['nrqavg'] });
    let xScale = d3.scaleLinear()
    .domain([0,maxX+40])
    .range([0,plotWidth]);

    let yScale = d3.scaleLinear()
    .domain([0,maxY])
    .range([plotHeight,0]);

    let curvePoints, x, y;
    for(d of data){
        // Calculate the points for our 3 point curve shape
        x = xScale(+d['3utr']);
        y = yScale(+d['nrqavg']);
        curvePoints = getCurvePoints(x, y, curveWidth, plotHeight);
        
        // Draw the curve using the 3 points
        plotGroup.append("path")
        .attr('d', curveFn(curvePoints))
        .attr("stroke", "purple")
        .attr("stroke-width", 1.5)
        .attr("fill", "none");

        // draw axis
        plotGroup.append("g")
        .call(d3.axisLeft(yScale))

        plotGroup.append("g")
        .attr("transform", "translate(0,"+plotHeight+")")
        .call(d3.axisBottom(xScale));
    }
}

function getCurvePoints(x,y,w,b){
    if( y < 20){
        console.log({
            x: x,
            y: y,
            w, w,
            b: b
        })
    }
    return [
        new Point(x-w,b),
        new Point(x,b-y),
        new Point(x+w,b)
    ];
}


class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}