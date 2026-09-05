import type { Inner, Outer, FieldSchema } from './types';
import { FieldBuilder, EnumFieldBuilder, NestedFieldBuilder } from './field-builder';
import { SchemaObject } from './schema-object';

// struct 工具对象
export const struct = {
    string(): FieldBuilder<'string'> {
        return new FieldBuilder('string');
    },

    number(): FieldBuilder<'number'> {
        return new FieldBuilder('number');
    },

    boolean(): FieldBuilder<'boolean'> {
        return new FieldBuilder('boolean');
    },

    object(): FieldBuilder<'object'> {
        return new FieldBuilder('object');
    },

    array(): FieldBuilder<'array'> {
        return new FieldBuilder('array');
    },

    enum<T extends string>(values: readonly T[]): EnumFieldBuilder<readonly T[]> {
        return new EnumFieldBuilder(values);
    },

    // 嵌套 schema
    nested<S extends SchemaObject<any>>(schema: S): NestedFieldBuilder<S> {
        return new NestedFieldBuilder(schema);
    },

    // 创建 schema 对象
    schema<T extends Record<string, any>>(definition: T): SchemaObject<T> {
        const builtSchema: any = {};

        for (const [key, field] of Object.entries(definition)) {
            if (field instanceof FieldBuilder || field instanceof EnumFieldBuilder || field instanceof NestedFieldBuilder) {
                builtSchema[key] = field.build();
            } else if (field instanceof SchemaObject) {
                // 兼容直接传入 SchemaObject 的情况
                builtSchema[key] = {
                    type: 'object',
                    nestedSchema: field
                } as FieldSchema;
            } else {
                builtSchema[key] = field;
            }
        }

        return new SchemaObject(definition) as SchemaObject<T>;
    },

    // 类型工具
    inner<T extends SchemaObject<any>>(schema?: T): Inner<T> {
        return {} as Inner<T>;
    },

    outer<T extends SchemaObject<any>>(schema?: T): Outer<T> {
        return {} as Outer<T>;
    }
};

// 类型工具命名空间
export namespace struct {
    export type inner<T extends SchemaObject<any>> = Inner<T>;
    export type outer<T extends SchemaObject<any>> = Outer<T>;
}
