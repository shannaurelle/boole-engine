
class FrozenSet extends Set {
    constructor(iterable) {
        super(iterable);
        Object.freeze(this);
    }
}

class BitwiseRecursiveParser {
    constructor(expr_string) {
        let token_pattern = /[a-zA-Z][a-zA-Z0-9]*|\d+|[\+\(\)]/i;
        if(token_pattern.test(expr_string)){
                this.tokens = expr_string;
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
        console.log("Token consumed:");
        console.log(token);
        if(expected !== "None" && token != expected){
            throw new Error(`Expected ${expected}, got ${token}`);
        }
        this.pos += 1;
        return token;
    }

    factor() {
        // factor -> '(' expr ')' | VARIABLE | CONSTANT
        let token = this.peek();
        console.log("Token received:");
        console.log(token);
        if(token === '('){
            this.consume('(');
            let result = this.expr();
            this.consume(')');
            return result;

        }else if(token && /[a-zA-Z0-9]+$/i.test(token)) {
            let v = this.consume();
            // Wrap a single term inside a frozen set, and place it in the main set
            if(/[1-9][0-9]+/i.test(v)) {
                return new FrozenSet([parseInt(v)]); // numeric literal
            }
            return new FrozenSet([v]); // string variable
        }

        throw new Error(`Unexpected token in factor evaluation: ${token}`);
    }

    bitwise_xor_polynomials(poly1, poly2){
        /* Implements Bitwise XOR (Addition).
          In XOR logic, A + A = 0. Symmetric difference clears out duplicates.*
        */
        return poly1.symmetricDifference(poly2);
    }

    bitwise_or_polynomials(poly1, poly2){
        /* Implements Bitwise OR (Multiplication distribution).
           Every sub-term is combined using set union (since A OR B handles idempotency).*
         */
        let result = new Set();
        console.log("Poly1");
        console.log(poly1);
        console.log("Poly2");
        console.log(poly2);
        for(let term1 of poly1){
            for(let term2 of poly2){
                // Set union handles bitwise OR combination perfectly
                // e.g., frozenset(['A']) | frozenset(['B']) -> frozenset(['A', 'B'])
                let new_set = new Set();
                if(term1 !== "1"){ new_set.add(term1); }
                if(term2 !== "1"){ new_set.add(term2); }
                result.add(new_set);
            }
        }
        return result;
    }


    term() {
        // term -> factor (factor)*  (Implicit juxtaposition means Bitwise OR)
        let result = this.factor();
        console.log("term() result: ");
        console.log(result);
        while(this.peek() && (this.peek() === '(' || /[a-zA-Z0-9]+$/i.test(this.peek()) ) ){
            let next_factor = this.factor();
            console.log("Next factor:");
            console.log(next_factor);
            console.log("Result before bitwise or: ");
            console.log(result);
            result = this.bitwise_or_polynomials(result, next_factor);
            console.log("term() bitwise or Result:")
            console.log(result);
        }
        return result;
    }

    expr() {
        // expr -> term ('+' term)*  (Where '+' means Bitwise XOR)
        let result = this.term();
        console.log("expr() result: ");
        console.log(result);
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

    static format_output(poly_set) {
        // Formats the internal sets back to a readable string using standard operators.
        if(poly_set.size === 0) {
            return "0";
        }

        let term_strings = [];

        for(let term of poly_set){
            let sorted_elements = Array.from(term).sort();
            // keep terms adjacent, i.e. ad, bc, def
            let term_str = [];
            term_str = sorted_elements.join("");
            term_strings.push(term_str);
        }

        // sort the terms for XOR
        term_strings = term_strings.sort();
        return term_strings.join("+");
    }
}

