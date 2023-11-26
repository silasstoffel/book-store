import { Schema } from 'mongoose';
import { ulid } from 'ulid'

export function mongooseSidecar(schema: Schema): Schema {
    schema.add({
        id: { type: String, required: false, index: true, unique:true, default: () => ulid()},
        createdAt: { type: Date, default: () => new Date() },
        updatedAt: { type: Date, default: () => new Date() },
    })

    return schema;
}
