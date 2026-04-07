import crypto from "crypto";
import User from "../models/User.js";
import Driver from "../models/Driver.js";
import AuthAccount from "../models/AuthAccount.js";
import env from "../config/env.js";
import { hashPassword, verifyPassword } from "../services/authService.js";

function conflict(message) {
  const err = new Error(message);
  err.statusCode = 409;
  return err;
}

function unauthorized(message) {
  const err = new Error(message);
  err.statusCode = 401;
  return err;
}

function buildAuthResponse(account, profile) {
  return {
    role: account.role,
    email: account.email,
    must_reset_password: account.must_reset_password,
    user_id: account.user_id || null,
    driver_id: account.driver_id || null,
    profile,
  };
}

async function signup(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const existingAccount = await AuthAccount.findOne({ email }).lean();
    if (existingAccount) {
      throw conflict("An account with this email already exists");
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      throw conflict("A user with this email already exists");
    }

    const userId = crypto.randomUUID();
    const user = await User.create({
      _id: userId,
      email,
      full_name: req.body.full_name,
      smart_card_num: req.body.smart_card_num || null,
    });

    const { salt, passwordHash } = hashPassword(req.body.password);
    const account = await AuthAccount.create({
      email,
      password_salt: salt,
      password_hash: passwordHash,
      role: "user",
      user_id: user._id,
    });

    res.status(201).json({
      success: true,
      data: buildAuthResponse(account, {
        _id: user._id,
        email: user.email,
        full_name: user.full_name,
      }),
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const account = await AuthAccount.findOne({ email }).lean();
    if (!account) {
      throw unauthorized("Invalid email or password");
    }

    const isValid = verifyPassword(req.body.password, account.password_salt, account.password_hash);
    if (!isValid) {
      throw unauthorized("Invalid email or password");
    }

    let profile = null;
    if (account.role === "user" && account.user_id) {
      profile = await User.findById(account.user_id)
        .select("_id email full_name smart_card_num profile_url")
        .lean();
    }

    if (account.role === "driver" && account.driver_id) {
      profile = await Driver.findById(account.driver_id)
        .select("_id email driver_first_name driver_last_name driver_age telephone telephone_number")
        .lean();
    }

    res.json({
      success: true,
      data: buildAuthResponse(account, profile),
    });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const account = await AuthAccount.findOne({ email });
    if (!account) {
      throw unauthorized("Invalid email or password");
    }

    const isValid = verifyPassword(req.body.current_password, account.password_salt, account.password_hash);
    if (!isValid) {
      throw unauthorized("Invalid email or password");
    }

    const { salt, passwordHash } = hashPassword(req.body.new_password);
    account.password_salt = salt;
    account.password_hash = passwordHash;
    account.must_reset_password = false;
    await account.save();

    res.json({
      success: true,
      data: {
        role: account.role,
        email: account.email,
        must_reset_password: account.must_reset_password,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function inviteDriver(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const existingAccount = await AuthAccount.findOne({ email }).lean();
    if (existingAccount) {
      throw conflict("An account with this email already exists");
    }

    const driver = await Driver.create({
      email,
      driver_first_name: req.body.driver_first_name,
      driver_last_name: req.body.driver_last_name || null,
      driver_age: req.body.driver_age ?? null,
      telephone: req.body.telephone || "",
      telephone_number: req.body.telephone_number || "",
    });

    const invitePassword = req.body.password || env.driverInvitePassword;
    const { salt, passwordHash } = hashPassword(invitePassword);

    const account = await AuthAccount.create({
      email,
      password_salt: salt,
      password_hash: passwordHash,
      role: "driver",
      driver_id: driver._id,
      must_reset_password: true,
    });

    res.status(201).json({
      success: true,
      data: {
        ...buildAuthResponse(account, driver.toObject()),
        temporary_password: invitePassword,
      },
    });
  } catch (err) {
    next(err);
  }
}

export { signup, login, changePassword, inviteDriver };
