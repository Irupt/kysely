"use strict";
//import { OperationNodeTransformer, type TableNode } from 'kysely';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablePrefixOperationNodeTransformer = void 0;
const operation_node_transformer_1 = require("../../operation-node/operation-node-transformer");
class TablePrefixOperationNodeTransformer extends operation_node_transformer_1.OperationNodeTransformer {
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
exports.TablePrefixOperationNodeTransformer = TablePrefixOperationNodeTransformer;
