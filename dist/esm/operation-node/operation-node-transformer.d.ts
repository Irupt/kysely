import { AliasNode } from './alias-node.js';
import { ColumnNode } from './column-node.js';
import { IdentifierNode } from './identifier-node.js';
import { OperationNode } from './operation-node.js';
import { ReferenceNode } from './reference-node.js';
import { SelectAllNode } from './select-all-node.js';
import { SelectionNode } from './selection-node.js';
import { TableNode } from './table-node.js';
import { AndNode } from './and-node.js';
import { JoinNode } from './join-node.js';
import { OrNode } from './or-node.js';
import { ParensNode } from './parens-node.js';
import { PrimitiveValueListNode } from './primitive-value-list-node.js';
import { RawNode } from './raw-node.js';
import { SelectQueryNode } from './select-query-node.js';
import { ValueListNode } from './value-list-node.js';
import { ValueNode } from './value-node.js';
import { OperatorNode } from './operator-node.js';
import { FromNode } from './from-node.js';
import { WhereNode } from './where-node.js';
import { InsertQueryNode } from './insert-query-node.js';
import { DeleteQueryNode } from './delete-query-node.js';
import { ReturningNode } from './returning-node.js';
import { CreateTableNode } from './create-table-node.js';
import { AddColumnNode } from './add-column-node.js';
import { DropTableNode } from './drop-table-node.js';
import { DataTypeNode } from './data-type-node.js';
import { OrderByNode } from './order-by-node.js';
import { OrderByItemNode } from './order-by-item-node.js';
import { GroupByNode } from './group-by-node.js';
import { GroupByItemNode } from './group-by-item-node.js';
import { UpdateQueryNode } from './update-query-node.js';
import { ColumnUpdateNode } from './column-update-node.js';
import { LimitNode } from './limit-node.js';
import { OffsetNode } from './offset-node.js';
import { OnConflictNode } from './on-conflict-node.js';
import { CreateIndexNode } from './create-index-node.js';
import { ListNode } from './list-node.js';
import { DropIndexNode } from './drop-index-node.js';
import { PrimaryKeyConstraintNode } from './primary-constraint-node.js';
import { UniqueConstraintNode } from './unique-constraint-node.js';
import { ReferencesNode } from './references-node.js';
import { CheckConstraintNode } from './check-constraint-node.js';
import { WithNode } from './with-node.js';
import { CommonTableExpressionNode } from './common-table-expression-node.js';
import { CommonTableExpressionNameNode } from './common-table-expression-name-node.js';
import { HavingNode } from './having-node.js';
import { CreateSchemaNode } from './create-schema-node.js';
import { DropSchemaNode } from './drop-schema-node.js';
import { AlterTableNode } from './alter-table-node.js';
import { DropColumnNode } from './drop-column-node.js';
import { RenameColumnNode } from './rename-column-node.js';
import { AlterColumnNode } from './alter-column-node.js';
import { AddConstraintNode } from './add-constraint-node.js';
import { DropConstraintNode } from './drop-constraint-node.js';
import { ForeignKeyConstraintNode } from './foreign-key-constraint-node.js';
import { ColumnDefinitionNode } from './column-definition-node.js';
import { ModifyColumnNode } from './modify-column-node.js';
import { OnDuplicateKeyNode } from './on-duplicate-key-node.js';
import { CreateViewNode } from './create-view-node.js';
import { DropViewNode } from './drop-view-node.js';
import { GeneratedNode } from './generated-node.js';
import { DefaultValueNode } from './default-value-node.js';
import { OnNode } from './on-node.js';
import { ValuesNode } from './values-node.js';
import { SelectModifierNode } from './select-modifier-node.js';
import { CreateTypeNode } from './create-type-node.js';
import { DropTypeNode } from './drop-type-node.js';
import { ExplainNode } from './explain-node.js';
import { SchemableIdentifierNode } from './schemable-identifier-node.js';
import { DefaultInsertValueNode } from './default-insert-value-node.js';
import { AggregateFunctionNode } from './aggregate-function-node.js';
import { OverNode } from './over-node.js';
import { PartitionByNode } from './partition-by-node.js';
import { PartitionByItemNode } from './partition-by-item-node.js';
import { SetOperationNode } from './set-operation-node.js';
import { BinaryOperationNode } from './binary-operation-node.js';
import { UnaryOperationNode } from './unary-operation-node.js';
import { UsingNode } from './using-node.js';
import { FunctionNode } from './function-node.js';
import { CaseNode } from './case-node.js';
import { WhenNode } from './when-node.js';
import { JSONReferenceNode } from './json-reference-node.js';
import { JSONPathNode } from './json-path-node.js';
import { JSONPathLegNode } from './json-path-leg-node.js';
import { JSONOperatorChainNode } from './json-operator-chain-node.js';
import { TupleNode } from './tuple-node.js';
import { MergeQueryNode } from './merge-query-node.js';
import { MatchedNode } from './matched-node.js';
import { AddIndexNode } from './add-index-node.js';
import { CastNode } from './cast-node.js';
/**
 * Transforms an operation node tree into another one.
 *
 * Kysely queries are expressed internally as a tree of objects (operation nodes).
 * `OperationNodeTransformer` takes such a tree as its input and returns a
 * transformed deep copy of it. By default the `OperationNodeTransformer`
 * does nothing. You need to override one or more methods to make it do
 * something.
 *
 * There's a method for each node type. For example if you'd like to convert
 * each identifier (table name, column name, alias etc.) from camelCase to
 * snake_case, you'd do something like this:
 *
 * ```ts
 * class CamelCaseTransformer extends OperationNodeTransformer {
 *   transformIdentifier(node: IdentifierNode): IdentifierNode {
 *     node = super.transformIdentifier(node),
 *
 *     return {
 *       ...node,
 *       name: snakeCase(node.name),
 *     }
 *   }
 * }
 *
 * const transformer = new CamelCaseTransformer()
 * const tree = transformer.transformNode(tree)
 * ```
 */
export declare class OperationNodeTransformer {
    #private;
    protected readonly nodeStack: OperationNode[];
    transformNode<T extends OperationNode | undefined>(node: T): T;
    protected transformNodeImpl<T extends OperationNode>(node: T): T;
    protected transformNodeList<T extends ReadonlyArray<OperationNode> | undefined>(list: T): T;
    protected transformSelectQuery(node: SelectQueryNode): SelectQueryNode;
    protected transformSelection(node: SelectionNode): SelectionNode;
    protected transformColumn(node: ColumnNode): ColumnNode;
    protected transformAlias(node: AliasNode): AliasNode;
    protected transformTable(node: TableNode): TableNode;
    protected transformFrom(node: FromNode): FromNode;
    protected transformReference(node: ReferenceNode): ReferenceNode;
    protected transformAnd(node: AndNode): AndNode;
    protected transformOr(node: OrNode): OrNode;
    protected transformValueList(node: ValueListNode): ValueListNode;
    protected transformParens(node: ParensNode): ParensNode;
    protected transformJoin(node: JoinNode): JoinNode;
    protected transformRaw(node: RawNode): RawNode;
    protected transformWhere(node: WhereNode): WhereNode;
    protected transformInsertQuery(node: InsertQueryNode): InsertQueryNode;
    protected transformValues(node: ValuesNode): ValuesNode;
    protected transformDeleteQuery(node: DeleteQueryNode): DeleteQueryNode;
    protected transformReturning(node: ReturningNode): ReturningNode;
    protected transformCreateTable(node: CreateTableNode): CreateTableNode;
    protected transformColumnDefinition(node: ColumnDefinitionNode): ColumnDefinitionNode;
    protected transformAddColumn(node: AddColumnNode): AddColumnNode;
    protected transformDropTable(node: DropTableNode): DropTableNode;
    protected transformOrderBy(node: OrderByNode): OrderByNode;
    protected transformOrderByItem(node: OrderByItemNode): OrderByItemNode;
    protected transformGroupBy(node: GroupByNode): GroupByNode;
    protected transformGroupByItem(node: GroupByItemNode): GroupByItemNode;
    protected transformUpdateQuery(node: UpdateQueryNode): UpdateQueryNode;
    protected transformColumnUpdate(node: ColumnUpdateNode): ColumnUpdateNode;
    protected transformLimit(node: LimitNode): LimitNode;
    protected transformOffset(node: OffsetNode): OffsetNode;
    protected transformOnConflict(node: OnConflictNode): OnConflictNode;
    protected transformOnDuplicateKey(node: OnDuplicateKeyNode): OnDuplicateKeyNode;
    protected transformCreateIndex(node: CreateIndexNode): CreateIndexNode;
    protected transformList(node: ListNode): ListNode;
    protected transformDropIndex(node: DropIndexNode): DropIndexNode;
    protected transformPrimaryKeyConstraint(node: PrimaryKeyConstraintNode): PrimaryKeyConstraintNode;
    protected transformUniqueConstraint(node: UniqueConstraintNode): UniqueConstraintNode;
    protected transformForeignKeyConstraint(node: ForeignKeyConstraintNode): ForeignKeyConstraintNode;
    protected transformSetOperation(node: SetOperationNode): SetOperationNode;
    protected transformReferences(node: ReferencesNode): ReferencesNode;
    protected transformCheckConstraint(node: CheckConstraintNode): CheckConstraintNode;
    protected transformWith(node: WithNode): WithNode;
    protected transformCommonTableExpression(node: CommonTableExpressionNode): CommonTableExpressionNode;
    protected transformCommonTableExpressionName(node: CommonTableExpressionNameNode): CommonTableExpressionNameNode;
    protected transformHaving(node: HavingNode): HavingNode;
    protected transformCreateSchema(node: CreateSchemaNode): CreateSchemaNode;
    protected transformDropSchema(node: DropSchemaNode): DropSchemaNode;
    protected transformAlterTable(node: AlterTableNode): AlterTableNode;
    protected transformDropColumn(node: DropColumnNode): DropColumnNode;
    protected transformRenameColumn(node: RenameColumnNode): RenameColumnNode;
    protected transformAlterColumn(node: AlterColumnNode): AlterColumnNode;
    protected transformModifyColumn(node: ModifyColumnNode): ModifyColumnNode;
    protected transformAddConstraint(node: AddConstraintNode): AddConstraintNode;
    protected transformDropConstraint(node: DropConstraintNode): DropConstraintNode;
    protected transformCreateView(node: CreateViewNode): CreateViewNode;
    protected transformDropView(node: DropViewNode): DropViewNode;
    protected transformGenerated(node: GeneratedNode): GeneratedNode;
    protected transformDefaultValue(node: DefaultValueNode): DefaultValueNode;
    protected transformOn(node: OnNode): OnNode;
    protected transformSelectModifier(node: SelectModifierNode): SelectModifierNode;
    protected transformCreateType(node: CreateTypeNode): CreateTypeNode;
    protected transformDropType(node: DropTypeNode): DropTypeNode;
    protected transformExplain(node: ExplainNode): ExplainNode;
    protected transformSchemableIdentifier(node: SchemableIdentifierNode): SchemableIdentifierNode;
    protected transformAggregateFunction(node: AggregateFunctionNode): AggregateFunctionNode;
    protected transformOver(node: OverNode): OverNode;
    protected transformPartitionBy(node: PartitionByNode): PartitionByNode;
    protected transformPartitionByItem(node: PartitionByItemNode): PartitionByItemNode;
    protected transformBinaryOperation(node: BinaryOperationNode): BinaryOperationNode;
    protected transformUnaryOperation(node: UnaryOperationNode): UnaryOperationNode;
    protected transformUsing(node: UsingNode): UsingNode;
    protected transformFunction(node: FunctionNode): FunctionNode;
    protected transformCase(node: CaseNode): CaseNode;
    protected transformWhen(node: WhenNode): WhenNode;
    protected transformJSONReference(node: JSONReferenceNode): JSONReferenceNode;
    protected transformJSONPath(node: JSONPathNode): JSONPathNode;
    protected transformJSONPathLeg(node: JSONPathLegNode): JSONPathLegNode;
    protected transformJSONOperatorChain(node: JSONOperatorChainNode): JSONOperatorChainNode;
    protected transformTuple(node: TupleNode): TupleNode;
    protected transformMergeQuery(node: MergeQueryNode): MergeQueryNode;
    protected transformMatched(node: MatchedNode): MatchedNode;
    protected transformAddIndex(node: AddIndexNode): AddIndexNode;
    protected transformCast(node: CastNode): CastNode;
    protected transformDataType(node: DataTypeNode): DataTypeNode;
    protected transformSelectAll(node: SelectAllNode): SelectAllNode;
    protected transformIdentifier(node: IdentifierNode): IdentifierNode;
    protected transformValue(node: ValueNode): ValueNode;
    protected transformPrimitiveValueList(node: PrimitiveValueListNode): PrimitiveValueListNode;
    protected transformOperator(node: OperatorNode): OperatorNode;
    protected transformDefaultInsertValue(node: DefaultInsertValueNode): DefaultInsertValueNode;
}
