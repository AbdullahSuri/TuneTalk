import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
import './config.mjs'; 
mongoose.connect(process.env.DSN);

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const AlbumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    releaseDate: { type: Date },
    genre: { type: String },
    coverImage: { type: String },
    reviews: [ReviewSchema], 
    averageRating: { type: Number, default: 0 },
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    favoriteAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
});

UserSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=username%>' });
AlbumSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' });

mongoose.model('User', UserSchema);
mongoose.model('Album', AlbumSchema);
