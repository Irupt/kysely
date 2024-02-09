import { DatabaseConnection } from './database-connection.js';
import { ConnectionProvider } from './connection-provider.js';
import { Driver } from './driver.js';
export declare class DefaultConnectionProvider implements ConnectionProvider {
    #private;
    constructor(driver: Driver);
    provideConnection<T>(consumer: (connection: DatabaseConnection) => Promise<T>): Promise<T>;
}
