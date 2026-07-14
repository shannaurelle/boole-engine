function render_math(string) {
// Define the MathML XML namespace
const MATHML_NS   = "http://www.w3.org/1998/Math/MathML";
// remove spaces
var filter2       = string.replace(/\s/g,"");
// split the terms by the plus
var strings       = filter2.split("+");
// Create the root <math> tag
const mathElement = document.createElementNS(MATHML_NS, "math");
mathElement.setAttribute("display", "block"); // Blocks display on a new line

// for each string, just convert them to MathML
var count = 0;
for(str of strings){

    const raw_expr = str.replace("^","");
    const monomial = /[a-zA-Z]?[1-9][0-9]*/g;
    var monomials  = raw_expr.match(monomial);
    var terms      = [];

    if(monomials!==null){
        terms = terms.concat(monomials);
    }
    var noExponents = raw_expr.match(/(?:[a-zA-Z](?!\d))+/g);
    if(noExponents!==null){
            var rest = noExponents.join("")
            terms = terms.concat(rest.split(""));
    }
    terms = terms.sort();
    for (term of terms){
        if(term.length == 1){
            var expr = [term, ""];
        }else{
            var expr = [term.match(/[a-zA-Z]/),term.match(/[1-9][0-9]*/)];
        }
        // Create the superscript container <msup>
        const msup     = document.createElementNS(MATHML_NS, "msup");
        // Create the base <mi> (identifier like 'x')
        const mi       = document.createElementNS(MATHML_NS, "mi");
        mi.textContent = expr[0];
        // Create the exponent <mn> (number like '2')
        const mn       = document.createElementNS(MATHML_NS, "mn");
        mn.textContent = expr[1];

        // Assemble the DOM structure
        msup.appendChild(mi);
        msup.appendChild(mn);
        mathElement.appendChild(msup);
    }
    if(strings.length > (count+1)) {
        const mo = document.createElementNS(MATHML_NS, "mo");
        mo.textContent = "+";
        mathElement.appendChild(mo);
        count++;
    }
    else{
         count = 0;
    }

}

var expression = mathElement.innerHTML;

return expression;

}

function unique_letters(string){
    letters = string.match(/[a-zA-Z]/g);
    if(letters){
        unique = new Set();
        for(letter of letters){
            if(!unique.has(letter)){
                unique.add(letter);
            }
        }
        return Array.from(unique).join(",");
    }
    return null;
}

function decimaltoBinary(num){
    if(num >= 0){
        return Math.abs(num).toString(2);
    }
    return 0;
}

function remove_exponent(string){
    let dirt = string.match(/[\^]\d+/g);
    let result = string;
    if(dirt){
        for(let d of dirt){
            result = result.replace(d,"");
        }
    }
    return result;
}

function generate_encoding(string){
    // encoding is a list of pairs of (key, value)
    let encoding = [];
    const variables = string.split(",");
    for(let i = 0; i < (1 << variables.length); i++){

        // integer code
        const code = i;
        let name = "";
        // make the name via power set algorithm
        if(i == 0){ name = "1"; }
        else{
            for(let j = 0; j < variables.length; j++){
                if(i & (1 << j)){
                    name += variables[j];
                }
            }
        }
        let new_row = [name,code];
        encoding.push(new_row);
    }
    return encoding;
}

// this function expects a string composed
// of letters separated by commas
function generate_table(encoding,header=["Term","Encoding"]){
const table = document.createElement("table");
const thead = document.createElement("thead");
const tbody = document.createElement("tbody");

if(encoding.length > 0){
    // make thead
    const thead    = document.createElement("thead");
    const tr_h     = document.createElement("tr");
    const th_name  = document.createElement("th");
    const th_val   = document.createElement("th");
    th_name.textContent = header[0];
    th_val.textContent = header[1];
    tr_h.appendChild(th_name);
    tr_h.appendChild(th_val);
    thead.appendChild(tr_h);
    table.appendChild(thead);

    // make tbody
    for(let i = 0; i < encoding.length; i++){

        let name = encoding[i][0];
        let code = decimaltoBinary(encoding[i][1]);

        const tr                = document.createElement("tr");
        const td_name           = document.createElement("td");
        const td_encoding       = document.createElement("td");
        td_name.textContent     = name;
        td_encoding.textContent = code;

        tr.appendChild(td_name);
        tr.appendChild(td_encoding);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
}

}
