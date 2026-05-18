import mongoose from "mongoose";

const monthlyFeeSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: Date
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    // 🔹 Academic Info
    class: {
      type: String,
      required: true
    },
    section: String,

    rollNumber: {
      type: String,
      unique: true
    },

    admissionDate: {
      type: Date,
      default: Date.now
    },

    // 🔹 Parent Info
    fatherName: {
      type: String,
      required: true
    },
    motherName: {
      type: String
    },
     photo: {
  type: String
  },
    email: String,
    phone: String,

    // 🔹 Address
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    // 🔹 Fees
    fees: {
      admissionFee: {
        amount: {
          type: Number,
          default: 0
        },
        paid: {
          type: Boolean,
          default: false
        },
        paidDate: Date
      },

      monthlyFees: [monthlyFeeSchema],

      transportFee: {
        amount: {
          type: Number,
          default: 0
        },
        paid: {
          type: Boolean,
          default: false
        }
      }
    },

    // 🔹 Documents
    documents: [
      {
        name: String,
        url: String
      }
    ],

    // 🔹 Status
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Student", studentSchema);