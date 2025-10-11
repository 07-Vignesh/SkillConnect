import express from "express";
import Booking from "../models/Booking.js";
import Freelancer from "../models/Freelancer.js";

const router = express.Router();

/** ✅ Create new booking */
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/** ✅ Cancel booking */
router.put("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/** ✅ Fetch bookings for a particular freelancer */
router.get("/freelancer/:freelancerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ freelancerId: req.params.freelancerId }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/** ✅ Accept booking */
router.put("/:id/accept", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "accepted";
    await booking.save();

    // ✅ Add completed project entry to freelancer
    await Freelancer.findByIdAndUpdate(booking.freelancerId, {
      $push: {
        projects: {
          projectTitle: booking.projectDetails,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          amount: booking.advanceFee,
        },
      },
    });

    res.json(booking);
    console.log("✅ Booking accepted and project added:", booking._id);
  } catch (error) {
    console.error("❌ Error accepting booking:", error);
    res.status(400).json({ message: error.message });
  }
});

/** ✅ Ignore booking */
router.put("/:id/ignore", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "ignored" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id/rate", async (req, res) => {
  try {
    const { rating } = req.body;
    const bookingId = req.params.id;

    // Ensure rating is valid
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the freelancer
    const freelancer = await Freelancer.findById(booking.freelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    // ✅ Save the rating in booking
    booking.rating = numericRating;
    await booking.save();

    // ✅ Update average rating in freelancer model
    if (!freelancer.totalRatings) freelancer.totalRatings = 0;
    if (!freelancer.ratingCount) freelancer.ratingCount = 0;

    freelancer.totalRatings += numericRating;
    freelancer.ratingCount += 1;
    freelancer.averageRating = Number(
      (freelancer.totalRatings / freelancer.ratingCount).toFixed(1)
    );

    await freelancer.save();

    res.json({ message: "Rating added successfully", booking, freelancer });
  } catch (error) {
    console.error("Error rating booking:", error);
    res.status(500).json({ message: "Error rating booking", error: error.message });
  }
});
// ✅ Get all bookings for a specific client (by email)
router.get("/client/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await Booking.find({ clientEmail: email });
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Rate a completed booking and update freelancer average rating
router.put("/:bookingId/rate", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // ✅ Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ✅ Find the linked freelancer
    const freelancer = await Freelancer.findById(booking.freelancerId);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });

    // ✅ Update booking rating
    booking.rating = rating;
    booking.status = "completed";
    await booking.save();

    // ✅ Recalculate freelancer average rating
    const freelancerBookings = await Booking.find({
      freelancerId: booking.freelancerId,
      rating: { $exists: true },
    });

    const totalRatings = freelancerBookings.reduce((sum, b) => sum + (b.rating || 0), 0);
    const averageRating = totalRatings / freelancerBookings.length;

    freelancer.averageRating = Number(averageRating.toFixed(1));
    await freelancer.save();

    res.status(200).json({
      message: "Rating submitted successfully",
      booking,
      averageRating: freelancer.averageRating,
    });
  } catch (error) {
    console.error("Error rating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export default router;
