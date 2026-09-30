
import { useEffect, useRef, useState } from "react";
import { LuMessageCircle, LuX, LuSend } from "react-icons/lu";
import "./ChatBot.css";
 
function ChatBot() {
 
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
 
    // Scroll to newest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, isOpen]);
 
    // Focus input when the window opens
    useEffect(() => {
        if (isOpen && !loading) inputRef.current?.focus();
    }, [isOpen, loading]);
 
    // Close with Escape
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") setIsOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);
 
    // Get products from API
    useEffect(() => {
 
        fetch("https://dummyjson.com/products?limit=0")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data.products);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
 
    }, []);
 
    // Send message
    function sendMessage() {
 
        if (message.trim() === "" || loading) {
            return;
        }
 
        var userMessage = message.trim();
 
        // Show user message
        setChat((oldChat) => [
            ...oldChat,
            {
                sender: "user",
                text: userMessage
            }
        ]);
 
        setMessage("");
 
        // Check if products are loaded
        if (products.length === 0) {
 
            setChat((oldChat) => [
                ...oldChat,
                {
                    sender: "ai",
                    text: "Products are not available right now. Please try again."
                }
            ]);
 
            return;
        }
 
        // Prepare search text
        var searchText = userMessage.toLowerCase().trim();
 
        // Handle similar words
        searchText = searchText
            .replace(/sun\s+glasses/g, "sunglasses")
            .replace(/sun-glasses/g, "sunglasses")
            .replace(/sun glasses/g, "sunglasses");
 
        var results = [];
 
        // Check greetings
        var greetings = [
            "hi",
            "hello",
            "hey",
            "هاي",
            "اهلا",
            "أهلا",
            "مرحبا",
            "السلام عليكم"
        ];
 
        if (greetings.includes(searchText)) {
 
            setChat((oldChat) => [
                ...oldChat,
                {
                    sender: "ai",
                    text: "Hello! Welcome to our store. How can I help you today?"
                }
            ]);
 
            return;
        }
 
        // Search by price
        var priceMatch = searchText.match(
            /(?:less than|under|below|cheaper than|أقل من|اقل من|أرخص من|ارخص من)\s*\$?\s*(\d+(?:\.\d+)?)/i
        );
 
        if (priceMatch) {
 
            var maxPrice = Number(priceMatch[1]);
 
            results = products.filter((product) =>
                product.price < maxPrice
            );
 
        }
 
        // Search by product name or category
        else {
 
            var words = searchText
                .replace(/[?!.,]/g, "")
                .split(/\s+/);
 
            // Words that should be ignored
            var stopWords = [
                "show", "me", "all", "the", "a", "an",
                "do", "you", "have", "is", "are",
                "what", "which", "find", "search",
                "for", "please", "i", "want",
                "need", "some", "products",
                "product", "price", "of",
                "how", "much", "tell", "about",
                "can", "could", "give", "list",
                "any", "your", "in", "store",
                "عندكم", "عندك", "عايزة", "عاوزة",
                "عايز", "محتاج", "محتاجة",
                "هات", "وريني", "ايه", "اي",
                "اللي", "من", "في", "سعر",
                "منتجات", "منتج", "كام",
                "هل", "ممكن", "لو", "سمحت",
                "بكام", "عند", "موجود",
                "عاوز", "عاوزين", "محتاجه"
            ];
 
            var searchWords = words.filter((word) =>
                word.length > 1 &&
                !stopWords.includes(word)
            );
 
            // Search in product data
            results = products.filter((product) => {var productInfo = (
                    product.title + " " +
                    product.category + " " +
                    product.description
                ).toLowerCase();
 
                // Handle different ways of writing sunglasses
                productInfo = productInfo
                    .replace(/sun\s+glasses/g, "sunglasses")
                    .replace(/sun-glasses/g, "sunglasses");
 
                // All important words must match
                return searchWords.every((word) =>
                    productInfo.includes(word)
                );
 
            });
 
        }
 
        // Build reply
        var reply = "";
 
        if (results.length > 0) {
 
            reply =
                "I found " +
                results.length +
                " product(s) in our store:\n\n";
 
            results.slice(0, 10).forEach((product) => {
 
                reply +=
                    product.title +
                    " - $" +
                    product.price +
                    "\n";
 
            });
 
            if (results.length > 10) {
 
                reply +=
                    "\nShowing the first 10 products.";
 
            }
 
        } else {
 
            reply =
                "Sorry, I couldn't find matching products in our store.";
 
        }
 
        // Show reply
        setChat((oldChat) => [
            ...oldChat,
            {
                sender: "ai",
                text: reply
            }
        ]);
 
    }
 
    return (
 
        <div className="chatbot_root">
 
            {isOpen && (
 
                <div
                    className="chatbot"
                    role="dialog"
                    aria-label="Store Assistant"
                >
 
                    <div className="chatbot_header">
 
                        <div className="chatbot_title">
                            <span className="chatbot_dot" />
                            <div>
                                <h2>Store Assistant</h2>
                                <p>Ask me about our products and prices.</p>
                            </div>
                        </div>
 
                        <button
                            className="chatbot_close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            <LuX />
                        </button>
 
                    </div>
 
                    <div className="chat">
 
                        <div className="message ai">
                            Hi! I can help you find products and prices. Try
                            "laptops" or "under 50".
                        </div>
 
                        {chat.map((item, index) => (
 
                            <div
                                key={index}
                                className={"message " + item.sender}
                            >
                                {item.text}
                            </div>
 
                        ))}
 
                        {loading && (
                            <div className="chat_status">
                                Loading products...
                            </div>
                        )}
 
                        <div ref={chatEndRef} />
 
                    </div>
 
                    <div className="chat-input">
 
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Ask about our products..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                            disabled={loading}
                        />
 
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            aria-label="Send message"
                        >
                            <LuSend />
                        </button>
 
                    </div>
 
                </div>
 
            )}
 
            <button
                className={"chatbot_fab" + (isOpen ? " open" : "")}
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? "Close chat" : "Open chat"}
                aria-expanded={isOpen}
            >
                {isOpen ? <LuX /> : <LuMessageCircle />}
            </button>
 
        </div>
 
    );
 
}
 
export default ChatBot;