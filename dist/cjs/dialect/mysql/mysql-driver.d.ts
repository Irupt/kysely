import { DatabaseConnection, QueryResult } from '../../driver/database-connection.js';
import { Driver, TransactionSettings } from '../../driver/driver.js';
import { CompiledQuery } from '../../query-compiler/compiled-query.js';
import { MysqlDialectConfig, MysqlPoolConnection } from './mysql-dialect-config.js';
declare const PRIVATE_RELEASE_METHOD: unique symbol;
export declare class MysqlDriver implements Driver {
    #private;
    constructor(configOrPool: MysqlDialectConfig);
    init(): Promise<void>;
    acquireConnection(): Promise<DatabaseConnection>;
    beginTransaction(connection: DatabaseConnection, settings: TransactionSettings): Promise<void>;
    commitTransaction(connection: DatabaseConnection): Promise<void>;
    rollbackTransaction(connection: DatabaseConnection): Promise<void>;
    releaseConnection(connection: MysqlConnection): Promise<void>;
    destroy(): Promise<void>;
}
declare class MysqlConnection implements DatabaseConnection {
    #private;
    constructor(rawConnection: MysqlPoolConnection);
    executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>>;
    streamQuery<O>(compiledQuery: CompiledQuery, _chunkSize: number): AsyncIterableIterator<QueryResult<O>>;
    [PRIVATE_RELEASE_METHOD](): void;
}
export {};
