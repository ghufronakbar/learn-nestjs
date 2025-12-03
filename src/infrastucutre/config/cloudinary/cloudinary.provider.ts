import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../../../constants/env';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        return cloudinary.config({
            cloud_name: ENV.cloudinary.cloudName,
            api_key: ENV.cloudinary.apiKey,
            api_secret: ENV.cloudinary.apiSecret,
        });
    },
};