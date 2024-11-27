const User = require("../model/user");

const loginService = (email) => User.findOne({ email });

const updateToken = (user) => {
    return User.updateOne({ _id: user._id }, { token: user.token });
};

module.exports = { loginService, updateToken };
