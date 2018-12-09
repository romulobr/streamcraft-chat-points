const $ = require("cheerio");

function parseData(data){
   const nick = $('.nick',data).text();
   return {nick};
}

module.exports = {parseData};