import { OperationNodeTransformer } from "../../operation-node/operation-node-transformer";
import { TableNode } from "../../operation-node/table-node";
export interface PrefixOperationNodeTransformerOptions {
    tables: Record<string, string>;
}
export type TablePrefixOperationNodeTransformerOptions = PrefixOperationNodeTransformerOptions;
export type IndexPrefixOperationNodeTransformerOptions = PrefixOperationNodeTransformerOptions;
export declare class TablePrefixOperationNodeTransformer extends OperationNodeTransformer {
    #private;
    constructor(options: TablePrefixOperationNodeTransformerOptions);
    protected transformTable(node: TableNode): TableNode;
    protected getName(name: string): string;
}
