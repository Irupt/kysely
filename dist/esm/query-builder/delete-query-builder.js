/// <reference types="./delete-query-builder.d.ts" />
import { parseJoin, } from '../parser/join-parser.js';
import { parseTableExpressionOrList, } from '../parser/table-parser.js';
import { parseSelectArg, parseSelectAll, } from '../parser/select-parser.js';
import { QueryNode } from '../operation-node/query-node.js';
import { preventAwait } from '../util/prevent-await.js';
import { freeze } from '../util/object-utils.js';
import { isNoResultErrorConstructor, NoResultError, } from './no-result-error.js';
import { DeleteResult } from './delete-result.js';
import { DeleteQueryNode } from '../operation-node/delete-query-node.js';
import { LimitNode } from '../operation-node/limit-node.js';
import { parseOrderBy, } from '../parser/order-by-parser.js';
import { parseValueBinaryOperationOrExpression, parseReferentialBinaryOperation, } from '../parser/binary-operation-parser.js';
import { parseValueExpression, } from '../parser/value-parser.js';
export class DeleteQueryBuilder {
    #props;
    constructor(props) {
        this.#props = freeze(props);
    }
    where(...args) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args)),
        });
    }
    whereRef(lhs, op, rhs) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs)),
        });
    }
    clearWhere() {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode),
        });
    }
    using(tables) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: DeleteQueryNode.cloneWithUsing(this.#props.queryNode, parseTableExpressionOrList(tables)),
        });
    }
    innerJoin(...args) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin('InnerJoin', args)),
        });
    }
    leftJoin(...args) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin('LeftJoin', args)),
        });
    }
    rightJoin(...args) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin('RightJoin', args)),
        });
    }
    fullJoin(...args) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin('FullJoin', args)),
        });
    }
    returning(selection) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection)),
        });
    }
    returningAll(table) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table)),
        });
    }
    /**
     * Clears all `returning` clauses from the query.
     *
     * ### Examples
     *
     * ```ts
     * db.deleteFrom('pet')
     *   .returningAll()
     *   .where('name', '=', 'Max')
     *   .clearReturning()
     * ```
     *
     * The generated SQL(PostgreSQL):
     *
     * ```sql
     * delete from "pet" where "name" = "Max"
     * ```
     */
    clearReturning() {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode),
        });
    }
    /**
     * Clears the `limit` clause from the query.
     *
     * ### Examples
     *
     * ```ts
     * db.deleteFrom('pet')
     *   .returningAll()
     *   .where('name', '=', 'Max')
     *   .limit(5)
     *   .clearLimit()
     * ```
     *
     * The generated SQL(PostgreSQL):
     *
     * ```sql
     * delete from "pet" where "name" = "Max" returning *
     * ```
     */
    clearLimit() {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: DeleteQueryNode.cloneWithoutLimit(this.#props.queryNode),
        });
    }
    /**
     * Clears the `order by` clause from the query.
     *
     * ### Examples
     *
     * ```ts
     * db.deleteFrom('pet')
     *   .returningAll()
     *   .where('name', '=', 'Max')
     *   .orderBy('id')
     *   .clearOrderBy()
     * ```
     *
     * The generated SQL(PostgreSQL):
     *
     * ```sql
     * delete from "pet" where "name" = "Max" returning *
     * ```
     */
    clearOrderBy() {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: DeleteQueryNode.cloneWithoutOrderBy(this.#props.queryNode),
        });
    }
    /**
     * Adds an `order by` clause to the query.
     *
     * `orderBy` calls are additive. To order by multiple columns, call `orderBy`
     * multiple times.
     *
     * The first argument is the expression to order by and the second is the
     * order (`asc` or `desc`).
     *
     * An `order by` clause in a delete query is only supported by some dialects
     * like MySQL.
     *
     * See {@link SelectQueryBuilder.orderBy} for more examples.
     *
     * ### Examples
     *
     * Delete 5 oldest items in a table:
     *
     * ```ts
     * await db
     *   .deleteFrom('pet')
     *   .orderBy('created_at')
     *   .limit(5)
     *   .execute()
     * ```
     *
     * The generated SQL (MySQL):
     *
     * ```sql
     * delete from `pet`
     * order by `created_at`
     * limit ?
     * ```
     */
    orderBy(orderBy, direction) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: DeleteQueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy([orderBy, direction])),
        });
    }
    /**
     * Adds a limit clause to the query.
     *
     * A limit clause in a delete query is only supported by some dialects
     * like MySQL.
     *
     * ### Examples
     *
     * Delete 5 oldest items in a table:
     *
     * ```ts
     * await db
     *   .deleteFrom('pet')
     *   .orderBy('created_at')
     *   .limit(5)
     *   .execute()
     * ```
     */
    limit(limit) {
        return new DeleteQueryBuilder({
            ...this.#props,
            queryNode: DeleteQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit))),
        });
    }
    /**
     * Simply calls the provided function passing `this` as the only argument. `$call` returns
     * what the provided function returns.
     *
     * If you want to conditionally call a method on `this`, see
     * the {@link $if} method.
     *
     * ### Examples
     *
     * The next example uses a helper function `log` to log a query:
     *
     * ```ts
     * function log<T extends Compilable>(qb: T): T {
     *   console.log(qb.compile())
     *   return qb
     * }
     *
     * db.deleteFrom('person')
     *   .$call(log)
     *   .execute()
     * ```
     */
    $call(func) {
        return func(this);
    }
    /**
     * Call `func(this)` if `condition` is true.
     *
     * This method is especially handy with optional selects. Any `returning` or `returningAll`
     * method calls add columns as optional fields to the output type when called inside
     * the `func` callback. This is because we can't know if those selections were actually
     * made before running the code.
     *
     * You can also call any other methods inside the callback.
     *
     * ### Examples
     *
     * ```ts
     * async function deletePerson(id: number, returnLastName: boolean) {
     *   return await db
     *     .deleteFrom('person')
     *     .where('id', '=', id)
     *     .returning(['id', 'first_name'])
     *     .$if(returnLastName, (qb) => qb.returning('last_name'))
     *     .executeTakeFirstOrThrow()
     * }
     * ```
     *
     * Any selections added inside the `if` callback will be added as optional fields to the
     * output type since we can't know if the selections were actually made before running
     * the code. In the example above the return type of the `deletePerson` function is:
     *
     * ```ts
     * {
     *   id: number
     *   first_name: string
     *   last_name?: string
     * }
     * ```
     */
    $if(condition, func) {
        if (condition) {
            return func(this);
        }
        return new DeleteQueryBuilder({
            ...this.#props,
        });
    }
    /**
     * Change the output type of the query.
     *
     * This method call doesn't change the SQL in any way. This methods simply
     * returns a copy of this `DeleteQueryBuilder` with a new output type.
     */
    $castTo() {
        return new DeleteQueryBuilder(this.#props);
    }
    /**
     * Narrows (parts of) the output type of the query.
     *
     * Kysely tries to be as type-safe as possible, but in some cases we have to make
     * compromises for better maintainability and compilation performance. At present,
     * Kysely doesn't narrow the output type of the query when using {@link where} and {@link returning} or {@link returningAll}.
     *
     * This utility method is very useful for these situations, as it removes unncessary
     * runtime assertion/guard code. Its input type is limited to the output type
     * of the query, so you can't add a column that doesn't exist, or change a column's
     * type to something that doesn't exist in its union type.
     *
     * ### Examples
     *
     * Turn this code:
     *
     * ```ts
     * const person = await db.deleteFrom('person')
     *   .where('id', '=', id)
     *   .where('nullable_column', 'is not', null)
     *   .returningAll()
     *   .executeTakeFirstOrThrow()
     *
     * if (person.nullable_column) {
     *   functionThatExpectsPersonWithNonNullValue(person)
     * }
     * ```
     *
     * Into this:
     *
     * ```ts
     * const person = await db.deleteFrom('person')
     *   .where('id', '=', id)
     *   .where('nullable_column', 'is not', null)
     *   .returningAll()
     *   .$narrowType<{ nullable_column: string }>()
     *   .executeTakeFirstOrThrow()
     *
     * functionThatExpectsPersonWithNonNullValue(person)
     * ```
     */
    $narrowType() {
        return new DeleteQueryBuilder(this.#props);
    }
    /**
     * Asserts that query's output row type equals the given type `T`.
     *
     * This method can be used to simplify excessively complex types to make typescript happy
     * and much faster.
     *
     * Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
     * for typescript and you get errors like this:
     *
     * ```
     * error TS2589: Type instantiation is excessively deep and possibly infinite.
     * ```
     *
     * In these case you can often use this method to help typescript a little bit. When you use this
     * method to assert the output type of a query, Kysely can drop the complex output type that
     * consists of multiple nested helper types and replace it with the simple asserted type.
     *
     * Using this method doesn't reduce type safety at all. You have to pass in a type that is
     * structurally equal to the current type.
     *
     * ### Examples
     *
     * ```ts
     * const result = await db
     *   .with('deleted_person', (qb) => qb
     *     .deleteFrom('person')
     *     .where('id', '=', person.id)
     *     .returning('first_name')
     *     .$assertType<{ first_name: string }>()
     *   )
     *   .with('deleted_pet', (qb) => qb
     *     .deleteFrom('pet')
     *     .where('owner_id', '=', person.id)
     *     .returning(['name as pet_name', 'species'])
     *     .$assertType<{ pet_name: string, species: Species }>()
     *   )
     *   .selectFrom(['deleted_person', 'deleted_pet'])
     *   .selectAll()
     *   .executeTakeFirstOrThrow()
     * ```
     */
    $assertType() {
        return new DeleteQueryBuilder(this.#props);
    }
    /**
     * Returns a copy of this DeleteQueryBuilder instance with the given plugin installed.
     */
    withPlugin(plugin) {
        return new DeleteQueryBuilder({
            ...this.#props,
            executor: this.#props.executor.withPlugin(plugin),
        });
    }
    toOperationNode() {
        return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
    }
    compile() {
        return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
    }
    /**
     * Executes the query and returns an array of rows.
     *
     * Also see the {@link executeTakeFirst} and {@link executeTakeFirstOrThrow} methods.
     */
    async execute() {
        const compiledQuery = this.compile();
        const query = compiledQuery.query;
        const result = await this.#props.executor.executeQuery(compiledQuery, this.#props.queryId);
        if (this.#props.executor.adapter.supportsReturning && query.returning) {
            return result.rows;
        }
        return [
            new DeleteResult(
            // TODO: remove numUpdatedOrDeletedRows.
            result.numAffectedRows ?? result.numUpdatedOrDeletedRows ?? BigInt(0)),
        ];
    }
    /**
     * Executes the query and returns the first result or undefined if
     * the query returned no result.
     */
    async executeTakeFirst() {
        const [result] = await this.execute();
        return result;
    }
    /**
     * Executes the query and returns the first result or throws if
     * the query returned no result.
     *
     * By default an instance of {@link NoResultError} is thrown, but you can
     * provide a custom error class, or callback as the only argument to throw a different
     * error.
     */
    async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
        const result = await this.executeTakeFirst();
        if (result === undefined) {
            const error = isNoResultErrorConstructor(errorConstructor)
                ? new errorConstructor(this.toOperationNode())
                : errorConstructor(this.toOperationNode());
            throw error;
        }
        return result;
    }
    async *stream(chunkSize = 100) {
        const compiledQuery = this.compile();
        const stream = this.#props.executor.stream(compiledQuery, chunkSize, this.#props.queryId);
        for await (const item of stream) {
            yield* item.rows;
        }
    }
    async explain(format, options) {
        const builder = new DeleteQueryBuilder({
            ...this.#props,
            queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options),
        });
        return await builder.execute();
    }
}
preventAwait(DeleteQueryBuilder, "don't await DeleteQueryBuilder instances directly. To execute the query you need to call `execute` or `executeTakeFirst`.");
