const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
//import schema from nft.js
const NFT = require('./NFT');
const orderSchema = require('./Order');
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
        },
        password: {
            type: String,
            required: true,
        },
        // set savedNFTS to be an array of data that adheres to the NFTSchema
        saveNFTs: [{type: Schema.Types.ObjectId, ref: 'NFT'}],
        orders: [orderSchema]
    },
    // set this to use virtual below
    {
        toJSON: {
            virtuals: true,
        },
    });

    //hash user password
    // hash user password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  
    next();
  });
  // custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
  

// when we query a user, we'll also get another field called `NFTCount` with the number of saved NFT's we have
userSchema.virtual('nftCount').get(function () {
    return this.savedNFTs?.length;
  });
  
  const User = model('User', userSchema);

  module.exports = User; 