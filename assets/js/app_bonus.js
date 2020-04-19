var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")    
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
    console.log("in xscale function"+chosenXAxis)
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) ,
      d3.max(stateData, d => d[chosenXAxis]) 
    ])
    .range([0, width]);

  return xLinearScale;

}
// function used for updating Y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
  console.log("in Yscale function"+chosenYAxis)
// create scales
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(stateData, d => d[chosenYAxis]) ,
    d3.max(stateData, d => d[chosenYAxis]) 
  ])
  .range([height,0]);

return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {
    console.log("renderCircles in :"+chosenXAxis)
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
//new circle text

function renderCircleText(textGroup, newXScale, newYScale, chosenXAxis,chosenYAxis) {
  console.log("renderCirclesText in :"+chosenXAxis)
  textGroup.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenXAxis]))
  .attr("y", d => newYScale(d[chosenYAxis]));

return textGroup;
}



// function used for updating circles group with new tooltip

function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

  var label;
  if (chosenXAxis === "poverty") {
    label = "In Poverty (%):";
  }
  else {
    label = "Age";
  }
  var ylabel;
  if (chosenYAxis === "healthcare") {
    ylabel = "Lacks Healthcare (%):";
  }
  else {
    ylabel = "Smokes (%):";
  }
    
 var toolTip = d3.tip()
    .attr("class", "tooltip")
    //.offset([80, -60])
    .offset([0, -0])
    .html(function(d) {
            return (`${d.abbr}<br>${label} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });

    console.log("in update too tip 2");
  circlesGroup.call(toolTip);
  console.log("in update too tip 3");
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(stateData, err) {
  if (err) throw err;

  //parse and cast the data
    //console.log(stateData);
    stateData.forEach(function(d){
        console.log("In the data function")
        d.poverty = parseInt(d.poverty);
        //console.log(d.poverty);
        //console.log(d.abbr);
        //other way to typcast
        //console.log(d.healthcare)
        d.healthcare = +d.healthcare;
        d.smokes = +d.smokes;
        d.age = +d.age;
        console.log(d.age);
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(stateData, chosenYAxis);
  //.domain([4,d3.max(stateData,d =>d.healthcare)])
  //.range([height,0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis =chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".15")
        //.text(function(d){return d.abbr;})
    .attr("class",function(d){return "stateCircle" + d.abbr;});

  var textGroup =chartGroup.selectAll("null")
    .data(stateData)    
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis])-5)
    .attr("y", d => yLinearScale(d[chosenYAxis])+5)
    .text(function(d){return d.abbr;})
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("stroke", "black")
    .attr("stroke-width", "1")
        
    //.attr("class", "stateTest");
    .attr("class",function(d){return "stateCircle" + d.abbr;});

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("poverty %");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

  // append y axis
  /*chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Healthcare");*/

    // Create group for  2 Y- axis labels
    var ylabelsGroup = chartGroup.append("g")
    

    var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -70)
    .attr("x",0- (margin.left -75))
    .attr("dy", "1em")
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",-70)
    .attr("x", 0 - (margin.left -50))
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%) ");


   //updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

  

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log("value :"+ value)
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates y axis with transition
        //yAxis = renderYAxes(yLinearScale, yAxis);
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale, chosenXAxis,chosenYAxis);

        //update text on the circle
        textGroup = renderCircleText(textGroup, xLinearScale,yLinearScale, chosenXAxis,chosenYAxis);


        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
        }
       
      }
    });



    // y axis labels event listener
  ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    console.log("value :"+ value)
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

       console.log(chosenYAxis)

      // functions here found above csv import
      // updates x scale for new data
      YLinearScale = yScale(stateData, chosenYAxis);

      // updates x axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates y axis with transition
      //yAxis = renderYAxes(yLinearScale, yAxis);
      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale, chosenXAxis,chosenYAxis);

      //update text on the circle
      textGroup = renderCircleText(textGroup, xLinearScale,yLinearScale, chosenXAxis,chosenYAxis);


      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

    
      // changes classes to change bold text y axis
      if (chosenYAxis === "healthcare") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
}).catch(function(error) {
  console.log(error);
});
