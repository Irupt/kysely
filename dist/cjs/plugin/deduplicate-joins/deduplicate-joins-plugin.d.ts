import { QueryResult } from '../../driver/database-connection.js';
import { RootOperationNode } from '../../query-compiler/query-compiler.js';
import { UnknownRow } from '../../util/type-utils.js';
import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs } from '../kysely-plugin.js';
/**
 * Plugin that removes duplicate joins from queries.
 *
 * See [this recipe](https://github.com/koskimas/kysely/tree/master/site/docs/recipes/deduplicate-joins.md)
 */
export declare class DeduplicateJoinsPlugin implements KyselyPlugin {
    #private;
    transformQuery(args: PluginTransformQueryArgs): RootOperationNode;
    transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>>;
}
