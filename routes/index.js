var express = require('express');
var router = express.Router();
var guid = require('guid');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auto Rifa' });
});

router.post('/criar', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        var doc = new PDFDocument({autoFirstPage: false, bufferPages: true});
        doc.pipe(res);

        var counter = 0;

        doc.addPage({size:'A4', margin: 20});

        doc.moveTo(0, 10)
            .lineTo(595, 10)
            .dash(3, {space: 3})
            .stroke()
            .dash(3, {space:0});

        for (var i = fields.primeiro; i <= fields.ultimo; i++) {
            if(counter == 5){
                doc.addPage({size:'A4', margin: 20});
                counter = 0;
            }
            var vertPos = counter * 160 + 20;

            doc.font('fonts/UbuntuMono-R.ttf')
                .fontSize(12);

            doc.image(files.image.path, 460, vertPos+20, {fit: [100, 100]});
            doc.rect(20,vertPos,555,140).stroke();
            doc.moveTo(0, vertPos+150)
                .lineTo(595, vertPos+150)
                .dash(3, {space: 3})
                .stroke();
            doc.moveTo(150, vertPos)
                .lineTo(150, vertPos+140)
                .dash(3, {space:3})
                .stroke();
            doc.dash(3, {space: 0});
            //doc.rect(475, vertPos, 100, 20).stroke();
            //doc.rect(475, vertPos+120, 100, 20).stroke();
            doc.moveTo(20, vertPos+120)
                .lineTo(150, vertPos+120)
                .stroke();
            doc.rect(460, vertPos+20,100,100)

            doc.text("Nome: ", 25, vertPos+5);
            doc.text("Telefone: ", 25, vertPos+35);
            doc.text("Email: ", 25, vertPos+65);
            var n2 = parseInt(i)+500;
            if(n2 > 1000){
                n2 -= 1000;
            }
            var nums = zeroFill(i, 3) + " / " + n2;
            doc.text(nums, 57, vertPos + 123);
            doc.text(nums, 485, vertPos + 123);
            doc.text('R$ ' + parseFloat(Math.round(fields.preco * 100) / 100).toFixed(2).replace('.', ','), 491, vertPos+3);
            doc.text(fields.desc, 163, vertPos+15, {width: 300});
            var data = new Date(fields.dataSorteio);
            doc.text('Resultado obtido pela centena do 1º prêmio da Loteria Federal de ' + data.getDate() + '/' + parseInt(data.getMonth()+1) + '/' + data.getFullYear() + ' às 19h', 163, vertPos + 109, {width: 290});

            counter++;
        }

        doc.end();
    });
});

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}

module.exports = router;
