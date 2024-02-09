import { DatabaseConnection } from './database-connection.js';
import { ConnectionProvider } from './connection-provider.js';
export declare class SingleConnectionProvider implements ConnectionProvider {
    #private;
    constructor(connection: DatabaseConnection);
    provideConnection<T>(consumer: (connection: DatabaseConnection) => Promise<T>): Promise<T>;
}
