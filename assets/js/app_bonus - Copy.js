//set up chart
var svgWidth =900;
var svgHeight=800;

var margin ={
    top:20,
    right:40,
    bottom:100,
    left:100
};

var yvariable="y";
var xvariable="poverty";

var width = svgWidth - margin.right - margin.left;
var height = svgHeight -margin.top -margin.bottom;

//create a svg wrapper
//append an svg groupthat will hold the chart
function asixValue(aline,aline_value){
    if(aline="y")
       { yvariable=aline_value;
        console.log(yvariable);   }
    else
       { xvariable=aline_value;
        console.log(xvariable);}
 console.log("clicked-------");         
 console.log(aline_value);     
}


var svg =d3
    .select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight);

var chartGroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

//Import the data

d3.csv("assets/data/data.csv").then(function(stateData){
    //parse and cast the data

    stateData.forEach(function(d){   
    
        d.poverty = parseInt(d.poverty);
        d.healthcare = +d.healthcare;
        d.obesity = +d.obesity;
        d.age = +d.age;
        d.income =+d.income;
        d.smokes=+d.smokes;
        d.healthcare =+d.healthcare;
        console.log(d.healthcare);

    });


//create scales functions

var povertyXLinearScale = d3.scaleLinear()
    .domain([8,d3.max(stateData, d=> d.poverty)])
    .range([0,width]);

var healthcareYLinearScale = d3.scaleLinear()
    .domain([4,d3.max(stateData,d =>d.healthcare)])
    .range([height,0]);
    
//create axis functions

var bottomAxis = d3.axisBottom(povertyXLinearScale).ticks(8);
var leftAxis = d3.axisLeft(healthcareYLinearScale);

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
    .attr("cx", d => povertyXLinearScale(d.poverty))
    .attr("cy", d => healthcareYLinearScale(d.healthcare))
    .attr("r",15)
    .attr("fill","blue")
    .attr("opacity",".1")
    .text(function(d){return d.abbr;});

console.log("I am here****************")
var elemEnter =chartGroup.selectAll("text")
    .data(stateData)    
    .enter()
    .append("text")
    .attr("x", d => (povertyXLinearScale(d.poverty)-6))
    .attr("y", d => (healthcareYLinearScale(d.healthcare)+2))
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
    .text("Obeese(%)")
    .on("click",asixValue('y','obeese') );
chartGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("y",  - margin.left+30)
    .attr("x", 0 -(height/2))
    .attr("dy", "1em")
    .attr("class","axisText")
    .text("Smokes (%)")
    .on("click",asixValue('y','smoke') );
chartGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("y",  - margin.left+60)
    .attr("x", 0 -(height/2))
    .attr("dy", "1em")
    .attr("class","axisText")
    .text("Lacks Healthcare (%)")
    .on("click",asixValue('y','healthcare') );
chartGroup.append("text")
    .attr("transform",`translate(${width /2},${height + margin.top +5})`)
    .attr("class","axisText")
    .text("In Poverty 1(%)")
    .on("click",asixValue('x','poverty') );    
chartGroup.append("text")
    .attr("transform",`translate(${width /2},${height + margin.top +30})`)
    .attr("class","axisText")
    .text("Age (Median)")
    .on("click",asixValue('x','age') );  
chartGroup.append("text")
    .attr("transform",`translate(${width /2},${height + margin.top +60})`)
    .attr("class","axisText")
    .text("Household income (median)")
    .on("click",asixValue('x','household') );

});    