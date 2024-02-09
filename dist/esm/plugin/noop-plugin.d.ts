import { QueryResult } from '../driver/database-connection.js';
import { RootOperationNode } from '../query-compiler/query-compiler.js';
import { UnknownRow } from '../util/type-utils.js';
import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs } from './kysely-plugin.js';
export declare class NoopPlugin implements KyselyPlugin {
    transformQuery(args: PluginTransformQueryArgs): RootOperationNode;
    transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>>;
}
