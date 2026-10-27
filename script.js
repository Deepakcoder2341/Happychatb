console.log("HappyChat JavaScript loaded!");
// Get HTML elements
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");

const newChatButton = document.getElementById("newChat");
const themeButton = document.getElementById("themeButton");
const chatHistory = document.getElementById("chatHistory");

const recentChatsButton = document.getElementById("recentChatsButton");
const chatHistoryButton = document.getElementById("chatHistoryButton");
const deleteHistoryButton = document.getElementById("deleteHistoryButton");

// Load saved conversations safely
let conversations = [];

try {
    conversations = JSON.parse(
        localStorage.getItem("happyChatConversations") || "[]"
    );

    if (!Array.isArray(conversations)) {
        conversations = [];
    }
} catch (error) {
    conversations = [];
}

let currentChatId = null;
let conversationStarted = false;


// Save conversations
function saveConversations() {
    localStorage.setItem(
        "happyChatConversations",
        JSON.stringify(conversations)
    );
}


// Create a new chat
function createNewChat() {
    currentChatId = Date.now().toString();

    const newConversation = {
        id: currentChatId,
        title: "New Chat",
        messages: []
    };

    conversations.push(newConversation);

    saveConversations();
    renderHistory();
    showWelcome();
}


// Show welcome screen
function showWelcome() {
    messages.replaceChildren(welcome);
    conversationStarted = false;
}


// Add message to screen
function addMessage(text, sender) {
    if (!conversationStarted) {
        welcome.remove();
        conversationStarted = true;
    }

    const message = document.createElement("div");

    message.classList.add("message");

    if (sender === "user") {
        message.classList.add("user-message");
    } else {
        message.classList.add("bot-message");
    }

    message.textContent = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}


// Display a saved chat
function openChat(chatId) {
    const chat = conversations.find(
        item => item.id === chatId
    );

    if (!chat) return;

    currentChatId = chatId;

    messages.replaceChildren();

    if (chat.messages.length === 0) {
        showWelcome();
        return;
    }

    conversationStarted = false;

    chat.messages.forEach(item => {
        addMessage(item.text, item.sender);
    });
}


// Display chat history
function renderHistory() {
    chatHistory.replaceChildren();

    conversations.slice().reverse().forEach(chat => {
        const item = document.createElement("div");

        item.className = "history-item";
        item.textContent = "💬 " + chat.title;

        item.addEventListener("click", function () {
            openChat(chat.id);
        });

        chatHistory.appendChild(item);
    });
}


// Demo bot reply
function getBotReply(text) {
    const message = text.toLowerCase();
    if (
        message.includes("hello") ||
        message.includes("hi")
    ) {
        return "Hello! 😊 Welcome to HappyChat!";
    }

    if (message.includes("your name") || message === "name") {
        return "I'm HappyChat, your friendly chatbot! 💜";
    }

    if (message.includes("javascript")) {
        return "JavaScript makes websites interactive. ⚡";
    }

    if (message.includes("how are you")) {
        return "I'm doing great! Thanks for asking. 😊";
    }

    return "That's an interesting question! 💜 I'm using demo replies right now.";
}


// Send message
messageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (text === "") return;

    if (!currentChatId) {
        createNewChat();
    }

    const chatId = currentChatId;

    const chat = conversations.find(
        item => item.id === chatId
    );

    if (!chat) return;

    // Set chat title from first message
    if (chat.messages.length === 0) {
        chat.title = text.slice(0, 25);
    }

    // Save user message
    chat.messages.push({
        text: text,
        sender: "user"
    });

    addMessage(text, "user");

    messageInput.value = "";

    saveConversations();
    renderHistory();

    // Generate demo reply
    setTimeout(function () {
        const reply = getBotReply(text);

        const savedChat = conversations.find(
            item => item.id === chatId
        );

        if (!savedChat) return;

        savedChat.messages.push({
            text: reply,
            sender: "bot"
        });

        // Show reply only in the chat where the message was sent
        if (currentChatId === chatId) {
            addMessage(reply, "bot");
        }

        saveConversations();
        renderHistory();

    }, 500);
});


// New Chat button
newChatButton.addEventListener("click", function () {
    createNewChat();

    messageInput.value = "";
    messageInput.focus();
});


// Recent Chats button
recentChatsButton.addEventListener("click", function () {
    renderHistory();
});


// Chat History button
chatHistoryButton.addEventListener("click", function () {
    renderHistory();

    if (conversations.length > 0) {
        openChat(conversations[conversations.length - 1].id);
    } else {
        alert("No chat history available!");
    }
});


// Delete History button
deleteHistoryButton.addEventListener("click", function () {
    if (conversations.length === 0) {
        alert("No chat history to delete!");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete all chat history?"
    );

    if (confirmed) {
        conversations = [];
        currentChatId = null;

        saveConversations();
        renderHistory();
        showWelcome();

        alert("Chat history deleted successfully!");
    }
});


// Theme button
themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const darkMode = document.body.classList.contains("dark-mode");

    themeButton.textContent = darkMode ? "🌙" : "☀️";

    localStorage.setItem(
        "happyChatTheme",
        darkMode ? "dark" : "light"
    );
});


// Restore theme
const savedTheme = localStorage.getItem("happyChatTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeButton.textContent = "🌙";
} else {
    document.body.classList.remove("dark-mode");
    themeButton.textContent = "☀️";
}


// Restore saved history
renderHistory();
showWelcome();