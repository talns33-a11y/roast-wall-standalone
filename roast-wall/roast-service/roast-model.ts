import mongoose, { Schema, Model } from 'mongoose';

/**
 * Shape of a roast document stored in MongoDB.
 */
export interface IRoastDocument {
  id: string;
  serial: number;
  serialLabel: string;
  name: string;
  professionOrHobby: string;
  title: string;
  roastLine: string;
  hiddenCompliment: string;
  certificateText: string;
  socialCaption: string;
  tone: string;
  createdAt: Date;
}

const roastSchema = new Schema<IRoastDocument>(
  {
    serial: { type: Number, required: true, unique: true },
    serialLabel: { type: String, required: true },
    name: { type: String, required: true },
    professionOrHobby: { type: String, default: '' },
    title: { type: String, required: true },
    roastLine: { type: String, required: true },
    hiddenCompliment: { type: String, required: true },
    certificateText: { type: String, required: true },
    socialCaption: { type: String, required: true },
    tone: { type: String, default: 'brutal-but-safe' },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
    /**
     * Expose `id` (string version of `_id`) and remove internal `__v`/`_id`
     * from JSON output so the API response shape is clean.
     */
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/**
 * Mongoose model for roast documents.
 * Guard against model re-registration when the module is hot-reloaded.
 */
export const RoastModel: Model<IRoastDocument> =
  (mongoose.models['Roast'] as Model<IRoastDocument>) ||
  mongoose.model<IRoastDocument>('Roast', roastSchema);
