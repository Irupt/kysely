"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresIntrospector = void 0;
const migrator_js_1 = require("../../migration/migrator.js");
const object_utils_js_1 = require("../../util/object-utils.js");
const sql_js_1 = require("../../raw-builder/sql.js");
class PostgresIntrospector {
    #db;
    constructor(db) {
        this.#db = db;
    }
    async getSchemas() {
        let rawSchemas = await this.#db
            .selectFrom('pg_catalog.pg_namespace')
            .select('nspname')
            .$castTo()
            .execute();
        return rawSchemas.map((it) => ({ name: it.nspname }));
    }
    async getTables(options = { withInternalKyselyTables: false }) {
        let query = this.#db
            // column
            .selectFrom('pg_catalog.pg_attribute as a')
            // table
            .innerJoin('pg_catalog.pg_class as c', 'a.attrelid', 'c.oid')
            // table schema
            .innerJoin('pg_catalog.pg_namespace as ns', 'c.relnamespace', 'ns.oid')
            // column data type
            .innerJoin('pg_catalog.pg_type as typ', 'a.atttypid', 'typ.oid')
            // column data type schema
            .innerJoin('pg_catalog.pg_namespace as dtns', 'typ.typnamespace', 'dtns.oid')
            .select([
            'a.attname as column',
            'a.attnotnull as not_null',
            'a.atthasdef as has_default',
            'c.relname as table',
            'c.relkind as table_type',
            'ns.nspname as schema',
            'typ.typname as type',
            'dtns.nspname as type_schema',
            (0, sql_js_1.sql) `col_description(a.attrelid, a.attnum)`.as('column_description'),
            // Detect if the column is auto incrementing by finding the sequence
            // that is created for `serial` and `bigserial` columns.
            this.#db
                .selectFrom('pg_class')
                .select((0, sql_js_1.sql) `true`.as('auto_incrementing'))
                // Make sure the sequence is in the same schema as the table.
                .whereRef('relnamespace', '=', 'c.relnamespace')
                .where('relkind', '=', 'S')
                .where('relname', '=', (0, sql_js_1.sql) `c.relname || '_' || a.attname || '_seq'`)
                .as('auto_incrementing'),
        ])
            // r == normal table
            .where((eb) => eb.or([eb('c.relkind', '=', 'r'), eb('c.relkind', '=', 'v')]))
            .where('ns.nspname', '!~', '^pg_')
            .where('ns.nspname', '!=', 'information_schema')
            // No system columns
            .where('a.attnum', '>=', 0)
            .where('a.attisdropped', '!=', true)
            .orderBy('ns.nspname')
            .orderBy('c.relname')
            .orderBy('a.attnum')
            .$castTo();
        if (!options.withInternalKyselyTables) {
            query = query
                .where('c.relname', '!=', migrator_js_1.DEFAULT_MIGRATION_TABLE)
                .where('c.relname', '!=', migrator_js_1.DEFAULT_MIGRATION_LOCK_TABLE);
        }
        const rawColumns = await query.execute();
        return this.#parseTableMetadata(rawColumns);
    }
    async getMetadata(options) {
        return {
            tables: await this.getTables(options),
        };
    }
    #parseTableMetadata(columns) {
        return columns.reduce((tables, it) => {
            let table = tables.find((tbl) => tbl.name === it.table && tbl.schema === it.schema);
            if (!table) {
                table = (0, object_utils_js_1.freeze)({
                    name: it.table,
                    isView: it.table_type === 'v',
                    schema: it.schema,
                    columns: [],
                });
                tables.push(table);
            }
            table.columns.push((0, object_utils_js_1.freeze)({
                name: it.column,
                dataType: it.type,
                dataTypeSchema: it.type_schema,
                isNullable: !it.not_null,
                isAutoIncrementing: !!it.auto_incrementing,
                hasDefaultValue: it.has_default,
                comment: it.column_description ?? undefined,
            }));
            return tables;
        }, []);
    }
}
exports.PostgresIntrospector = PostgresIntrospector;
