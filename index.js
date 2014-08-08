var cheerio      = require('cheerio');
var util         = require("util");
var EventEmitter = require("events").EventEmitter;
var ee           = new EventEmitter();

function hotukdeals(){
    EventEmitter.call(this);
    this.name = 'hotukdeals.com';
    this.baseUrl = 'http://wwww.hotukdeals.com';

    // set inside `parse`
    this.items = [];
    this._html = null;
    this.$ = null;
    this.currentPage = null;
};

util.inherits(hotukdeals, EventEmitter);

hotukdeals.prototype.parse = function(html) {
    var self = this;
    self._html = html;
    self.$ = cheerio.load(html);
    self.$('.redesign-item-listing h2').each(function(i,el){
        var item = {};
        item.title = $(this).text();
        self.items.push(item);
        self.emit("item-scraped",item);
    })
}

// where more items can be scraped from. To be called after items on 'start_url'
// have been scraped.
hotukdeals.prototype.more = function() {
    // in this case, determine which is the current page, and fetch the link
    // to the next one
    this.currentPage = parseInt(this.$('.redesign-pagination selected').text());
    console.log('currentPage: ', currentPage);
    var nextPage = this.currentPage++;
    return this.baseUrl + '/?page=' + nextPage.toString();
}

module.exports = exports = hotukdeals;
