class BitwiseRecursiveParser {
    constructor(expr_string, encoding) {
        let token_pattern = /[a-zA-Z][a-zA-Z0-9]*|\d+|[\+\(\)]/i;
        if(token_pattern.test(expr_string)){
                this.tokens = expr_string;
                this.table = new Map();
                for(const code of encoding){
                    this.table.set(code[0],code[1]);
                    this.table.set(code[1],code[0]);
                }
                //console.log("Encoding table");
                //console.log(this.table);
        }
        this.pos = 0;
    }

    peek() {
        if(this.pos < this.tokens.length){
            return this.tokens[this.pos];
        }
        else{
            return null;
        }
    }

    consume(expected="None") {
        let token = this.peek();
        //console.log("Token consumed:");
        //console.log(token);
        if(expected !== "None" && token != expected){
            throw new Error(`Expected ${expected}, got ${token}`);
        }
        this.pos += 1;
        return token;
    }

    factor() {
        // factor -> '(' expr ')' | VARIABLE | CONSTANT
        let token = this.peek();
        //console.log("Token received:");
        //console.log(token);
        if(token === '('){
            this.consume('(');
            let result = this.expr();
            this.consume(')');
            return result;

        }else if(token && /[a-zA-Z0-9]+$/i.test(token)) {
            let v = this.consume();
            // Translate the terms into integers by encoding
            while(this.peek() && /[a-zA-Z]/i.test(this.peek())){
                let next_v = this.consume();
                v += next_v;
            }
            return [this.table.get(v)]; // token as integer
        }

        throw new Error(`Unexpected token in factor evaluation: ${token}`);
    }

    bitwise_xor_polynomials(poly1, poly2){
        /* Implements Bitwise XOR (Addition).
          In XOR logic, A + A = 0. Symmetric difference clears out duplicates.*
        */
        //console.log("Poly1 before XOR");
        //console.log(poly1);
        //console.log("Poly2 before XOR");
        //console.log(poly2);

        // encode: i -> 2**i for p1 and p2 numbers
        let p1 = poly1.map( (num) => BigInt(1n) << BigInt(num+1) );
        let p2 = poly2.map( (num) => BigInt(1n) << BigInt(num+1) );
        let p = p1.concat(p2);

        let bigXorResult = BigInt(0);
        for(const n of p){
            bigXorResult ^= n;
        }

        // decode result back to integers
        let result = [];
        let i = 0;
        while (bigXorResult > 0n) {
            if (bigXorResult % 2n === 1n) {
                result.push(i - 1);
            }
            i++;
            bigXorResult = bigXorResult / 2n;
        }
        //console.log("XOR Result");
        //console.log(result);
        return result;
    }

    bitwise_or_polynomials(poly1, poly2){
        /* Implements Bitwise OR (Multiplication distribution).
           Every sub-term is combined using set union (since A OR B handles idempotency).*
         */
        let result = [];
        //console.log("Poly1 before OR");
        //console.log(poly1);
        //console.log("Poly2 before OR");
        //console.log(poly2);
        for(let term1 of poly1){
            for(let term2 of poly2){
                result.push(term1 | term2);
            }
        }
        return this.bitwise_xor_polynomials(result,[]);
    }


    term() {
        // term -> factor (factor)*  (Implicit juxtaposition means Bitwise OR)
        let result = this.factor();
        //console.log("term() result: ");
        //console.log(result);
        while(this.peek() && (this.peek() === '(' || /[a-zA-Z0-9]+$/i.test(this.peek()) ) ){
            let next_factor = this.factor();
            //console.log("Next factor:");
            //console.log(next_factor);
            //console.log("Result before bitwise or: ");
            //console.log(result);
            result = this.bitwise_or_polynomials(result, next_factor);
            //console.log("term() bitwise or Result:")
            //console.log(result);
        }
        return result;
    }

    expr() {
        // expr -> term ('+' term)*  (Where '+' means Bitwise XOR)
        let result = this.term();
        //console.log("expr() result: ");
        //console.log(result);
        while(this.peek() === '+'){
            this.consume("+");
            let next_term = this.term();
            result = this.bitwise_xor_polynomials(result, next_term);
        }
        return result;
    }

    parse() {
        let result = this.expr();
        if(this.pos < this.tokens.length){
            throw new Error(`Trailing unparsed tokens starting at: ${this.peek()}`);
        }
        return result;
    }

    get_table(){
        return this.table;
    }

    static format_output(poly_set, table) {
        let term_strings = [];

        // Formats the internal sets back to a readable string using standard operators.
        if(poly_set.length === 0) {
            return '0';
        }

        let sorted_strings = [];
        // decode back the result
        for(const n of poly_set){
            term_strings.push(table.get(n));
        }
        // sort items
        sorted_strings = term_strings.toSorted(
            (a, b) => a.length - b.length || a.localeCompare(b));
        return sorted_strings.join("+");
    }
}

