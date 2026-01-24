import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";


export const ChatSidebar = ({
  chatHistory,
  question,
  setQuestion,
  onSend,
  onClose,
  asking,
  onKeyPress,
}) => (
  <div className="lg:w-1/3 transition-all duration-300">
    <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-gray-100/50 h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Career Assistant</h3>
              <p className="text-sm text-gray-500">Ask follow-up questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div
        className="flex-1 overflow-y-auto p-6"
        style={{ maxHeight: "500px" }}>
        {chatHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">
                Ask me anything about your career guidance!
              </p>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {asking && (
              <div className="flex justify-start mb-6">
                <div className="max-w-[85%] md:max-w-[75%]">
                  <div className="rounded-2xl p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-bl-none">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Career Assistant
                        </span>
                        <div className="flex gap-1">
                          <div
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}></div>
                          <div
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}></div>
                          <div
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput
        question={question}
        setQuestion={setQuestion}
        onSend={onSend}
        disabled={asking}
        onKeyPress={onKeyPress}
      />
    </div>
  </div>
);
