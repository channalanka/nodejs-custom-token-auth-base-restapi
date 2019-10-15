import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const songSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, 'Song must have title']
    },
    url:{
        type: String,
        required:[true, 'Song must have url']
    },
    rating: {
        type: Number,
        default:0,
        min:0,
        max:5,

    },
    artist: {
        type: String,
        required:[true, 'Song must have Artist']
    }
});
songSchema.plugin(mongoosePaginate);

export default mongoose.model('Song', songSchema);