import { Platform } from '../models/platform.model';

const queryPlatform = async (
    filter: { [key: string]: any },
    options: { [key: string]: any }
) => {
    const platforms = await Platform.paginate(filter, options);
    return platforms;
};

export default {
    queryPlatform,
};
