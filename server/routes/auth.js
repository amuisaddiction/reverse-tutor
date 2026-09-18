import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjee123';

// Generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup Route (Now requires OTP)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 mins

    // Save OTP to DB
    await OTP.create({ email, code: otpCode, expiresAt });

    // In a real app, send email/SMS here. For this MVP, we just log it!
    console.log(`\n\n🔔 [MOCK EMAIL API] Send OTP: ${otpCode} to ${email}\n\n`);

    res.status(200).json({ message: 'OTP sent successfully', requireOtp: true, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Verify OTP & Create User
router.post('/verify-otp', async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    const validOtp = await OTP.findOne({ 
      where: { email, code: otp } 
    });

    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (new Date() > validOtp.expiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Hash password & Create User
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, phone, passwordHash });
    await validOtp.destroy(); // Cleanup

    // Login user immediately
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    res.status(201).json({ message: 'Account verified', token, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
