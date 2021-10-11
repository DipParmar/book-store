const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// virtual field
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuid();
    this.hashed_password = this.encryptPassword(password, this.salt);
  })
  .get(function () {
    return this._password;
  });

// virtual method
userSchema.methods = {
  encryptPassword: (password, salt) => {
    if (password) {
      try {
        return crypto.createHmac('sha1', salt).update(password).digest('hex');
      } catch (e) {
        return '';
      }
    }
  },
};

module.exports = mongoose.model('User', userSchema);
