import { QueryResult } from '../../driver/database-connection.js';
import { RootOperationNode } from '../../query-compiler/query-compiler.js';
import { UnknownRow } from '../../util/type-utils.js';
import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs } from '../kysely-plugin.js';
/**
 * Parses JSON strings in query results into JSON objects.
 *
 * This plugin can be useful with dialects that don't automatically parse
 * JSON into objects and arrays but return JSON strings instead.
 *
 * ```ts
 * const db = new Kysely<DB>({
 *   ...
 *   plugins: [new ParseJSONResultsPlugin()]
 * })
 * ```
 */
export declare class ParseJSONResultsPlugin implements KyselyPlugin {
    transformQuery(args: PluginTransformQueryArgs): RootOperationNode;
    transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>>;
}
