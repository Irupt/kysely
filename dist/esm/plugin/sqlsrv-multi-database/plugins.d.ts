import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs } from '../kysely-plugin';
import { TablePrefixOperationNodeTransformerOptions } from './transformer';
export type TablePrefixPluginOptions = TablePrefixOperationNodeTransformerOptions;
export declare class TableGocPlugin implements KyselyPlugin {
    #private;
    constructor(options: TablePrefixPluginOptions);
    transformQuery(args: PluginTransformQueryArgs): import("../..").RootOperationNode;
    transformResult(args: PluginTransformResultArgs): Promise<import("../..").QueryResult<import("../..").UnknownRow>>;
}
