// 类型定义
import type { SchemaObject } from './schema-object';

export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'enum';

export interface FieldSchema<T = any> {
    type: FieldType;
    outerName?: string;
    defaultValue?: T;
    optional?: boolean;
    nestedSchema?: any;
    enumValues?: string[];
}

// 判断是否是可选字段
type IsOptionalField<T> = T extends { readonly _isOptional: true } ? true : false;

// 推导必填字段的值类型
type InferRequiredFieldType<T> = T extends { type: 'string' } ? string :
    T extends { type: 'number' } ? number :
    T extends { type: 'boolean' } ? boolean :
    T extends { type: 'enum'; enumValues: readonly (infer V)[] } ? V :
    T extends { type: 'object'; nestedSchema: infer S } ? S extends SchemaObject<infer Def> ? InferInnerType<Def> : Record<string, any> :
    T extends { type: 'object' } ? Record<string, any> :
    T extends { type: 'array' } ? any[] :
    T extends { nestedSchema: infer S } ? S extends SchemaObject<infer Def> ? InferInnerType<Def> : Record<string, any> :
    T extends { values: readonly (infer V)[] } ? V :
    any;

type InferRequiredOuterFieldType<T> = T extends { type: 'string' } ? string :
    T extends { type: 'number' } ? number :
    T extends { type: 'boolean' } ? boolean :
    T extends { type: 'enum'; enumValues: readonly (infer V)[] } ? V :
    T extends { type: 'object'; nestedSchema: infer S } ? S extends SchemaObject<infer Def> ? InferOuterType<Def> : Record<string, any> :
    T extends { type: 'object' } ? Record<string, any> :
    T extends { type: 'array' } ? any[] :
    T extends { nestedSchema: infer S } ? S extends SchemaObject<infer Def> ? InferOuterType<Def> : Record<string, any> :
    T extends { values: readonly (infer V)[] } ? V :
    any;

export type GetOuterName<T> = T extends { outerName: infer N } ? N extends string ? N : never : never;

// 字段值类型推导（保留 union undefined，供单字段使用）
export type InferFieldType<T> = IsOptionalField<T> extends true ? InferRequiredFieldType<T> | undefined : InferRequiredFieldType<T>;
export type InferOuterFieldType<T> = IsOptionalField<T> extends true ? InferRequiredOuterFieldType<T> | undefined : InferRequiredOuterFieldType<T>;

export type InferInnerType<T extends object> =
    Expand<OptionalInnerPart<T> & RequiredInnerPart<T>>;

export type InferOuterType<T extends object> =
    Expand<OptionalOuterPart<T> & RequiredOuterPart<T>>;

// 把推导出的类型展开成可读的对象结构（类似 drizzle $inferSelect 的展示效果），
// 避免 IDE 提示/报错中暴露内部 builder 类型
export type Expand<T> = T extends readonly unknown[] | Function
    ? T
    : T extends object
    ? { [K in keyof T]: Expand<T[K]> }
    : T;

// 可选字段部分（键不相交，避免与必填字段产生属性类型冲突）
type OptionalInnerPart<T extends object> = {
    [K in keyof T as IsOptionalField<T[K]> extends true ? K : never]?: InferRequiredFieldType<T[K]>;
};
type RequiredInnerPart<T extends object> = {
    [K in keyof T as IsOptionalField<T[K]> extends true ? never : K]: InferRequiredFieldType<T[K]>;
};
type OptionalOuterPart<T extends object> = {
    [K in keyof T as IsOptionalField<T[K]> extends true ? (GetOuterName<T[K]> extends never ? K : GetOuterName<T[K]>) : never]?:
    InferRequiredOuterFieldType<T[K]>;
};
type RequiredOuterPart<T extends object> = {
    [K in keyof T as IsOptionalField<T[K]> extends true ? never : (GetOuterName<T[K]> extends never ? K : GetOuterName<T[K]>)]:
    InferRequiredOuterFieldType<T[K]>;
};

// 类型工具
export type Inner<T extends { _schema: any }> = InferInnerType<T['_schema']>;
export type Outer<T extends { _schema: any }> = InferOuterType<T['_schema']>;
