import { JoinNode, JoinType } from '../operation-node/join-node.js';
import { AnyColumn, AnyColumnWithTable, DrainOuterGeneric } from '../util/type-utils.js';
import { From, FromTables } from './table-parser.js';
import { JoinBuilder } from '../query-builder/join-builder.js';
export type JoinReferenceExpression<DB, TB extends keyof DB, TE> = DrainOuterGeneric<AnyJoinColumn<DB, TB, TE> | AnyJoinColumnWithTable<DB, TB, TE>>;
export type JoinCallbackExpression<DB, TB extends keyof DB, TE> = (join: JoinBuilder<From<DB, TE>, FromTables<DB, TB, TE>>) => JoinBuilder<any, any>;
type AnyJoinColumn<DB, TB extends keyof DB, TE> = AnyColumn<From<DB, TE>, FromTables<DB, TB, TE>>;
type AnyJoinColumnWithTable<DB, TB extends keyof DB, TE> = AnyColumnWithTable<From<DB, TE>, FromTables<DB, TB, TE>>;
export declare function parseJoin(joinType: JoinType, args: any[]): JoinNode;
export {};
