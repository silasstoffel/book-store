import { Schema } from 'mongoose';
import { ulid } from 'ulid'

export function mongooseSidecar(schema: Schema): Schema {
    schema.add({
        id: { type: String, required: false, index: true, unique:true, default: () => ulid()},
        deleted: { type: Boolean, required: false, default: () => false },
        createdAt: { type: Date, default: () => new Date() },
        updatedAt: { type: Date, default: () => new Date() },
    })

    return schema;
}
