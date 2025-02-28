import mongoose, {
    Document,
    Model,
    ObjectId,
    Schema,
    SchemaDefinition,
} from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import paginate from './plugins/paginate.plugin';

interface AccountDocument extends Document {
    alias: string;
    platform: ObjectId;
    credential: ObjectId;
    active: boolean;
}

interface AccountModel extends Model<AccountDocument> {
    paginate: Function;
}

const accountSchemaDefinition: SchemaDefinition<AccountDocument> = {
    alias: { type: String, required: true },
    platform: { type: Schema.Types.ObjectId, required: true, ref: 'Platform' },
    credential: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Credential',
    },
    active: { type: Boolean, default: true },
};

const accountSchema = new Schema<AccountDocument, AccountModel>(
    accountSchemaDefinition,
    {
        timestamps: true,
    }
);

accountSchema.plugin(toJSON);
accountSchema.plugin(paginate);

const Account = mongoose.model<AccountDocument, AccountModel>(
    'Account',
    accountSchema
);

export { Account, AccountDocument };
