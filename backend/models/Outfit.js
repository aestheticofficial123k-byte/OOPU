/**
 * models/Outfit.js
 * Stores user-created outfits and community posts.
 */

const mongoose = require("mongoose")

const outfitSchema = new mongoose.Schema(
  {
    // User who created the outfit
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Outfit title / caption
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    // Clothing items used in the outfit
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClothingItem",
      },
    ],

    // Optional outfit photo
    imageUrl: {
      type: String,
      default: "",
    },

    // Style tags
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Whether the user wants to share it publicly
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Community interactions
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: 300,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports =
  mongoose.models.Outfit || mongoose.model("Outfit", outfitSchema)