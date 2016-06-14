L.esri.FeatureLayerSimpleCriteria = L.Class.extend({
    options: {
        str: {}, // { 'name': '="A"' }
        num: {}, // { 'capacity': '>300' }
        bool: {}, // { 'appointment': false }
        date: {} // {}
    },
    initialize: function (options) {
        options = options || {};
        this.where = '';
        L.Util.setOptions(this, options);
        
        this.generateWhere();
    },
    generateWhere: function () {
        var where = this.where || '';
        var checkStr = false;
        var checkNum = false;
        var checkBool = false;
        var checkDate = false;
        
        console.log(this.options);
        
        if(Object.keys(this.options.str).length > 0) {
            checkStr = true;
            for(key in this.options.str){
                where += key + this.options.str[key]
            }
        }
        if(Object.keys(this.options.num).length > 0) {
            checkNum = true;
            if(checkStr === true) {
                where += ' AND ';
            }
            for(key in this.options.num){
                where += key + this.options.num[key]
            }
        }
        if(Object.keys(this.options.bool).length > 0) {
            checkBool = true;
            if(checkStr === true || checkNum === true) {
                where += ' AND ';
            }
            for(key in this.options.bool){
                where += key + this.options.bool[key]
            }
        }
        if(Object.keys(this.options.date).length > 0) {
            checkDate = true;
            if(checkStr === true || checkNum === true || checkBool === true) {
                where += ' AND ';
            }
            for(key in this.options.date){
                where += key + this.options.date[key]
            }
        }
        
        if(where === '') {
            where = '1=1';
        }
        
        return where;
    }
});

L.esri.featureLayerSimpleCriteria = function (options) {
	return new L.esri.FeatureLayerSimpleCriteria(options);
};