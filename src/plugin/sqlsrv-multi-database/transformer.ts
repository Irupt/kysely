//import { OperationNodeTransformer, type TableNode } from 'kysely';

import { OperationNodeTransformer } from "../../operation-node/operation-node-transformer";
import { TableNode } from "../../operation-node/table-node";

export interface PrefixOperationNodeTransformerOptions {
  tables: Record<string, string>;
}

export type TablePrefixOperationNodeTransformerOptions = PrefixOperationNodeTransformerOptions;

export type IndexPrefixOperationNodeTransformerOptions = PrefixOperationNodeTransformerOptions;

export class TablePrefixOperationNodeTransformer extends OperationNodeTransformer {
  readonly #tables: Record<string, string>;

  constructor(options: TablePrefixOperationNodeTransformerOptions) {
    super();

    this.#tables = options.tables;
  }

  protected transformTable(node: TableNode): TableNode {
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
  protected getName(name: string): string {
    return this.#tables[name] ? this.#tables[name] : name;
  }
}
