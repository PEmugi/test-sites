define([
    // AppConfig
    "config/defaults",
    
    // Time Animation
    "esri/TimeExtent",

    // Dojo Utils
	"dojo/_base/declare",
	"dojo/_base/lang",
    "dojo/dom-style", 
    "dojo/dom-attr", 
    "dojo/dom", 
    "dojo/on", 
    "dojo/query",
    "dojo/_base/array",

    "dojo/domReady!"
], function (
    appConfig,
    
    TimeExtent,

    declare,
    lang,
	domStyle, 
	domAttr, 
	dom, 
	on,
	query,
	arrayUtils
  ){
      return declare([], {
		constructor: function() {
			var options = arguments[0];
			this.map = options.map;
			this.data = options.data;
            this.layer = options.layer;
            this.domId = arguments[1];
            this.svg = {};
			this._initChart();
		},

		_initChart: function() {
            console.log(this.data);
            console.log(this.domId);
            var data = this.data;
            var layer = this.layer;
            
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            var margin = {top: 20, right: 40, bottom: 60, left: 50},
                width = window.innerWidth - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            var x = d3.time.scale()
                .range([0, width]);
            /*var x = d3.scale.linear()
                .range([1451613639000, 1457413398000]);*/

            var y = d3.scale.linear()
                .range([height, 0]);

            var color = d3.scale.category10();

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var svg = d3.select("#" + this.domId).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            arrayUtils.forEach(data, function(d) {
                d.MAGNITUDE = +d.MAGNITUDE;
                d.UTC_DATETIME = +d.UTC_DATETIME;
            });

            x.domain(d3.extent(data, function(d) { return d.UTC_DATETIME; })).nice();
            y.domain(d3.extent(data, function(d) { return d.MAGNITUDE; })).nice();

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .style("fill", "#9d9d9d")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .style("fill", "#9d9d9d")
                .text("Date");

            svg.append("g")
                .attr("class", "y axis")
                .style("fill", "#9d9d9d")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("fill", "#9d9d9d")
                .text("Magnitude");

            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", function(d) { return d.MAGNITUDE; })
                .attr("cx", function(d) { return x(d.UTC_DATETIME); })
                .attr("cy", function(d) { return y(d.MAGNITUDE); })
                //.style("fill", function(d) { return color(d.MAGNITUDE); });
                //.style("fill-opacity", 0)
                //.style("stroke", "rgb(255, 85, 0)");
                //.style("fill", "#9d9d9d")
                .on("mouseover", lang.hitch(function(d) {
                    console.log(window.innerWidth - d3.event.pageX);
                    var xoffset;
                    if((window.innerWidth - d3.event.pageX) > 240) {
                        xoffset = 15;
                    }
                    else {
                        xoffset = -165;
                    }
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(new Date(d.UTC_DATETIME).getFullYear() + "/" + (new Date(d.UTC_DATETIME).getMonth() + 1) + "/" + new Date(d.UTC_DATETIME).getDate() + "<br/>" + 
                                "マグニチュード: " + d.MAGNITUDE)
                        .style("left", (d3.event.pageX + xoffset) + "px")
                        .style("top", (d3.event.pageY - 40) + "px");
                        
                    arrayUtils.forEach(layer.graphics, function(g) {
                        if(d.OBJECTID === g.attributes.OBJECTID) {
                            //console.log(g);
                            //console.log(g.getNode());
                            d3.select(g.getNode()).attr("class", "active-feature");
                        }
                    });
                }))
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(400)
                        .style("opacity", 0);
                    d3.selectAll(".active-feature").attr("class", "");
                });

            /*var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });*/
                
            this.svg = svg;
		},
        
        setHighlightSpan: function(start, end) {
            this.svg.selectAll(".active-dot")
                .attr("class", "dot");
            
            this.svg.selectAll(".dot")
                .attr("class", function(d) {
                    //console.log(new Date(d.UTC_DATETIME));
                    var date = new Date(d.UTC_DATETIME);
                    //console.log(d);
                    if(start <= date && end > date) {
                        return "active-dot";
                    }
                    else {
                        return "dot";
                    }
                });
        }
	});
});