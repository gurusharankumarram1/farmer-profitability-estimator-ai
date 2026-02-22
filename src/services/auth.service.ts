import User from "@/models/user.model";
import { connectDB } from "@/utils/db";
import { hashPassword, comparePassword } from "@/utils/hash";
import { signToken } from "@/utils/token";
import { Status } from "@/constants/status.enum";
import { RegisterInput, LoginInput, AuthResponse } from "@/types/user.types";
import OTP from "@/models/otp.model";
import { MailService } from "@/services/mail.service";

// Ensure AuthResponse can include partial responses during registration
export interface OtpResponse {
  message: string;
  email: string;
  isOtpRequired: boolean;
}

export class AuthService {
  /**
   * Register a new user.
   */
  static async register(input: RegisterInput): Promise<OtpResponse> {
    await connectDB();

    const existingUser = await User.findOne({ email: input.email, status: { $ne: Status.Deleted } });
    if (existingUser && existingUser.status === Status.Active) {
      throw new Error("A user with this email already exists and is active.");
    }
    
    // If the user exists as pending, we'll reuse the account
    let user = existingUser;
    if (!user) {
      const hashedPassword = await hashPassword(input.password);
      user = await User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: "user",
        status: Status.Pending,
      });
    }

    // Generate 6 digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing OTPs for this email to prevent spam issues and keep it clean
    await OTP.deleteMany({ email: input.email });
    
    // Save new OTP
    await OTP.create({
      email: input.email,
      otp: generatedOtp,
    });

    // Send the OTP email
    await MailService.sendOtpEmail(input.email, generatedOtp);

    return {
      message: "An OTP has been sent to your email.",
      email: input.email,
      isOtpRequired: true,
    };
  }

  /**
   * Verify OTP and complete registration.
   */
  static async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    await connectDB();

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      throw new Error("Invalid or expired OTP.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }

    // Update user status
    user.status = Status.Active;
    await user.save();

    // Cleanup OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: "user",
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Login an existing user.
   */
  static async login(input: LoginInput): Promise<AuthResponse> {
    await connectDB();

    const user = await User.findOne({ email: input.email, status: Status.Active }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isMatch = await comparePassword(input.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: "user",
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }
}
