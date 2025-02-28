import mongoose, { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import paginate from './plugins/paginate.plugin';

interface PlatformDocument extends Document {
    name: string;
    key: string;
    createdAt: Date;
}

interface PlatformModel extends Model<PlatformDocument> {
    paginate: Function;
}

const platformSchemaDefinition: SchemaDefinition<PlatformDocument> = {
    name: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
};

const platformSchema = new Schema<PlatformDocument, PlatformModel>(
    platformSchemaDefinition,
    {
        timestamps: true,
    }
);

platformSchema.plugin(toJSON);
platformSchema.plugin(paginate);

const Platform = mongoose.model<PlatformDocument, PlatformModel>(
    'Platform',
    platformSchema
);

export { Platform, PlatformDocument };
