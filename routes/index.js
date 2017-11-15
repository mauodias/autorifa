var express = require('express');
var router = express.Router();
var guid = require('guid');
var PDFDocument = require('pdfkit');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/criar', function(req, res, next) {
    var filename = guid.raw()+'.pdf';
    var doc = new PDFDocument();
    doc.pipe(res);

    doc.font('fonts/UbuntuMono-R.ttf')
        .fontSize(25)
        .text('Some text with an embedded font!', 100, 100);

    doc.end();
});

module.exports = router;
