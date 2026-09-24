<<<<<<< HEAD
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'student'
  }
});

export default User;

=======
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional because Google Login users won't have it
  googleId: { type: String },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
>>>>>>> pr-1
