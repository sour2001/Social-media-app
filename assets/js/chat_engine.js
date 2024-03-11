class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://localhost:5000");

    if (this.userEmail) {
      this.setupConnection();
    }
  }

  setupConnection() {
    let self = this;

    this.socket.on("connect", function () {
      console.log("Connection established using sockets!");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "codeial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("A user joined!", data);
      });
    });

    // Send a message on clicking the send message button
    $("#send-message").click(function () {
      let msg = $("#chat-message-input").val();

      if (msg.trim() !== "") {
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          chatroom: "codeial",
        });
      }
    });

    self.socket.on("receive_message", function (data) {
      console.log("Message received", data.message);

      let newMessage = $("<li>");

      let messageType = data.user_email === self.userEmail ? "self-message" : "other-message";

      newMessage.append(
        $("<span>", {
          html: data.message,
        })
      );

      newMessage.append(
        $("<sub>", {
          html: data.user_email,
        })
      );

      newMessage.addClass(messageType);

      $("#chat-messages-list").append(newMessage);

      // Scroll to the bottom after a new message is added
      self.scrollToBottom();
    });
  }

  scrollToBottom() {
    let chatMessagesList = $("#chat-messages-list");
    chatMessagesList.scrollTop(chatMessagesList.prop("scrollHeight"));
  }
}

// Wrap your script in a document ready block
$(document).ready(function () {
  // Assuming you have 'userEmail' available in your template
  let userEmail = '<%= locals.user.email %>';

  // Create an instance of ChatEngine
  let chatEngine = new ChatEngine("user-chat-box", userEmail);
});
