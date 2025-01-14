/// <reference types="./operation-node-transformer.d.ts" />
import { freeze } from '../util/object-utils.js';
import { requireAllProps } from '../util/require-all-props.js';
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
export class OperationNodeTransformer {
    nodeStack = [];
    #transformers = freeze({
        AliasNode: this.transformAlias.bind(this),
        ColumnNode: this.transformColumn.bind(this),
        IdentifierNode: this.transformIdentifier.bind(this),
        SchemableIdentifierNode: this.transformSchemableIdentifier.bind(this),
        RawNode: this.transformRaw.bind(this),
        ReferenceNode: this.transformReference.bind(this),
        SelectQueryNode: this.transformSelectQuery.bind(this),
        SelectionNode: this.transformSelection.bind(this),
        TableNode: this.transformTable.bind(this),
        FromNode: this.transformFrom.bind(this),
        SelectAllNode: this.transformSelectAll.bind(this),
        AndNode: this.transformAnd.bind(this),
        OrNode: this.transformOr.bind(this),
        ValueNode: this.transformValue.bind(this),
        ValueListNode: this.transformValueList.bind(this),
        PrimitiveValueListNode: this.transformPrimitiveValueList.bind(this),
        ParensNode: this.transformParens.bind(this),
        JoinNode: this.transformJoin.bind(this),
        OperatorNode: this.transformOperator.bind(this),
        WhereNode: this.transformWhere.bind(this),
        InsertQueryNode: this.transformInsertQuery.bind(this),
        DeleteQueryNode: this.transformDeleteQuery.bind(this),
        ReturningNode: this.transformReturning.bind(this),
        CreateTableNode: this.transformCreateTable.bind(this),
        AddColumnNode: this.transformAddColumn.bind(this),
        ColumnDefinitionNode: this.transformColumnDefinition.bind(this),
        DropTableNode: this.transformDropTable.bind(this),
        DataTypeNode: this.transformDataType.bind(this),
        OrderByNode: this.transformOrderBy.bind(this),
        OrderByItemNode: this.transformOrderByItem.bind(this),
        GroupByNode: this.transformGroupBy.bind(this),
        GroupByItemNode: this.transformGroupByItem.bind(this),
        UpdateQueryNode: this.transformUpdateQuery.bind(this),
        ColumnUpdateNode: this.transformColumnUpdate.bind(this),
        LimitNode: this.transformLimit.bind(this),
        OffsetNode: this.transformOffset.bind(this),
        OnConflictNode: this.transformOnConflict.bind(this),
        OnDuplicateKeyNode: this.transformOnDuplicateKey.bind(this),
        CreateIndexNode: this.transformCreateIndex.bind(this),
        DropIndexNode: this.transformDropIndex.bind(this),
        ListNode: this.transformList.bind(this),
        PrimaryKeyConstraintNode: this.transformPrimaryKeyConstraint.bind(this),
        UniqueConstraintNode: this.transformUniqueConstraint.bind(this),
        ReferencesNode: this.transformReferences.bind(this),
        CheckConstraintNode: this.transformCheckConstraint.bind(this),
        WithNode: this.transformWith.bind(this),
        CommonTableExpressionNode: this.transformCommonTableExpression.bind(this),
        CommonTableExpressionNameNode: this.transformCommonTableExpressionName.bind(this),
        HavingNode: this.transformHaving.bind(this),
        CreateSchemaNode: this.transformCreateSchema.bind(this),
        DropSchemaNode: this.transformDropSchema.bind(this),
        AlterTableNode: this.transformAlterTable.bind(this),
        DropColumnNode: this.transformDropColumn.bind(this),
        RenameColumnNode: this.transformRenameColumn.bind(this),
        AlterColumnNode: this.transformAlterColumn.bind(this),
        ModifyColumnNode: this.transformModifyColumn.bind(this),
        AddConstraintNode: this.transformAddConstraint.bind(this),
        DropConstraintNode: this.transformDropConstraint.bind(this),
        ForeignKeyConstraintNode: this.transformForeignKeyConstraint.bind(this),
        CreateViewNode: this.transformCreateView.bind(this),
        DropViewNode: this.transformDropView.bind(this),
        GeneratedNode: this.transformGenerated.bind(this),
        DefaultValueNode: this.transformDefaultValue.bind(this),
        OnNode: this.transformOn.bind(this),
        ValuesNode: this.transformValues.bind(this),
        SelectModifierNode: this.transformSelectModifier.bind(this),
        CreateTypeNode: this.transformCreateType.bind(this),
        DropTypeNode: this.transformDropType.bind(this),
        ExplainNode: this.transformExplain.bind(this),
        DefaultInsertValueNode: this.transformDefaultInsertValue.bind(this),
        AggregateFunctionNode: this.transformAggregateFunction.bind(this),
        OverNode: this.transformOver.bind(this),
        PartitionByNode: this.transformPartitionBy.bind(this),
        PartitionByItemNode: this.transformPartitionByItem.bind(this),
        SetOperationNode: this.transformSetOperation.bind(this),
        BinaryOperationNode: this.transformBinaryOperation.bind(this),
        UnaryOperationNode: this.transformUnaryOperation.bind(this),
        UsingNode: this.transformUsing.bind(this),
        FunctionNode: this.transformFunction.bind(this),
        CaseNode: this.transformCase.bind(this),
        WhenNode: this.transformWhen.bind(this),
        JSONReferenceNode: this.transformJSONReference.bind(this),
        JSONPathNode: this.transformJSONPath.bind(this),
        JSONPathLegNode: this.transformJSONPathLeg.bind(this),
        JSONOperatorChainNode: this.transformJSONOperatorChain.bind(this),
        TupleNode: this.transformTuple.bind(this),
        MergeQueryNode: this.transformMergeQuery.bind(this),
        MatchedNode: this.transformMatched.bind(this),
        AddIndexNode: this.transformAddIndex.bind(this),
        CastNode: this.transformCast.bind(this),
    });
    transformNode(node) {
        if (!node) {
            return node;
        }
        this.nodeStack.push(node);
        const out = this.transformNodeImpl(node);
        this.nodeStack.pop();
        return freeze(out);
    }
    transformNodeImpl(node) {
        return this.#transformers[node.kind](node);
    }
    transformNodeList(list) {
        if (!list) {
            return list;
        }
        return freeze(list.map((node) => this.transformNode(node)));
    }
    transformSelectQuery(node) {
        return requireAllProps({
            kind: 'SelectQueryNode',
            from: this.transformNode(node.from),
            selections: this.transformNodeList(node.selections),
            distinctOn: this.transformNodeList(node.distinctOn),
            joins: this.transformNodeList(node.joins),
            groupBy: this.transformNode(node.groupBy),
            orderBy: this.transformNode(node.orderBy),
            where: this.transformNode(node.where),
            frontModifiers: this.transformNodeList(node.frontModifiers),
            endModifiers: this.transformNodeList(node.endModifiers),
            limit: this.transformNode(node.limit),
            offset: this.transformNode(node.offset),
            with: this.transformNode(node.with),
            having: this.transformNode(node.having),
            explain: this.transformNode(node.explain),
            setOperations: this.transformNodeList(node.setOperations),
        });
    }
    transformSelection(node) {
        return requireAllProps({
            kind: 'SelectionNode',
            selection: this.transformNode(node.selection),
        });
    }
    transformColumn(node) {
        return requireAllProps({
            kind: 'ColumnNode',
            column: this.transformNode(node.column),
        });
    }
    transformAlias(node) {
        return requireAllProps({
            kind: 'AliasNode',
            node: this.transformNode(node.node),
            alias: this.transformNode(node.alias),
        });
    }
    transformTable(node) {
        return requireAllProps({
            kind: 'TableNode',
            table: this.transformNode(node.table),
        });
    }
    transformFrom(node) {
        return requireAllProps({
            kind: 'FromNode',
            froms: this.transformNodeList(node.froms),
        });
    }
    transformReference(node) {
        return requireAllProps({
            kind: 'ReferenceNode',
            column: this.transformNode(node.column),
            table: this.transformNode(node.table),
        });
    }
    transformAnd(node) {
        return requireAllProps({
            kind: 'AndNode',
            left: this.transformNode(node.left),
            right: this.transformNode(node.right),
        });
    }
    transformOr(node) {
        return requireAllProps({
            kind: 'OrNode',
            left: this.transformNode(node.left),
            right: this.transformNode(node.right),
        });
    }
    transformValueList(node) {
        return requireAllProps({
            kind: 'ValueListNode',
            values: this.transformNodeList(node.values),
        });
    }
    transformParens(node) {
        return requireAllProps({
            kind: 'ParensNode',
            node: this.transformNode(node.node),
        });
    }
    transformJoin(node) {
        return requireAllProps({
            kind: 'JoinNode',
            joinType: node.joinType,
            table: this.transformNode(node.table),
            on: this.transformNode(node.on),
        });
    }
    transformRaw(node) {
        return requireAllProps({
            kind: 'RawNode',
            sqlFragments: freeze([...node.sqlFragments]),
            parameters: this.transformNodeList(node.parameters),
        });
    }
    transformWhere(node) {
        return requireAllProps({
            kind: 'WhereNode',
            where: this.transformNode(node.where),
        });
    }
    transformInsertQuery(node) {
        return requireAllProps({
            kind: 'InsertQueryNode',
            into: this.transformNode(node.into),
            columns: this.transformNodeList(node.columns),
            values: this.transformNode(node.values),
            returning: this.transformNode(node.returning),
            onConflict: this.transformNode(node.onConflict),
            onDuplicateKey: this.transformNode(node.onDuplicateKey),
            with: this.transformNode(node.with),
            ignore: node.ignore,
            replace: node.replace,
            explain: this.transformNode(node.explain),
            defaultValues: node.defaultValues,
        });
    }
    transformValues(node) {
        return requireAllProps({
            kind: 'ValuesNode',
            values: this.transformNodeList(node.values),
        });
    }
    transformDeleteQuery(node) {
        return requireAllProps({
            kind: 'DeleteQueryNode',
            from: this.transformNode(node.from),
            using: this.transformNode(node.using),
            joins: this.transformNodeList(node.joins),
            where: this.transformNode(node.where),
            returning: this.transformNode(node.returning),
            with: this.transformNode(node.with),
            orderBy: this.transformNode(node.orderBy),
            limit: this.transformNode(node.limit),
            explain: this.transformNode(node.explain),
        });
    }
    transformReturning(node) {
        return requireAllProps({
            kind: 'ReturningNode',
            selections: this.transformNodeList(node.selections),
        });
    }
    transformCreateTable(node) {
        return requireAllProps({
            kind: 'CreateTableNode',
            table: this.transformNode(node.table),
            columns: this.transformNodeList(node.columns),
            constraints: this.transformNodeList(node.constraints),
            temporary: node.temporary,
            ifNotExists: node.ifNotExists,
            onCommit: node.onCommit,
            frontModifiers: this.transformNodeList(node.frontModifiers),
            endModifiers: this.transformNodeList(node.endModifiers),
            selectQuery: this.transformNode(node.selectQuery),
        });
    }
    transformColumnDefinition(node) {
        return requireAllProps({
            kind: 'ColumnDefinitionNode',
            column: this.transformNode(node.column),
            dataType: this.transformNode(node.dataType),
            references: this.transformNode(node.references),
            primaryKey: node.primaryKey,
            autoIncrement: node.autoIncrement,
            unique: node.unique,
            notNull: node.notNull,
            unsigned: node.unsigned,
            defaultTo: this.transformNode(node.defaultTo),
            check: this.transformNode(node.check),
            generated: this.transformNode(node.generated),
            frontModifiers: this.transformNodeList(node.frontModifiers),
            endModifiers: this.transformNodeList(node.endModifiers),
            nullsNotDistinct: node.nullsNotDistinct,
        });
    }
    transformAddColumn(node) {
        return requireAllProps({
            kind: 'AddColumnNode',
            column: this.transformNode(node.column),
        });
    }
    transformDropTable(node) {
        return requireAllProps({
            kind: 'DropTableNode',
            table: this.transformNode(node.table),
            ifExists: node.ifExists,
            cascade: node.cascade,
        });
    }
    transformOrderBy(node) {
        return requireAllProps({
            kind: 'OrderByNode',
            items: this.transformNodeList(node.items),
        });
    }
    transformOrderByItem(node) {
        return requireAllProps({
            kind: 'OrderByItemNode',
            orderBy: this.transformNode(node.orderBy),
            direction: this.transformNode(node.direction),
        });
    }
    transformGroupBy(node) {
        return requireAllProps({
            kind: 'GroupByNode',
            items: this.transformNodeList(node.items),
        });
    }
    transformGroupByItem(node) {
        return requireAllProps({
            kind: 'GroupByItemNode',
            groupBy: this.transformNode(node.groupBy),
        });
    }
    transformUpdateQuery(node) {
        return requireAllProps({
            kind: 'UpdateQueryNode',
            table: this.transformNode(node.table),
            from: this.transformNode(node.from),
            joins: this.transformNodeList(node.joins),
            where: this.transformNode(node.where),
            updates: this.transformNodeList(node.updates),
            returning: this.transformNode(node.returning),
            with: this.transformNode(node.with),
            explain: this.transformNode(node.explain),
        });
    }
    transformColumnUpdate(node) {
        return requireAllProps({
            kind: 'ColumnUpdateNode',
            column: this.transformNode(node.column),
            value: this.transformNode(node.value),
        });
    }
    transformLimit(node) {
        return requireAllProps({
            kind: 'LimitNode',
            limit: this.transformNode(node.limit),
        });
    }
    transformOffset(node) {
        return requireAllProps({
            kind: 'OffsetNode',
            offset: this.transformNode(node.offset),
        });
    }
    transformOnConflict(node) {
        return requireAllProps({
            kind: 'OnConflictNode',
            columns: this.transformNodeList(node.columns),
            constraint: this.transformNode(node.constraint),
            indexExpression: this.transformNode(node.indexExpression),
            indexWhere: this.transformNode(node.indexWhere),
            updates: this.transformNodeList(node.updates),
            updateWhere: this.transformNode(node.updateWhere),
            doNothing: node.doNothing,
        });
    }
    transformOnDuplicateKey(node) {
        return requireAllProps({
            kind: 'OnDuplicateKeyNode',
            updates: this.transformNodeList(node.updates),
        });
    }
    transformCreateIndex(node) {
        return requireAllProps({
            kind: 'CreateIndexNode',
            name: this.transformNode(node.name),
            table: this.transformNode(node.table),
            columns: this.transformNodeList(node.columns),
            unique: node.unique,
            using: this.transformNode(node.using),
            ifNotExists: node.ifNotExists,
            where: this.transformNode(node.where),
            nullsNotDistinct: node.nullsNotDistinct,
        });
    }
    transformList(node) {
        return requireAllProps({
            kind: 'ListNode',
            items: this.transformNodeList(node.items),
        });
    }
    transformDropIndex(node) {
        return requireAllProps({
            kind: 'DropIndexNode',
            name: this.transformNode(node.name),
            table: this.transformNode(node.table),
            ifExists: node.ifExists,
            cascade: node.cascade,
        });
    }
    transformPrimaryKeyConstraint(node) {
        return requireAllProps({
            kind: 'PrimaryKeyConstraintNode',
            columns: this.transformNodeList(node.columns),
            name: this.transformNode(node.name),
        });
    }
    transformUniqueConstraint(node) {
        return requireAllProps({
            kind: 'UniqueConstraintNode',
            columns: this.transformNodeList(node.columns),
            name: this.transformNode(node.name),
            nullsNotDistinct: node.nullsNotDistinct,
        });
    }
    transformForeignKeyConstraint(node) {
        return requireAllProps({
            kind: 'ForeignKeyConstraintNode',
            columns: this.transformNodeList(node.columns),
            references: this.transformNode(node.references),
            name: this.transformNode(node.name),
            onDelete: node.onDelete,
            onUpdate: node.onUpdate,
        });
    }
    transformSetOperation(node) {
        return requireAllProps({
            kind: 'SetOperationNode',
            operator: node.operator,
            expression: this.transformNode(node.expression),
            all: node.all,
        });
    }
    transformReferences(node) {
        return requireAllProps({
            kind: 'ReferencesNode',
            table: this.transformNode(node.table),
            columns: this.transformNodeList(node.columns),
            onDelete: node.onDelete,
            onUpdate: node.onUpdate,
        });
    }
    transformCheckConstraint(node) {
        return requireAllProps({
            kind: 'CheckConstraintNode',
            expression: this.transformNode(node.expression),
            name: this.transformNode(node.name),
        });
    }
    transformWith(node) {
        return requireAllProps({
            kind: 'WithNode',
            expressions: this.transformNodeList(node.expressions),
            recursive: node.recursive,
        });
    }
    transformCommonTableExpression(node) {
        return requireAllProps({
            kind: 'CommonTableExpressionNode',
            name: this.transformNode(node.name),
            materialized: node.materialized,
            expression: this.transformNode(node.expression),
        });
    }
    transformCommonTableExpressionName(node) {
        return requireAllProps({
            kind: 'CommonTableExpressionNameNode',
            table: this.transformNode(node.table),
            columns: this.transformNodeList(node.columns),
        });
    }
    transformHaving(node) {
        return requireAllProps({
            kind: 'HavingNode',
            having: this.transformNode(node.having),
        });
    }
    transformCreateSchema(node) {
        return requireAllProps({
            kind: 'CreateSchemaNode',
            schema: this.transformNode(node.schema),
            ifNotExists: node.ifNotExists,
        });
    }
    transformDropSchema(node) {
        return requireAllProps({
            kind: 'DropSchemaNode',
            schema: this.transformNode(node.schema),
            ifExists: node.ifExists,
            cascade: node.cascade,
        });
    }
    transformAlterTable(node) {
        return requireAllProps({
            kind: 'AlterTableNode',
            table: this.transformNode(node.table),
            renameTo: this.transformNode(node.renameTo),
            setSchema: this.transformNode(node.setSchema),
            columnAlterations: this.transformNodeList(node.columnAlterations),
            addConstraint: this.transformNode(node.addConstraint),
            dropConstraint: this.transformNode(node.dropConstraint),
            addIndex: this.transformNode(node.addIndex),
            dropIndex: this.transformNode(node.dropIndex),
        });
    }
    transformDropColumn(node) {
        return requireAllProps({
            kind: 'DropColumnNode',
            column: this.transformNode(node.column),
        });
    }
    transformRenameColumn(node) {
        return requireAllProps({
            kind: 'RenameColumnNode',
            column: this.transformNode(node.column),
            renameTo: this.transformNode(node.renameTo),
        });
    }
    transformAlterColumn(node) {
        return requireAllProps({
            kind: 'AlterColumnNode',
            column: this.transformNode(node.column),
            dataType: this.transformNode(node.dataType),
            dataTypeExpression: this.transformNode(node.dataTypeExpression),
            setDefault: this.transformNode(node.setDefault),
            dropDefault: node.dropDefault,
            setNotNull: node.setNotNull,
            dropNotNull: node.dropNotNull,
        });
    }
    transformModifyColumn(node) {
        return requireAllProps({
            kind: 'ModifyColumnNode',
            column: this.transformNode(node.column),
        });
    }
    transformAddConstraint(node) {
        return requireAllProps({
            kind: 'AddConstraintNode',
            constraint: this.transformNode(node.constraint),
        });
    }
    transformDropConstraint(node) {
        return requireAllProps({
            kind: 'DropConstraintNode',
            constraintName: this.transformNode(node.constraintName),
            ifExists: node.ifExists,
            modifier: node.modifier,
        });
    }
    transformCreateView(node) {
        return requireAllProps({
            kind: 'CreateViewNode',
            name: this.transformNode(node.name),
            temporary: node.temporary,
            orReplace: node.orReplace,
            ifNotExists: node.ifNotExists,
            materialized: node.materialized,
            columns: this.transformNodeList(node.columns),
            as: this.transformNode(node.as),
        });
    }
    transformDropView(node) {
        return requireAllProps({
            kind: 'DropViewNode',
            name: this.transformNode(node.name),
            ifExists: node.ifExists,
            materialized: node.materialized,
            cascade: node.cascade,
        });
    }
    transformGenerated(node) {
        return requireAllProps({
            kind: 'GeneratedNode',
            byDefault: node.byDefault,
            always: node.always,
            identity: node.identity,
            stored: node.stored,
            expression: this.transformNode(node.expression),
        });
    }
    transformDefaultValue(node) {
        return requireAllProps({
            kind: 'DefaultValueNode',
            defaultValue: this.transformNode(node.defaultValue),
        });
    }
    transformOn(node) {
        return requireAllProps({
            kind: 'OnNode',
            on: this.transformNode(node.on),
        });
    }
    transformSelectModifier(node) {
        return requireAllProps({
            kind: 'SelectModifierNode',
            modifier: node.modifier,
            rawModifier: this.transformNode(node.rawModifier),
            of: this.transformNodeList(node.of),
        });
    }
    transformCreateType(node) {
        return requireAllProps({
            kind: 'CreateTypeNode',
            name: this.transformNode(node.name),
            enum: this.transformNode(node.enum),
        });
    }
    transformDropType(node) {
        return requireAllProps({
            kind: 'DropTypeNode',
            name: this.transformNode(node.name),
            ifExists: node.ifExists,
        });
    }
    transformExplain(node) {
        return requireAllProps({
            kind: 'ExplainNode',
            format: node.format,
            options: this.transformNode(node.options),
        });
    }
    transformSchemableIdentifier(node) {
        return requireAllProps({
            kind: 'SchemableIdentifierNode',
            schema: this.transformNode(node.schema),
            identifier: this.transformNode(node.identifier),
        });
    }
    transformAggregateFunction(node) {
        return requireAllProps({
            kind: 'AggregateFunctionNode',
            aggregated: this.transformNodeList(node.aggregated),
            distinct: node.distinct,
            filter: this.transformNode(node.filter),
            func: node.func,
            over: this.transformNode(node.over),
        });
    }
    transformOver(node) {
        return requireAllProps({
            kind: 'OverNode',
            orderBy: this.transformNode(node.orderBy),
            partitionBy: this.transformNode(node.partitionBy),
        });
    }
    transformPartitionBy(node) {
        return requireAllProps({
            kind: 'PartitionByNode',
            items: this.transformNodeList(node.items),
        });
    }
    transformPartitionByItem(node) {
        return requireAllProps({
            kind: 'PartitionByItemNode',
            partitionBy: this.transformNode(node.partitionBy),
        });
    }
    transformBinaryOperation(node) {
        return requireAllProps({
            kind: 'BinaryOperationNode',
            leftOperand: this.transformNode(node.leftOperand),
            operator: this.transformNode(node.operator),
            rightOperand: this.transformNode(node.rightOperand),
        });
    }
    transformUnaryOperation(node) {
        return requireAllProps({
            kind: 'UnaryOperationNode',
            operator: this.transformNode(node.operator),
            operand: this.transformNode(node.operand),
        });
    }
    transformUsing(node) {
        return requireAllProps({
            kind: 'UsingNode',
            tables: this.transformNodeList(node.tables),
        });
    }
    transformFunction(node) {
        return requireAllProps({
            kind: 'FunctionNode',
            func: node.func,
            arguments: this.transformNodeList(node.arguments),
        });
    }
    transformCase(node) {
        return requireAllProps({
            kind: 'CaseNode',
            value: this.transformNode(node.value),
            when: this.transformNodeList(node.when),
            else: this.transformNode(node.else),
            isStatement: node.isStatement,
        });
    }
    transformWhen(node) {
        return requireAllProps({
            kind: 'WhenNode',
            condition: this.transformNode(node.condition),
            result: this.transformNode(node.result),
        });
    }
    transformJSONReference(node) {
        return requireAllProps({
            kind: 'JSONReferenceNode',
            reference: this.transformNode(node.reference),
            traversal: this.transformNode(node.traversal),
        });
    }
    transformJSONPath(node) {
        return requireAllProps({
            kind: 'JSONPathNode',
            inOperator: this.transformNode(node.inOperator),
            pathLegs: this.transformNodeList(node.pathLegs),
        });
    }
    transformJSONPathLeg(node) {
        return requireAllProps({
            kind: 'JSONPathLegNode',
            type: node.type,
            value: node.value,
        });
    }
    transformJSONOperatorChain(node) {
        return requireAllProps({
            kind: 'JSONOperatorChainNode',
            operator: this.transformNode(node.operator),
            values: this.transformNodeList(node.values),
        });
    }
    transformTuple(node) {
        return requireAllProps({
            kind: 'TupleNode',
            values: this.transformNodeList(node.values),
        });
    }
    transformMergeQuery(node) {
        return requireAllProps({
            kind: 'MergeQueryNode',
            into: this.transformNode(node.into),
            using: this.transformNode(node.using),
            whens: this.transformNodeList(node.whens),
            with: this.transformNode(node.with),
        });
    }
    transformMatched(node) {
        return requireAllProps({
            kind: 'MatchedNode',
            not: node.not,
            bySource: node.bySource,
        });
    }
    transformAddIndex(node) {
        return requireAllProps({
            kind: 'AddIndexNode',
            name: this.transformNode(node.name),
            columns: this.transformNodeList(node.columns),
            unique: node.unique,
            using: this.transformNode(node.using),
            ifNotExists: node.ifNotExists,
        });
    }
    transformCast(node) {
        return requireAllProps({
            kind: 'CastNode',
            expression: this.transformNode(node.expression),
            dataType: this.transformNode(node.dataType),
        });
    }
    transformDataType(node) {
        // An Object.freezed leaf node. No need to clone.
        return node;
    }
    transformSelectAll(node) {
        // An Object.freezed leaf node. No need to clone.
        return node;
    }
    transformIdentifier(node) {
        // An Object.freezed leaf node. No need to clone.
        return node;
    }
    transformValue(node) {
        // An Object.freezed leaf node. No need to clone.
        return node;
    }
    transformPrimitiveValueList(node) {
        // An Object.freezed leaf node. No need to clone.
        return node;
    }
    transformOperator(node) {
        // An Object.freezed leaf node. No need to clone.
        return node;
    }
    transformDefaultInsertValue(node) {
        // An Object.freezed leaf node. No need to clone.
        return node;
    }
}
