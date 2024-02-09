import { Log } from '../util/log.js';
import { DatabaseConnection } from './database-connection.js';
import { Driver, TransactionSettings } from './driver.js';
/**
 * A small wrapper around {@link Driver} that makes sure the driver is
 * initialized before it is used, only initialized and destroyed
 * once etc.
 */
export declare class RuntimeDriver implements Driver {
    #private;
    constructor(driver: Driver, log: Log);
    init(): Promise<void>;
    acquireConnection(): Promise<DatabaseConnection>;
    releaseConnection(connection: DatabaseConnection): Promise<void>;
    beginTransaction(connection: DatabaseConnection, settings: TransactionSettings): Promise<void>;
    commitTransaction(connection: DatabaseConnection): Promise<void>;
    rollbackTransaction(connection: DatabaseConnection): Promise<void>;
    destroy(): Promise<void>;
}
