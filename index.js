var cheerio      = require('cheerio');
var util         = require("util");
var EventEmitter = require("events").EventEmitter;
var winston      = require('winston');
var ee           = new EventEmitter();

var log = winston.loggers.get('spider');

function hotukdeals(){
    EventEmitter.call(this);
    this.name = 'hotukdeals.com';
    this.baseUrl = 'http://www.hotukdeals.com';

    // set inside `parse`
    this.items = [];
    this._html = null;
    this.$ = null;
    this.currentPage = null;
};

util.inherits(hotukdeals, EventEmitter);

hotukdeals.prototype.parse = function(html) {
    log.info('parsing %d bytes', html.length);
    var self = this;
    self._html = html;
    self.$ = cheerio.load(html);
    self.$('.redesign-item-listing h2').each(function(i,el){
        var item = {};
        item.title = self.$(this).text();
        self.items.push(item);
        self.emit("item-scraped",item);
    })
}

// Get the url to the next page
hotukdeals.prototype.nextUrl = function() {
    var self = this;
    if(self.currentPage === null) {
        self.currentPage = 1;
        log.info('info','setting currentPate to 1');
        return self.baseUrl;
    } else {
//        this.currentPage = parseInt(this.$('.redesign-pagination selected').text());
        log.info('currentPage: %s', self.currentPage);
        self.currentPage = self.currentPage+1;
        return this.baseUrl + '/?page=' + self.currentPage.toString();
    }
}

module.exports = exports = hotukdeals;
