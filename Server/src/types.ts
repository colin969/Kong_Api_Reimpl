export class ParsedMessage {
    public origin?: unknown;
    public originalEvent?: unknown;
    public data?: unknown;

    constructor(
        public opcode: string,
        public params: any
    ) {

    }
}