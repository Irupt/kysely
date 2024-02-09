//import { type KyselyPlugin, type PluginTransformQueryArgs, type PluginTransformResultArgs } from 'kysely';

import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs } from '../kysely-plugin';
import { TablePrefixOperationNodeTransformer, TablePrefixOperationNodeTransformerOptions } from './transformer';
//import { TablePrefixOperationNodeTransformer, type TablePrefixOperationNodeTransformerOptions } from './transformers';

export type TablePrefixPluginOptions = TablePrefixOperationNodeTransformerOptions;

export class TableGocPlugin implements KyselyPlugin {
  readonly #prefixTransformer: TablePrefixOperationNodeTransformer;

  constructor(options: TablePrefixPluginOptions) {
    this.#prefixTransformer = new TablePrefixOperationNodeTransformer(options);
  }

  transformQuery(args: PluginTransformQueryArgs) {
    return this.#prefixTransformer.transformNode(args.node);
  }

  async transformResult(args: PluginTransformResultArgs) {
    return args.result;
  }
}
