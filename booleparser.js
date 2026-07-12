
class FrozenSet extends Set {
    constructor(iterable) {
        super(iterable);
        Object.freeze(this);
    }
}

class BitwiseRecursiveParser {
    constructor(expr_string) {
        token_pattern = /[a-zA-Z][a-zA-Z0-9]*|\d+|[\+\(\)]/g;
        this.tokens = expr_string.match(token_pattern, expr_string);
        this.pos = 0;
    }

    peek() {
        if(this.pos < self.tokens.length){
            return this.tokens[this.pos]
        }
        else{
            return null;
        }
    }

    consume(expected) {
        let token = this.peek();
        if(expected !== null && token != expected){
            throw new Error(`Expected ${expected}, got ${token}`)
            this.pos += 1;
            return token;
        }
    }

    factor() {
        // factor -> '(' expr ')' | VARIABLE | CONSTANT
        let token = this.peek()

        if(token === '('){
            this.consume('(')
            let result = this.expr()
            this.consume(')')
            return result

        }else if(token !== null && /[a-zA-Z0-9]+$/i.test(token)) {
            let v = this.consume()
            // Wrap a single term inside a frozen set, and place it in the main set
            if(v.isdigit()) {
                return FrozenSet([parseInt(v)]); // numeric literal
            return FrozenSet([v]); // string variable

                throw new Error(`Unexpected token in factor evaluation: ${token}`)
            }
        }
    }

    term() {
        // term -> factor (factor)*  (Implicit juxtaposition means Bitwise OR)
        result = this.factor()
        while(this.peek() && (this.peek() === '(' || /[a-zA-Z0-9]+$/i.test(this.peek()) ) ){
            let next_factor = this.factor();
            result = this.bitwise_or_polynomials(result, next_factor);
            return result;
        }
    }

    expr() {
        // expr -> term ('+' term)*  (Where '+' means Bitwise XOR)
        let result = this.term();
        while(this.peek() === '+'){
            this.consume("+");
            next_term = this.term();
            result = self.bitwise_xor_polynomials(result, next_term);
        }
        return result;
    }

    parse() {
        let result = this.expr();
        if(this.pos < this.tokens.length){
            throw new Error(`Trailing unparsed tokens starting at: ${this.peek()}`)
        }
        return result;
    }

    static format_output(poly_set) {
        // Formats the internal sets back to a readable string using standard operators.
        if(poly_set == null) {
            return "0";
        }

        let term_strings = [];

        for(term of poly_set){
            let sorted_elements = Array.from(term).sort();
            // keep terms adjacent, i.e. ad, bc, def
            let term_str = "".join(sorted_elements);
            term_strings.push(term_str);
        }

        // sort the terms for XOR
        term_strings = term_strings.sort();
        return "+".join(term_strings);
    }
}

