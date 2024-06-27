const { main } = require("../config/connection");
const collection = require("../config/collection");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

module.exports = {
  userSignup: async (userdata) => {
    const data = { error: "", user: {} };
    try {
      const db = await main();
      const isUser = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userdata.email });
      if (isUser) {
        data.error = "User already Exist.";
        return data;
      }
      const genSalt = await bcrypt.genSalt(10);
      userdata.password = await bcrypt.hash(userdata.password, genSalt);
      userdata.role = "User";
      const response = await db
        .collection(collection.USER_COLLECTION)
        .insertOne(userdata);
      const user = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ _id: new ObjectId(response.insertedId) }, { password: 0 });
      data.user = user;
      return data;
    } catch (err) {
      return err;
    }
  },

  userLogin: async (userData) => {
    let data = { error: null, user: {} };
    try {
      const db = await main();
      const user = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });

      if (!user) {
        data.error = "User not registered";
        return data;
      }

      const isPasswordCorrect = await bcrypt.compare(
        userData.password,
        user.password
      );

      if (isPasswordCorrect) {
        delete user.password;
        let { username, email, role, mobile, gender } = user;
        data.user = { username, email, role, mobile, gender };
        return data;
      } else {
        data.error = "Password is incorrect";
        return data;
      }
    } catch (err) {
      console.error(err);
    }
  },

  getAllUser: async () => {
    try {
      const db = await main();
      const users = await db
        .collection(collection.USER_COLLECTION)
        .find({ role: "User", deleted: false }, { projection: { password: 0 } })
        .toArray();
      console.log(users);
      return users;
    } catch (err) {
      console.error(err);
    }
  },

  deleteOneUser: async (userid) => {
    try {
      const db = await main();
      const deleted = await db.collection(collection.USER_COLLECTION).updateOne(
        { _id: new ObjectId(userid) },
        {
          $set: { deleted: true },
        }
      );
      return deleted;
    } catch (err) {
      console.error(err);
    }
  },

  getOneUser: async (userId) => {
    try {
      const db = await main();
      const user = await db
        .collection(collection.USER_COLLECTION)
        .findOne(
          { _id: new ObjectId(userId) },
          { projection: { password: 0 } }
        );
      return user;
    } catch (err) {
      console.error(err);
    }
  },

  updateUser: async (userid, userInfo) => {
    const response = { error: "", success: {} };
    try {
      const db = await main();
      const user = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ _id: new ObjectId(userid) });
      if (user.email !== userInfo.email) {
        const user = await db
          .collection(collection.USER_COLLECTION)
          .findOne({ email: userInfo.email });
        if (user) {
          response.error = "Email is already registered";
          return response;
        }
      }
      response.success = await db
        .collection(collection.USER_COLLECTION)
        .updateOne({ _id: new ObjectId(userid) }, { $set: userInfo });
      return response;
    } catch (err) {
      console.error(err);
    }
  },

  searchUser: async (searchText) => {
    try {
      console.log(searchText);
      const db = await main();
      const response = await db
        .collection(collection.USER_COLLECTION)
        .find(
          {
            $and: [
              { role: "User" },
              { username: { $regex: `^${searchText}`, $options: "i" } },
            ],
          },
          { projection: { password: 0 } }
        )
        .toArray();
      console.log(response);
      return response;
    } catch (err) {
      console.error(err);
    }
  },
};
