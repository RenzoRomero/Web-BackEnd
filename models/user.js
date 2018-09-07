'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
mongoose.set('useCreateIndex', true)

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  displayName: String,
  photo: String,
  password: { type: String, select: true },
  signupDate: { type: Date, default: Date.now() }
})

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (err) return next(err)

      this.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  });
}

module.exports = mongoose.model('User', UserSchema)
