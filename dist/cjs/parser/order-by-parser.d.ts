import { Expression } from '../expression/expression.js';
import { OrderByItemNode } from '../operation-node/order-by-item-node.js';
import { StringReference } from './reference-parser.js';
import { ReferenceExpression } from './reference-parser.js';
export type OrderByDirection = 'asc' | 'desc';
export declare function isOrderByDirection(thing: unknown): thing is OrderByDirection;
export type DirectedOrderByStringReference<DB, TB extends keyof DB, O> = `${StringReference<DB, TB> | (keyof O & string)} ${OrderByDirection}`;
export type UndirectedOrderByExpression<DB, TB extends keyof DB, O> = ReferenceExpression<DB, TB> | (keyof O & string);
export type OrderByExpression<DB, TB extends keyof DB, O> = UndirectedOrderByExpression<DB, TB, O> | DirectedOrderByStringReference<DB, TB, O>;
export type OrderByDirectionExpression = OrderByDirection | Expression<any>;
export declare function parseOrderBy(args: any[]): OrderByItemNode[];
export declare function parseOrderByItem(ref: ReferenceExpression<any, any>, direction?: OrderByDirectionExpression): OrderByItemNode;
