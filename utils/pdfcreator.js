var wkhtmltopdf = require('wkhtmltopdf');
var fs = require("fs");

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

console.log("Generating PDF...")

wkhtmltopdf(fs.readFileSync("invoice.html", "utf8"), {
    output: 'invoice.pdf',
    pageSize: 'letter'
});

console.log("PDF Generated")