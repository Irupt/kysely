/// <reference types="./transformer.d.ts" />
//import { OperationNodeTransformer, type TableNode } from 'kysely';
import { OperationNodeTransformer } from "../../operation-node/operation-node-transformer";
export class TablePrefixOperationNodeTransformer extends OperationNodeTransformer {
    #tables;
    constructor(options) {
        super();
        this.#tables = options.tables;
    }
    transformTable(node) {
        const transformedNode = super.transformTable(node);
        return {
            ...transformedNode,
            table: {
                ...transformedNode.table,
                identifier: {
                    ...transformedNode.table.identifier,
                    name: this.getName(transformedNode.table.identifier.name),
                },
            },
        };
    }
    getName(name) {
        return this.#tables[name] ? this.#tables[name] : name;
    }
}
