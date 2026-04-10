const Message = require("./entities/Message");

// get all
const findAllMessages = async (params) => {
  const { skip, limit, ...restOfParams } = params;
  return await Message.find(restOfParams).skip(skip).limit(limit);
};

// get by id
const findOneMessage = async (id) => {
  return await Message.findById(id);
};

// create
const createMessage = async (data) => {
  const message = new Message(data);
  return await message.save();
};

//update
const updateMessage = async (id, data) => {
  const message = await Message.findById(id);
  if (!message) {
    throw new Error("Message not found");
  }

  Object.assign(message, data);
  return await message.save();
};

// delete
const deleteMessage = async (id) => {
  return await Message.findByIdAndDelete(id);
};

module.exports = {
  findAllMessages,
  findOneMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};
