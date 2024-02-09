import { DatabaseConnection } from '../../driver/database-connection.js';
import { Driver } from '../../driver/driver.js';
import { SqliteDialectConfig } from './sqlite-dialect-config.js';
export declare class SqliteDriver implements Driver {
    #private;
    constructor(config: SqliteDialectConfig);
    init(): Promise<void>;
    acquireConnection(): Promise<DatabaseConnection>;
    beginTransaction(connection: DatabaseConnection): Promise<void>;
    commitTransaction(connection: DatabaseConnection): Promise<void>;
    rollbackTransaction(connection: DatabaseConnection): Promise<void>;
    releaseConnection(): Promise<void>;
    destroy(): Promise<void>;
}
