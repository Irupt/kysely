import { BinaryOperationNode } from '../operation-node/binary-operation-node.js';
import { OperationNodeSource } from '../operation-node/operation-node-source.js';
import { ComparisonOperator, BinaryOperator, Operator } from '../operation-node/operator-node.js';
import { ExtractTypeFromReferenceExpression, ExtractTypeFromStringReference, ReferenceExpression, StringReference } from './reference-parser.js';
import { ValueExpression, ValueExpressionOrList } from './value-parser.js';
import { OperationNode } from '../operation-node/operation-node.js';
import { Expression } from '../expression/expression.js';
import { SelectType } from '../util/column-type.js';
export type OperandValueExpression<DB, TB extends keyof DB, RE> = ValueExpression<DB, TB, ExtractTypeFromReferenceExpression<DB, TB, RE>>;
export type OperandValueExpressionOrList<DB, TB extends keyof DB, RE> = ValueExpressionOrList<DB, TB, ExtractTypeFromReferenceExpression<DB, TB, RE> | null>;
export type OperatorExpression = Operator | Expression<unknown>;
export type BinaryOperatorExpression = BinaryOperator | Expression<unknown>;
export type ComparisonOperatorExpression = ComparisonOperator | Expression<unknown>;
export type FilterObject<DB, TB extends keyof DB> = {
    [R in StringReference<DB, TB>]?: ValueExpressionOrList<DB, TB, SelectType<ExtractTypeFromStringReference<DB, TB, R>>>;
};
export declare function parseValueBinaryOperationOrExpression(args: any[]): OperationNode;
export declare function parseValueBinaryOperation(left: ReferenceExpression<any, any>, operator: BinaryOperatorExpression, right: OperandValueExpressionOrList<any, any, any>): BinaryOperationNode;
export declare function parseReferentialBinaryOperation(left: ReferenceExpression<any, any>, operator: BinaryOperatorExpression, right: OperandValueExpressionOrList<any, any, any>): BinaryOperationNode;
export declare function parseFilterObject(obj: Readonly<FilterObject<any, any>>, combinator: 'and' | 'or'): OperationNode;
export declare function parseFilterList(list: ReadonlyArray<OperationNodeSource | OperationNode>, combinator: 'and' | 'or', withParens?: boolean): OperationNode;
