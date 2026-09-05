import type { FieldSchema, InferInnerType, InferOuterType } from './types';
import { FieldBuilder, NestedFieldBuilder } from './field-builder';

// Schema 对象类
export class SchemaObject<T extends Record<string, any>> {
    readonly _schema!: T;
    private builtSchema: Record<string, FieldSchema>;

    // drizzle 风格的类型推导：typeof schema.$inferInner / typeof schema.$inferOuter
    declare readonly $inferInner: InferInnerType<T>;
    declare readonly $inferOuter: InferOuterType<T>;

    constructor(schema: T) {
        this._schema = schema;
        this.builtSchema = {};

        for (const [key, field] of Object.entries(schema)) {
            if (field instanceof FieldBuilder || field instanceof NestedFieldBuilder) {
                this.builtSchema[key] = field.build();
            } else {
                this.builtSchema[key] = field;
            }
        }
    }

    to(data: InferInnerType<T>): InferOuterType<T> {
        const result: any = {};

        for (const [innerKey, field] of Object.entries(this.builtSchema)) {
            const outerKey = field.outerName || innerKey;
            const value = (data as any)[innerKey];

            if (value !== undefined) {
                if (field.type === 'object' && field.nestedSchema) {
                    result[outerKey] = field.nestedSchema.to(value);
                } else {
                    result[outerKey] = value;
                }
            } else if (field.defaultValue !== undefined) {
                result[outerKey] = field.defaultValue;
            }
        }

        return result;
    }

    from(data: InferOuterType<T>): InferInnerType<T> {
        const result: any = {};

        for (const [innerKey, field] of Object.entries(this.builtSchema)) {
            const outerKey = field.outerName || innerKey;
            const value = (data as any)[outerKey];

            if (value !== undefined) {
                if (field.type === 'object' && field.nestedSchema) {
                    result[innerKey] = field.nestedSchema.from(value);
                } else {
                    result[innerKey] = value;
                }
            } else if (field.defaultValue !== undefined) {
                result[innerKey] = field.defaultValue;
            }
        }

        return result;
    }

    getInnerType(): InferInnerType<T> {
        return {} as InferInnerType<T>;
    }

    getOuterType(): InferOuterType<T> {
        return {} as InferOuterType<T>;
    }
}
