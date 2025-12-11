import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Le contenu est obligatoire'],
      trim: true,
      minlength: [2, 'Minimum 2 caractères'],
      maxlength: [500, 'Maximum 500 caractères']
    },
    author: {
      type: String,
      required: [true, 'Auteur obligatoire'],
      trim: true,
      maxlength: [100, 'Maximum 100 caractères']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, 'Article obligatoire']
    },
    published: {
      type: Boolean,
      default: false
    },
    signale: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;



