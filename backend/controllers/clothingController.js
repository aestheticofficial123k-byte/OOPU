const ClothingItem = require("../models/ClothingItem")
const { cloudinary } = require("../config/cloudinary")

// Upload a buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "oopu-app/clothing",
        resource_type: "image",
        format: "png",
        transformation: [
          {
            width: 900,
            height: 900,
            crop: "limit",
            quality: "auto:good",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    stream.end(buffer)
  })
}


const addClothingItem = async (req, res) => {
  try {
    const {
      type,
      category,
      color,
      pattern,
      formalityLevel,
      season,
      name,
      brand,
      notes,
    } = req.body

    const data = {
      userId: req.user._id,
      type,
      category,
      color,
      pattern,
      formalityLevel,
      season,
      name,
      brand,
      notes,
    }

    // Upload processed PNG to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer)

      data.imageUrl = result.secure_url
      data.cloudinaryPublicId = result.public_id
    }

    const item = await ClothingItem.create(data)

    res.status(201).json({
      success: true,
      data: item,
    })
  } catch (error) {
    console.error("Add clothing error:", error)

    res.status(500).json({
      success: false,
      message: error.message || "Failed to add clothing item",
    })
  }
}


const getClothingItems = async (req, res) => {
  const {
    category,
    season,
    formalityLevel,
    type,
  } = req.query

  const filter = {
    userId: req.user._id,
  }

  if (category) filter.category = category
  if (season) filter.season = season
  if (formalityLevel) {
    filter.formalityLevel = formalityLevel
  }
  if (type) filter.type = type

  const items = await ClothingItem
    .find(filter)
    .sort({ createdAt: -1 })

  res.json({
    success: true,
    count: items.length,
    data: items,
  })
}


const getClothingItem = async (req, res) => {
  const item = await ClothingItem.findOne({
    _id: req.params.id,
    userId: req.user._id,
  })

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    })
  }

  res.json({
    success: true,
    data: item,
  })
}


const updateClothingItem = async (req, res) => {
  const item = await ClothingItem.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    })
  }

  res.json({
    success: true,
    data: item,
  })
}


const deleteClothingItem = async (req, res) => {
  const item = await ClothingItem.findOne({
    _id: req.params.id,
    userId: req.user._id,
  })

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    })
  }

  if (item.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(
      item.cloudinaryPublicId
    )
  }

  await item.deleteOne()

  res.json({
    success: true,
    message: "Clothing item deleted successfully",
  })
}


module.exports = {
  addClothingItem,
  getClothingItems,
  getClothingItem,
  updateClothingItem,
  deleteClothingItem,
}