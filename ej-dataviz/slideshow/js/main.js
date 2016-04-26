require([
	"esri/arcgis/utils",

    "esri/arcgis/Portal", 
    "esri/arcgis/OAuthInfo", 
    "esri/IdentityManager",

    "config/defaults",

    "dojo/dom-style", 
    "dojo/dom-attr", 
    "dojo/dom", 
    "dojo/on", 
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/query",
    
    "js/DatavizQuery.js",

    "dojo/domReady!"
], function (
	arcgisUtils,

	arcgisPortal, 
	OAuthInfo, 
	esriId,
	d,
	domStyle, 
	domAttr, 
	dom, 
	on, 
	arrayUtils,
    domConstruct,
    query,
    
    DataVizQuery
  ){
      
  	var maps = [];
    var next = false;

	var info = new OAuthInfo({
		appId: d.oauth.appid,
		popup: false
	});
    
    $('#modal').modal('show');

	function initApp() {
        var query = new DataVizQuery({
            settings: {
                //id_group: d.group,
                searchType: d.searchType,
                sortField: d.sortField,
                sortOrder: d.sortOrder,
                pagination: d.showPagination,
                paginationSize: d.paginationSize,
                paginationShowFirstLast: true,
                paginationShowPrevNext: true,
                keywords: d.keywords,
                perPage: parseInt(d.galleryItemsPerPage, 10),
                layout: d.defaultLayout,
                searchAccess: d.searchAccess//,
                //token: portalUser.credential.token
            },
            oauthInfo: info 
        });
        query.runQuery().then(function(response) {
            console.log(response);
            arrayUtils.forEach(response.results, function(result) {
                if(result.type === "Web Map") {
                    maps.push(result);
                }
            });
            createThumbnailContainer();
            startSlideshow();
        });
	}
    
    function createThumbnailContainer() {
        var oneLineLength;
        if(maps.length < 25) {
            oneLineLength = maps.length;
        }
        else if(maps.length < 50) {
            oneLineLength = Math.round(maps.length/2);
        }
        else if(maps.length < 100) {
            oneLineLength = Math.round(maps.length/4);
        }
        arrayUtils.forEach(maps, function(mapInfo, i) {
            domConstruct.create("div", { "id": "thumbnail-" + i, "class": "thumbnail-flame", "data-toggle": "tooltip", "data-placement": "bottom", "title": mapInfo.title, "style": "width:" + 100/oneLineLength + "%;", "innerHTML": "<a href='http://www.arcgis.com/home/webmap/viewer.html?webmap=" + mapInfo.id + "' target='_brank'><img src='" + mapInfo.thumbnailUrl + "' alt='" + mapInfo.title + "' class='map-thumbnail'></a>"}, "thumbnailContainer", "last");
        });
        $('[data-toggle="tooltip"]').tooltip();
    }
    
    function startSlideshow() {
        var slideId = 0;
        var first = true;
        domConstruct.create("div", { "id": "mapView" }, "mapContainer", "first");
        initMap(maps[0], 0);
        setInterval(function() {
            domStyle.set("mapView", { "opacity": 0 });
            setTimeout(function() {
                domConstruct.destroy("mapView");
                domConstruct.create("div", { "id": "mapView" }, "mapContainer", "first");
                domStyle.set("mapView", { "opacity": 0 });
                console.log(slideId, maps[slideId].id, maps[slideId].title, maps[slideId].snippet, maps[slideId].thumbnailUrl, maps[slideId].itemUrl);
                initMap(maps[slideId], slideId);                
            }, 1100);
            if(slideId === maps.length - 1) {
                slideId = 0;
            }
            else {
                slideId += 1;
            }
        }, 10000);
    }
    
    function initMap(mapInfo, index) {
        dom.byId("mapTitle").innerHTML = mapInfo.title;
        dom.byId("mapSnippet").innerHTML = mapInfo.snippet + "<br>作成者: <a href='https://www.arcgis.com/home/user.html?user=" + mapInfo.owner + "' target='_brank'>" + mapInfo.owner + "</a>";
        query(".thumbnail-flame").style({ "border": "0", "opacity": 0.7 });
        domStyle.set("thumbnail-" + index, { "border": "2px solid rgba(255,69,0,0.7)", "opacity": 1 });
        var deferred = arcgisUtils.createMap(mapInfo.id, "mapView").then(function(response) {
            domStyle.set("mapView", { "opacity": 1 });
			map = response.map;
            console.log(response);
		});
    }

     initApp();

});