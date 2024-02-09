import { Kysely } from '../../kysely.js';
import { DatabaseIntrospector, DatabaseMetadata, DatabaseMetadataOptions, SchemaMetadata, TableMetadata } from '../database-introspector.js';
export declare class MssqlIntrospector implements DatabaseIntrospector {
    #private;
    constructor(db: Kysely<any>);
    getSchemas(): Promise<SchemaMetadata[]>;
    getTables(options?: DatabaseMetadataOptions): Promise<TableMetadata[]>;
    getMetadata(options?: DatabaseMetadataOptions): Promise<DatabaseMetadata>;
}
