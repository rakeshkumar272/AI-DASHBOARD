const pdf = require("pdf-parse");
console.log("Type of pdf:", typeof pdf);
console.log("Structure of pdf:", pdf);
try {
    console.log("Is pdf a function?", typeof pdf === 'function');
} catch (e) {
    console.error(e);
}
