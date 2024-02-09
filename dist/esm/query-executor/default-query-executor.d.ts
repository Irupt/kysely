import { ConnectionProvider } from '../driver/connection-provider.js';
import { DatabaseConnection } from '../driver/database-connection.js';
import { CompiledQuery } from '../query-compiler/compiled-query.js';
import { RootOperationNode, QueryCompiler } from '../query-compiler/query-compiler.js';
import { KyselyPlugin } from '../plugin/kysely-plugin.js';
import { QueryExecutorBase } from './query-executor-base.js';
import { DialectAdapter } from '../dialect/dialect-adapter.js';
export declare class DefaultQueryExecutor extends QueryExecutorBase {
    #private;
    constructor(compiler: QueryCompiler, adapter: DialectAdapter, connectionProvider: ConnectionProvider, plugins?: KyselyPlugin[]);
    get adapter(): DialectAdapter;
    compileQuery(node: RootOperationNode): CompiledQuery;
    provideConnection<T>(consumer: (connection: DatabaseConnection) => Promise<T>): Promise<T>;
    withPlugins(plugins: ReadonlyArray<KyselyPlugin>): DefaultQueryExecutor;
    withPlugin(plugin: KyselyPlugin): DefaultQueryExecutor;
    withPluginAtFront(plugin: KyselyPlugin): DefaultQueryExecutor;
    withConnectionProvider(connectionProvider: ConnectionProvider): DefaultQueryExecutor;
    withoutPlugins(): DefaultQueryExecutor;
}
