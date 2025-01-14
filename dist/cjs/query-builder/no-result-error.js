"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNoResultErrorConstructor = exports.NoResultError = void 0;
class NoResultError extends Error {
    /**
     * The operation node tree of the query that was executed.
     */
    node;
    constructor(node) {
        super('no result');
        this.node = node;
    }
}
exports.NoResultError = NoResultError;
function isNoResultErrorConstructor(fn) {
    return Object.prototype.hasOwnProperty.call(fn, 'prototype');
}
exports.isNoResultErrorConstructor = isNoResultErrorConstructor;
