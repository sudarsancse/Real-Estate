import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    discountPrice: {
      type: Number,
      require: true,
    },
    badRoom: {
      type: Number,
      require: true,
    },
    barthRoom: {
      type: Number,
      require: true,
    },
    kitchenRoom: {
      type: Number,
      require: true,
    },
    furnished: {
      type: Boolean,
      require: true,
    },
    parking: {
      type: Boolean,
      require: true,
    },
    typeOfPlace: {
      type: String,
      require: true,
    },
    offer: {
      type: Boolean,
      require: true,
    },
    imageUrls: {
      type: Array,
      require: true,
    },
    UserRef: {
      type: String,
      require: true,
    },
    soldOut: {
      type: Boolean,
      require: true,
    },
  },
  {timestamps: true}
);

const Listing = mongoose.model("listing", listingSchema);

export default Listing;
