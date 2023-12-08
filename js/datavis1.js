var margin = {
  top: 10,
  right: 30,
  bottom: 60,
  left: 70
},
width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../csv/Book1.csv", function (data) {

// Filter data for North African countries
var northAfricanCountries = ["Algeria", "Egypt", "Libya", "Morocco", "Sudan", "Tunisia"];
var filteredData = data.filter(function (d) {
  return northAfricanCountries.includes(d.Country);
});

var subgroups = data.columns.slice(1);

var x = d3.scaleBand()
  .domain(northAfricanCountries)
  .range([0, width])
  .padding([0.2]);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSizeOuter(0));

svg.append("text")
  .attr("transform",
    "translate(" + (width / 2) + " ," +
    (height + margin.top + 40) + ")")
  .style("text-anchor", "middle")
  .text("Pays");

var y = d3.scaleSqrt()
  .domain([0, d3.max(filteredData, function (d) {
    return d3.sum(subgroups, function (key) {
      return +d[key];
    });
  })])
  .range([height, 0]);

svg.append("g")
  .call(d3.axisLeft(y));

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left - 5)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Superficie en KHa");

var color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#e41a1c', '#377eb8', '#4daf4a', '#7a0177'])

var stackedData = d3.stack()
  .keys(subgroups)
  (filteredData);

var tooltip = d3.select("#my_dataviz")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("position", "absolute")
  .style("display", "inline-block")

var mouseover = function (d) {
  var subgroupName = d3.select(this.parentNode).datum().key;
  var subgroupValue = d.data[subgroupName];
  tooltip
    .html("Classe des terres: " + subgroupName + "<br>" + "Superficie en KHa: " + subgroupValue)
    .style("opacity", 1)
}
var mousemove = function (d) {
  tooltip
    .style("left", (d3.mouse(this)[0] + 90) + "px")
    .style("top", (d3.mouse(this)[1]) + "px").style()
}
var mouseleave = function (d) {
  tooltip
    .style("opacity", 0)
}

svg.append("g")
  .selectAll("g")
  .data(stackedData)
  .enter().append("g")
  .attr("fill", function (d) {
    return color(d.key);
  })
  .selectAll("rect")
  .data(function (d) {
    return d;
  })
  .enter().append("rect")
  .attr("x", function (d) {
    return x(d.data.Country);
  })
  .attr("y", function (d) {
    return y(d[1]);
  })
  .attr("height", function (d) {
    return y(d[0]) - y(d[1]);
  })
  .attr("width", x.bandwidth())
  .attr("stroke", "grey")
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)
});
