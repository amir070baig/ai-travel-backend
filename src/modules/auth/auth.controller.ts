import { Request, Response } from "express";
import { registerUser } from "./auth.service";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma/client";
import bcrypt from "bcrypt";
// Updated to import both schemas
import { registerSchema, loginSchema, resetPasswordSchema } from "../../validations/auth.validation";
import crypto from "crypto";
import { sendEmail } from "../../shared/email";

export const register = async (req: Request, res: Response) => {
  // 1. Validate registration inputs
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid registration data",
      errors: parsed.error.flatten(),
    });
  }

  // 2. Use validated data
  const { email, password } = parsed.data;

  const user = await registerUser(email, password);

  // ✅ CREATE TOKEN (THIS WAS MISSING)
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  // 1. Validate login inputs
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid login data",
      errors: parsed.error.flatten(),
    });
  }

  // 2. Use validated data
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.cookie(
    "token",
    token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  );

  res.json({
    user,
  });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.json({
    message: "Logged out",
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    // Never reveal whether an email exists
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before storing
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 15 minutes
    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken: hashedToken,
        resetTokenExpiresAt: expiresAt,
      },
    });

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,

      subject: "Reset your TourGen password",

      html: `
        <h2>Password Reset</h2>

        <p>Hello,</p>

        <p>
          We received a request to reset your TourGen password.
        </p>

        <p>
          Click the button below to reset it.
        </p>

        <p>
          <a
            href="${resetLink}"
            style="
              background:#2563eb;
              color:white;
              padding:12px 20px;
              border-radius:8px;
              text-decoration:none;
              display:inline-block;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link will expire in 15 minutes.
        </p>

        <p>
          If you didn't request this, you can safely ignore this email.
        </p>
      `,
    });

    return res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message:
        "Failed to process password reset request.",
    });

  }
};


export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {

    const parsed =
      resetPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: parsed.error.flatten(),
      });
    }

    const {
      token,
      password,
    } = parsed.data;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user =
      await prisma.user.findFirst({
        where: {
          resetToken: hashedToken,
        },
      });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired reset link.",
      });
    }

    if (
      !user.resetTokenExpiresAt ||
      user.resetTokenExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message:
          "Reset link has expired.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return res.json({
      message:
        "Password updated successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message:
        "Failed to reset password.",
    });

  }
};


export const me = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      message: "Failed to fetch user",
    });

  }
};