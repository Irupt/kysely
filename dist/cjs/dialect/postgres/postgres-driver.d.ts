import { DatabaseConnection, QueryResult } from '../../driver/database-connection.js';
import { Driver, TransactionSettings } from '../../driver/driver.js';
import { CompiledQuery } from '../../query-compiler/compiled-query.js';
import { PostgresCursorConstructor, PostgresDialectConfig, PostgresPoolClient } from './postgres-dialect-config.js';
declare const PRIVATE_RELEASE_METHOD: unique symbol;
export declare class PostgresDriver implements Driver {
    #private;
    constructor(config: PostgresDialectConfig);
    init(): Promise<void>;
    acquireConnection(): Promise<DatabaseConnection>;
    beginTransaction(connection: DatabaseConnection, settings: TransactionSettings): Promise<void>;
    commitTransaction(connection: DatabaseConnection): Promise<void>;
    rollbackTransaction(connection: DatabaseConnection): Promise<void>;
    releaseConnection(connection: PostgresConnection): Promise<void>;
    destroy(): Promise<void>;
}
interface PostgresConnectionOptions {
    cursor: PostgresCursorConstructor | null;
}
declare class PostgresConnection implements DatabaseConnection {
    #private;
    constructor(client: PostgresPoolClient, options: PostgresConnectionOptions);
    executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>>;
    streamQuery<O>(compiledQuery: CompiledQuery, chunkSize: number): AsyncIterableIterator<QueryResult<O>>;
    [PRIVATE_RELEASE_METHOD](): void;
}
export {};
