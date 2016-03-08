require([
    // AppConfig
    "config/defaults",

    // Map
    "esri/arcgis/utils",
    
    // Time Animation
    "esri/TimeExtent",
    
    // Chart
    "app/d3ScatterPlot",
    "esri/tasks/query",
    "esri/tasks/QueryTask",

    // Dojo Utils
    "dojo/dom-style", 
    "dojo/dom-attr", 
    "dojo/dom", 
    "dojo/on", 
    "dojo/query",
    "dojo/_base/array",

    "dojo/domReady!"
], function (
    appConfig,
    
	arcgisUtils,
    
    TimeExtent,
    
    Chart,
    Query,
    QueryTask,

	domStyle, 
	domAttr, 
	dom, 
	on,
	dojoQuery,
	arrayUtils
  ){

    var map, eq_depth, eq_magnitude, playInterval = 6200;
    var now = { start: new Date("1/1/2016 UTC"), end: new Date("1/2/2016 UTC") };
    var chart, eq_allData = [], nextStartId = 0;
    var eq_queryTask = new QueryTask(appConfig.chart.dataUrl);

    function initMap() {
        var deferred = arcgisUtils.createMap(appConfig.map.id, "mapView", {
            mapOptions: {
                sliderPosition: "bottom-right"
            }
        }).then(function(response) {
            map = response.map;
            map.disableMapNavigation(); // 地図操作無効化
            console.log(map);
            
            dom.byId("title").innerHTML = response.itemInfo.item.title;
            
            //initTime();
            getEQAllData();

            eq_depth = map.getLayer(appConfig.layer.eq_depth);
            eq_magnitude = map.getLayer(appConfig.layer.eq_magnitude);

            eq_magnitude.on("graphic-draw", eq_magnitude_draw);
            eq_magnitude.on("mouse-over", eq_magnitude_hover);
            eq_magnitude.on("mouse-out", eq_magnitude_mouseout);
        });
    }
    
    function initChart(data) {
        chart = new Chart({
            map: map,
            layer: eq_magnitude,
            data: data
        }, "chartView");
        setTimeout(function() {
            initTime();
        }, 6200);
    }
    
    function updateChart() {
        chart.setHighlightSpan(now.start, now.end);
    }
    
    function getEQAllData(startId) {
        var query = new Query();
        query.outFields = ["OBJECTID", "MAGNITUDE", "DEPTH", "UTC_DATETIME"];
        query.returnGeometry = false;
        //query.where = "1=1";
        if(startId !== undefined) {
            query.where = "MAGNITUDE >= 4 AND OBJECTID > " + startId;
        }
        else {
            query.where = "MAGNITUDE >= 4";
        }
        
        eq_queryTask.execute(query, successGetEQAllData, errorGetEQAllData);
    }
    
    function successGetEQAllData(e) {
        console.log("successGetEQAllData", e);
        arrayUtils.forEach(e.features, function(f) {
            if(f.attributes["UTC_DATETIME"] != null || f.attributes["UTC_DATETIME"] != undefined) {
                eq_allData.push(f.attributes);
            }
        });
        
        if(e.exceededTransferLimit === true) {
            nextStartId += 1000;
            getEQAllData(nextStartId);
        }
        else {
            console.log("finish: successGetEQAllData", eq_allData);
            initChart(eq_allData);
        }
    }
    
    function errorGetEQAllData() {
        console.log("errorGetEQAllData");
    }
    
    function initTime() {
        dom.byId("now").innerHTML = "<b>" + now.start.getFullYear() + "年 " + (now.start.getMonth() + 1) + "月 " + now.start.getDate() + "日</b>";
        var timeExtent = new TimeExtent();
        timeExtent.startTime = now.start;
        timeExtent.endTime = now.end;
        map.setTimeExtent(timeExtent);
        console.log(timeExtent);
        
        updateChart();
        
        setTimeout(function() {
            forwardTime();
        }, playInterval);
    }
    
    function forwardTime() {
        now.start.setDate(now.start.getDate() + 1);
        now.end.setDate(now.end.getDate() + 1);
        initTime();
    }

    function eq_magnitude_draw(e) {
        //console.log(e.node);
        //console.log(e.graphic._shape.shape.r);
        d3.select(e.node).attr("r", 0);
        d3.select(e.node).transition()
            .delay(0)
            .duration(4000)
            .attr("r", e.graphic._shape.shape.r);
    }
    
    function eq_magnitude_hover(e) {
        
    }
    
    function eq_magnitude_mouseout(e) {
        
    }

    initMap();
});