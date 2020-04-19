//set up chart
var svgWidth =900;
var svgHeight=600;

var margin ={
    top:20,
    right:40,
    bottom:60,
    left:50
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight -margin.top -margin.bottom;

//create a svg wrapper
//append an svg groupthat will hold the chart

var svg =d3
    .select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight);

var chartGroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

//Import the data

d3.csv("assets/data/data.csv").then(function(stateData){
    //parse and cast the data
    //console.log(stateData);
    stateData.forEach(function(d){
    //console.log(d.poverty)
    d.poverty = parseInt(d.poverty);
    console.log(d.poverty);
    console.log(d.abbr);
    //other way to typcast
    //console.log(d.healthcare)
    d.healthcare = +d.healthcare;
    console.log(d.healthcare);
    });


//create scales functions

var myXLinearScale = d3.scaleLinear()
    .domain([7.5,d3.max(stateData, d=> d.poverty)])
    .range([0,width]);

var myYLinearScale = d3.scaleLinear()
    .domain([4,d3.max(stateData,d =>d.healthcare)])
    .range([height,0]);
    
//create axis functions

var bottomAxis = d3.axisBottom(myXLinearScale).ticks(8);
var leftAxis = d3.axisLeft(myYLinearScale);

//Append asix to the chart
chartGroup.append("g")
    .attr("transform",`translate(0,${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);    

//create circle

var circleGroup =chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => myXLinearScale(d.poverty))
    .attr("cy", d => myYLinearScale(d.healthcare))
    .attr("r",15)
    .attr("fill","blue")
    .attr("opacity",".1")
    .text(function(d){return d.abbr;});

console.log("I am here****************")
var elemEnter =chartGroup.selectAll("null")
    .data(stateData)    
    .enter()
    .append("text")
    .attr("x", d => (myXLinearScale(d.poverty)-6))
    .attr("y", d => (myYLinearScale(d.healthcare)+2))
    .text(function(d){return d.abbr;})
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "red");
    
    console.log("I am here==========================")
//create  axes lables
chartGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("y",  - margin.left)
    .attr("x", 0 -(height/2))
    .attr("dy", "1em")
    .attr("class","axisText")
    .text("Lacks Healthcare(%)");

chartGroup.append("text")
    .attr("transform",`translate(${width /2},${height + margin.top +30})`)
    .attr("class","axisText")
    .text("In Poverty (%)");    


}).catch(function(error) {
    console.log(error);
  });


  