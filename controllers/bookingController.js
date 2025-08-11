import Booking from "../models/Booking.js";

// POST /api/bookings/
export const createBooking = async (req, res) => {
  try {
    const { service, vehicleName, vehicleNumber, bookingDate, bookingTime } =
      req.body;

    const booking = await Booking.create({
      user: req.user._id,
      service,
      vehicleName,
      vehicleNumber,
      bookingDate,
      bookingTime,
      status: "Pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Booking creation failed", error: error.message });
  }
};

// GET /api/bookings/my
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// GET /api/bookings/ (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email")
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
};

// PUT /api/bookings/:id/status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Optional: validate status value (if you have a list of allowed statuses)
    const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Failed to update booking status", error: error.message });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
