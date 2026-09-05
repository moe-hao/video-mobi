import type { FieldType, FieldSchema } from './types';
import type { SchemaObject } from './schema-object';

// 字段构建器
export class FieldBuilder<T extends FieldType, N extends string | never = never, O extends boolean = false> {
    readonly type: T;
    readonly outerName!: N;
    readonly _isOptional: O;
    private _defaultValue?: any;

    constructor(type: T, isOptional?: O) {
        this.type = type;
        this._isOptional = (isOptional ?? false) as O;
    }

    name<Name extends string>(outerName: Name): FieldBuilder<T, Name, O> {
        const builder = new FieldBuilder<T, Name, O>(this.type, this._isOptional);
        (builder as any).outerName = outerName;
        builder._defaultValue = this._defaultValue;
        return builder;
    }

    default(value: any): this {
        this._defaultValue = value;
        return this;
    }

    optional(): FieldBuilder<T, N, true> {
        const builder = new FieldBuilder<T, N, true>(this.type, true);
        (builder as any).outerName = this.outerName;
        builder._defaultValue = this._defaultValue;
        return builder;
    }

    build(): FieldSchema {
        return {
            type: this.type,
            outerName: this.outerName as string,
            defaultValue: this._defaultValue,
            optional: this._isOptional as boolean
        };
    }
}

// 枚举字段构建器
export class EnumFieldBuilder<T extends readonly string[], N extends string | never = never, O extends boolean = false> {
    readonly values: T;
    readonly outerName!: N;
    readonly _isOptional: O;

    constructor(values: T, isOptional?: O) {
        this.values = values;
        this._isOptional = (isOptional ?? false) as O;
    }

    name<Name extends string>(outerName: Name): EnumFieldBuilder<T, Name, O> {
        const builder = new EnumFieldBuilder<T, Name, O>(this.values, this._isOptional);
        (builder as any).outerName = outerName;
        return builder;
    }

    optional(): EnumFieldBuilder<T, N, true> {
        const builder = new EnumFieldBuilder<T, N, true>(this.values, true);
        (builder as any).outerName = this.outerName;
        return builder;
    }

    build(): FieldSchema & { type: 'enum'; enumValues: T } {
        return {
            type: 'enum',
            outerName: this.outerName as string,
            optional: this._isOptional as boolean,
            enumValues: this.values
        } as FieldSchema & { type: 'enum'; enumValues: T };
    }
}

// 嵌套字段构建器
export class NestedFieldBuilder<S extends SchemaObject<any>, N extends string | never = never, O extends boolean = false> {
    readonly nestedSchema: S;
    readonly outerName!: N;
    readonly _isOptional: O;

    constructor(schema: S, isOptional?: O) {
        this.nestedSchema = schema;
        this._isOptional = (isOptional ?? false) as O;
    }

    name<Name extends string>(outerName: Name): NestedFieldBuilder<S, Name, O> {
        const builder = new NestedFieldBuilder<S, Name, O>(this.nestedSchema, this._isOptional);
        (builder as any).outerName = outerName;
        return builder;
    }

    optional(): NestedFieldBuilder<S, N, true> {
        const builder = new NestedFieldBuilder<S, N, true>(this.nestedSchema, true);
        (builder as any).outerName = this.outerName;
        return builder;
    }

    build(): FieldSchema {
        return {
            type: 'object',
            outerName: this.outerName as string,
            optional: this._isOptional as boolean,
            nestedSchema: this.nestedSchema
        };
    }
}
