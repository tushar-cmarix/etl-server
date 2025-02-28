import mongoose, {
    Document,
    Model,
    ObjectId,
    Schema,
    HydratedDocument,
    SchemaDefinition,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import toJSON from './plugins/toJSON.plugin';
import paginate from './plugins/paginate.plugin';
import { NewFactorResource, Role } from '../types/user';

interface UserDocument extends Document {
    _id: mongoose.Types.ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    phone: {
        code: string;
        number: string;
    };
    password: string;
    role: string;
    isEmailVerified: boolean;
    is2FAEnabled: boolean;
    twilioFactor: NewFactorResource;
    isPasswordMatch(password: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
    isEmailTaken(email: string, excludeUserId?: ObjectId): Promise<boolean>;
    paginate: Function;
}

const userSchemaDefinition: SchemaDefinition<UserDocument> = {
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        code: { type: String, required: true },
        number: { type: String, required: true },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Invalid email',
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate: {
            validator: (value: string) =>
                /\d/.test(value) && /[a-zA-Z]/.test(value),
            message: 'Password must contain at least one letter and one number',
        },
        private: true, // used by the toJSON plugin
    },
    role: {
        type: String,
        enum: Role,
        default: Role.USER,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    is2FAEnabled: {
        type: Boolean,
        default: false,
    },
    twilioFactor: {
        type: Schema.Types.Mixed,
    },
};

const userSchema = new Schema<UserDocument, UserModel>(userSchemaDefinition, {
    timestamps: true,
});

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (
    email: string,
    excludeUserId?: ObjectId
): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (
    this: HydratedDocument<UserDocument>,
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    const user = this as HydratedDocument<UserDocument>;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User, UserDocument };
