define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/_base/array',
	'dojo/dom-style',
	'dojo/on',
	'dojo/dom-class',
    
    "esri/arcgis/Portal", 
    "dojo/Deferred",

	'dojo/Evented'
], function (declare, lang, dom, domConstruct, arrayUtils, domStyle, on, domClass, arcgisPortal, Deferred, Evented) {
	return declare([], {
		constructor: function() {
			console.log(arguments);
			var options = arguments[0];
			console.log(options);
            this.settings = options.settings;
            this.oauthInfo = options.oauthInfo;
            
            //this.test();
		},
        
        /*test: function() {
            this.runQuery(this.settings).then(function(data) {
                console.log(data.total);
            });
        },*/
        
        runQuery: function() {
            var def = new Deferred();
            // default values
            var settings = {
                // set group id for web maps
                id_group: '',
                // type of item
                searchType: '',
                // filter these items
                //filterType: '"Code Attachment"',
                filterType: '',
                // access type
                searchAccess: '',
                // format
                dataType: 'json',
                // sorting column: The allowed field names are title, modified, type, owner, avgRating, numRatings, numComments and numViews.
                sortField: 'modified',
                // sorting order: Values: asc | desc
                sortOrder: 'desc',
                // if pagination
                pagination: true,
                // how many links to show on each side of pagination
                paginationSize: 1,
                // show first and last links on pagination
                paginationShowFirstLast: true,
                // show previous and next links
                paginationShowPrevNext: true,
                // search limit
                perPage: '',
                // maps per row
                perRow: '',
                // offset
                searchStart: 0,
                // search keywords
                keywords: '',
                // style of layout for the results
                layout: 'grid'
            };
            // If options exist, lets merge them with our default settings
            lang.mixin(settings, this.settings);
            
            var q = '';
            q += 'group:"' + settings.id_group + '"';
            if (settings.keywords) {
                q += ' AND (';
                q += ' title:' + settings.keywords;
                q += ' OR tags:' + settings.keywords;
                q += ' OR typeKeywords:' + settings.keywords;
                q += ' OR snippet:' + settings.keywords;
                q += ' ) ';
            }
            if (settings.searchType) {
                q += ' AND type:' + settings.searchType;
            }
            if (settings.filterType) {
                q += ' AND -type:' + settings.filterType;
            }
            if (settings.searchAccess) {
                q += ' AND access:' + settings.searchAccess;
            }
            var params = {
                q: q,
                //v: this._options.arcgisRestVersion,
                f: settings.dataType,
                token: ""
            };
            if (settings.sortField) {
                params.sortField = settings.sortField;
            }
            if (settings.sortOrder) {
                params.sortOrder = settings.sortOrder;
            }
            if (settings.perPage) {
                params.num = settings.perPage;
            } else {
                params.num = 0;
            }
            if (settings.searchStart > 1) {
                //params.start = (((settings.searchStart - 1) * settings.perPage) + 1);
                params.start = settings.searchStart;
            }
            console.log(params);
            //params.token = settings.token;
            new arcgisPortal.Portal(this.oauthInfo.portalUrl).queryItems(params).then(lang.hitch(this, function(data) {
                def.resolve(data);
            }));
            return def;
        }
	});
});
