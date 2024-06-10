import Listing from "../models/listing.User.js";

// search function route

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = {$in: [true, false]};
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = {$in: [true, false]};
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = {$in: [true, false]};
    }

    let typeOfPlace = req.query.typeOfPlace;
    if (typeOfPlace === undefined || typeOfPlace === "all") {
      typeOfPlace = {$in: ["rent", "sale"]};
    }
    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "desc";

    const listings = await Listing.find({
      name: {$regex: searchTerm, $options: "i"},
      furnished,
      parking,
      typeOfPlace,
      offer,
    })
      .sort({[sort]: order})
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
