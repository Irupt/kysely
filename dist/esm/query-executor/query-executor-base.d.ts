import { ConnectionProvider } from '../driver/connection-provider.js';
import { DatabaseConnection, QueryResult } from '../driver/database-connection.js';
import { CompiledQuery } from '../query-compiler/compiled-query.js';
import { RootOperationNode } from '../query-compiler/query-compiler.js';
import { KyselyPlugin } from '../plugin/kysely-plugin.js';
import { QueryId } from '../util/query-id.js';
import { DialectAdapter } from '../dialect/dialect-adapter.js';
import { QueryExecutor } from './query-executor.js';
export declare abstract class QueryExecutorBase implements QueryExecutor {
    #private;
    constructor(plugins?: ReadonlyArray<KyselyPlugin>);
    abstract get adapter(): DialectAdapter;
    get plugins(): ReadonlyArray<KyselyPlugin>;
    transformQuery<T extends RootOperationNode>(node: T, queryId: QueryId): T;
    abstract compileQuery(node: RootOperationNode, queryId: QueryId): CompiledQuery;
    abstract provideConnection<T>(consumer: (connection: DatabaseConnection) => Promise<T>): Promise<T>;
    executeQuery<R>(compiledQuery: CompiledQuery, queryId: QueryId): Promise<QueryResult<R>>;
    stream<R>(compiledQuery: CompiledQuery, chunkSize: number, queryId: QueryId): AsyncIterableIterator<QueryResult<R>>;
    abstract withConnectionProvider(connectionProvider: ConnectionProvider): QueryExecutorBase;
    abstract withPlugin(plugin: KyselyPlugin): QueryExecutorBase;
    abstract withPlugins(plugin: ReadonlyArray<KyselyPlugin>): QueryExecutorBase;
    abstract withPluginAtFront(plugin: KyselyPlugin): QueryExecutorBase;
    abstract withoutPlugins(): QueryExecutorBase;
}
