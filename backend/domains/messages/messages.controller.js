const messagesService = require("./messages.service");

//find all
exports.findAll = async (req, res) => {
  try {
    const { skip, limit } = req.query;

    if (!skip || !limit) {
      return res.status(400).json({ message: "skip and limit are required" });
    }

    const messages = await messagesService.findAllMessages(req.query);

    res.json({
      frontFacingMessage: "Messages retrieved successfully",
      data: messages,
      httpStatus: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//find one
exports.findOne = async (req, res) => {
  try {
    const message = await messagesService.findOneMessage(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({
      frontFacingMessage: "Message retrieved successfully",
      data: message,
      httpStatus: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create
exports.create = async (req, res) => {
  try {
    const newMessage = await messagesService.createMessage(req.body);

    res.json({
      frontFacingMessage: "Message created successfully",
      data: newMessage,
      httpStatus: 201,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete
exports.delete = async (req, res) => {
  try {
    const deleted = await messagesService.deleteMessage(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({
      frontFacingMessage: "Message deleted successfully",
      httpStatus: 200,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
