import React, { useEffect, useState } from "react";
import "./App.css";
import { IoCodeSlash, IoSend } from "react-icons/io5";
import { BiPlanet } from "react-icons/bi";
import { FaPython, FaSpinner, FaBroom, FaSave } from "react-icons/fa";
import { TbMessageChatbot } from "react-icons/tb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [message, setMessage] = useState("");
  const [isResponseScreen, setisResponseScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("chatMessages");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) {
        setMessages(parsed);
        setisResponseScreen(true);
      }
    }
  }, []);

  const hitRequest = () => {
    if (message.trim()) {
      generateResponse(message);
    } else {
      alert("Please enter a message.");
    }
  };

  const generateResponse = async (msg) => {
    try {
      const newMessages = [...messages, { type: "userMsg", text: msg }];
      setMessages(newMessages);
      setisResponseScreen(true);
      setMessage("");
      setLoading(true);
      setCurrentResponse("");

      const genAI = new GoogleGenerativeAI(
        "AIzaSyAKG8m2JrTEEhAlItgo1qhbSV2gOvrS5dA"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(msg);
      const responseText = result.response.text();

      if (!responseText) {
        setLoading(false);
        return;
      }

      // Show first character, and start from index = 1
      let index = 0;

      const interval = setInterval(() => {
        index++;
        setCurrentResponse(responseText.slice(0, index));

        if (index >= responseText.length) {
          clearInterval(interval);
          setMessages((prev) => [
            ...prev,
            { type: "responseMsg", text: responseText },
          ]);
          setCurrentResponse("");
          setLoading(false);
        }
      }, 20); // Adjust typing speed if needed
    } catch (error) {
      console.error("Error generating response:", error);
      setLoading(false);
    }
  };

  const newChat = () => {
    setisResponseScreen(false);
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  const saveChat = () => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    alert("Chat saved to local storage.");
  };

  const samplePrompts = [
    { text: "What is coding? How can we learn it?", icon: <IoCodeSlash /> },
    { text: "Which is the red planet of solar system?", icon: <BiPlanet /> },
    { text: "In which year Python was invented?", icon: <FaPython /> },
    { text: "How can we use AI for development?", icon: <TbMessageChatbot /> },
  ];

  return (
    <div className="app-container">
      <div className="chat-header">
        <div className="action-buttons">
          <button onClick={newChat}>
            <FaBroom className="mr-2" /> Clear Chat
          </button>
          <button onClick={saveChat}>
            <FaSave className="mr-2" /> Save Chat
          </button>
        </div>
      </div>

      {!isResponseScreen && (
        <div className="greeting-container">
          <h1 className="gradient-text">Hello, Dev.</h1>
          <p className="subtitle">How can I help you today?</p>
        </div>
      )}

      <div className="chat-body">
        {isResponseScreen ? (
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${
                  msg.type === "userMsg" ? "user" : "bot"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot typing">
                {currentResponse || <FaSpinner className="spinner" />}
              </div>
            )}
          </div>
        ) : (
          <div className="prompt-grid">
            {samplePrompts.map((prompt, idx) => (
              <div
                key={idx}
                className="prompt-card"
                onClick={() => generateResponse(prompt.text)}
              >
                <p>{prompt.text}</p>
                <span className="prompt-icon">{prompt.icon}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-footer">
        <div className="input-box">
          <input
            type="text"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && hitRequest()}
          />
          {message && (
            <button className="send-btn" onClick={hitRequest}>
              <IoSend />
            </button>
          )}
        </div>
        <div className="footer-section">
          <p className="credit-text">
            Developed by ❤️ <strong>Kanagaraj S</strong> · Powered by Gemini API
          </p>
          <div className="social-links">
            <a
              href="https://github.com/kanagarajsck"
              target="_blank"
              rel="noopener noreferrer"
              className="github-icon"
            >
              <i className="fa-brands fa-github"></i>
            </a>
            <a
              href="https://linkedin.com/in/kanagarajsck"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>

            <a
              href="https://kanagarajsck2.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <i className="fa-solid fa-globe"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
