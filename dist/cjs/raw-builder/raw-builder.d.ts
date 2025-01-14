import { QueryResult } from '../driver/database-connection.js';
import { RawNode } from '../operation-node/raw-node.js';
import { CompiledQuery } from '../query-compiler/compiled-query.js';
import { KyselyPlugin } from '../plugin/kysely-plugin.js';
import { QueryExecutorProvider } from '../query-executor/query-executor-provider.js';
import { QueryId } from '../util/query-id.js';
import { AliasableExpression, AliasedExpression, Expression } from '../expression/expression.js';
/**
 * An instance of this class can be used to create raw SQL snippets or queries.
 *
 * You shouldn't need to create `RawBuilder` instances directly. Instead you should
 * use the {@link sql} template tag.
 */
export interface RawBuilder<O> extends AliasableExpression<O> {
    get isRawBuilder(): true;
    /**
     * Returns an aliased version of the SQL expression.
     *
     * In addition to slapping `as "the_alias"` to the end of the SQL,
     * this method also provides strict typing:
     *
     * ```ts
     * const result = await db
     *   .selectFrom('person')
     *   .select(
     *     sql<string>`concat(first_name, ' ', last_name)`.as('full_name')
     *   )
     *   .executeTakeFirstOrThrow()
     *
     * // `full_name: string` field exists in the result type.
     * console.log(result.full_name)
     * ```
     *
     * The generated SQL (PostgreSQL):
     *
     * ```ts
     * select concat(first_name, ' ', last_name) as "full_name"
     * from "person"
     * ```
     *
     * You can also pass in a raw SQL snippet but in that case you must
     * provide the alias as the only type argument:
     *
     * ```ts
     * const values = sql<{ a: number, b: string }>`(values (1, 'foo'))`
     *
     * // The alias is `t(a, b)` which specifies the column names
     * // in addition to the table name. We must tell kysely that
     * // columns of the table can be referenced through `t`
     * // by providing an explicit type argument.
     * const aliasedValues = values.as<'t'>(sql`t(a, b)`)
     *
     * await db
     *   .insertInto('person')
     *   .columns(['first_name', 'last_name'])
     *   .expression(
     *     db.selectFrom(aliasedValues).select(['t.a', 't.b'])
     *   )
     * ```
     *
     * The generated SQL (PostgreSQL):
     *
     * ```ts
     * insert into "person" ("first_name", "last_name")
     * from (values (1, 'foo')) as t(a, b)
     * select "t"."a", "t"."b"
     * ```
     */
    as<A extends string>(alias: A): AliasedRawBuilder<O, A>;
    as<A extends string>(alias: Expression<any>): AliasedRawBuilder<O, A>;
    /**
     * Change the output type of the raw expression.
     *
     * This method call doesn't change the SQL in any way. This methods simply
     * returns a copy of this `RawBuilder` with a new output type.
     */
    $castTo<C>(): RawBuilder<C>;
    /**
     * Omit null from the expression's type.
     *
     * This function can be useful in cases where you know an expression can't be
     * null, but Kysely is unable to infer it.
     *
     * This method call doesn't change the SQL in any way. This methods simply
     * returns a copy of `this` with a new output type.
     */
    $notNull(): RawBuilder<Exclude<O, null>>;
    /**
     * Adds a plugin for this SQL snippet.
     */
    withPlugin(plugin: KyselyPlugin): RawBuilder<O>;
    /**
     * Compiles the builder to a `CompiledQuery`.
     *
     * ### Examples
     *
     * ```ts
     * const { sql } = sql`select * from ${sql.table('person')}`.compile(db)
     * console.log(sql)
     * ```
     */
    compile(executorProvider: QueryExecutorProvider): CompiledQuery<O>;
    /**
     * Executes the raw query.
     *
     * ### Examples
     *
     * ```ts
     * const result = await sql`select * from ${sql.table('person')}`.execute(db)
     * ```
     */
    execute(executorProvider: QueryExecutorProvider): Promise<QueryResult<O>>;
    toOperationNode(): RawNode;
}
export interface RawBuilderProps {
    readonly queryId: QueryId;
    readonly rawNode: RawNode;
    readonly plugins?: ReadonlyArray<KyselyPlugin>;
}
export declare function createRawBuilder<O>(props: RawBuilderProps): RawBuilder<O>;
/**
 * {@link RawBuilder} with an alias. The result of calling {@link RawBuilder.as}.
 */
export interface AliasedRawBuilder<O = unknown, A extends string = never> extends AliasedExpression<O, A> {
    get rawBuilder(): RawBuilder<O>;
}
