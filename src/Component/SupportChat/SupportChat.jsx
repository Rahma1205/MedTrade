import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next'; 

const initialMessages = [
  {
    id: '1',
    sender: 'bot',
    text: 'Welcome to MedTrade support! How can we help you today?',
    timestamp: new Date(Date.now() - 2 * 60000),
  }
];

export default function SupportChat() {
  const { t } = useTranslation(); 

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentAvailable, setAgentAvailable] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        const userMessage = messages[messages.length - 1].text.toLowerCase();
        let response;

        if ( userMessage.includes('ventilator') ||
        userMessage.includes('breathing') ||
        userMessage.includes('تنفس') ||    
        userMessage.includes('جهاز التنفس')) {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.ventilator'),
            timestamp: new Date(),
          };
        } else if (userMessage.includes('ultrasound') ||
        userMessage.includes('imaging') ||
        userMessage.includes('تصوير') ||       
        userMessage.includes('ألتراساوند')) {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.ultrasound'),
            timestamp: new Date(),
          };
        } else if (userMessage.includes('survey') ||
        userMessage.includes('form') ||
        userMessage.includes('استبيان') ||   
        userMessage.includes('نموذج')) {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.survey'),
            timestamp: new Date(),
          };
        } else if ( userMessage.includes('price') ||
        userMessage.includes('cost') ||
        userMessage.includes('expensive') ||
        userMessage.includes('سعر') ||       
        userMessage.includes('تكلفة') ||     
        userMessage.includes('غالي')  ||userMessage.includes('الأسعار')  ) {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.price'),
            timestamp: new Date(),
          };
        } else if (userMessage.includes('donate') ||
        userMessage.includes('تبرع') ) {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.donate'),
            timestamp: new Date(),
          };
          
        } else if ( userMessage.includes('buy') ||
        userMessage.includes('purchase') ||
        userMessage.includes('شراء') ) {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.buy'),
            timestamp: new Date(),
          };
        } else if ( userMessage.includes('sell') ||
        userMessage.includes('بيع') ) {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.sell'),
            timestamp: new Date(),
          };
        } else if (  userMessage.includes('agent') ||
        userMessage.includes('human') ||
        userMessage.includes('person') ||
        userMessage.includes('موظف') ||         
        userMessage.includes('إنسان')|| userMessage.includes('بشري') ) {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.agent_connect'),
            timestamp: new Date(),
          };
          setTimeout(() => {
            setAgentAvailable(true);
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              sender: 'agent',
              agentName: 'Dr. Sarah Thompson',
              agentRole: t('chat.agent_role'),
              text: t('chat.response.agent_welcome'),
              timestamp: new Date(),
            }]);
          }, 3000);
        } else {
          response = {
            id: Date.now().toString(),
            sender: 'bot',
            text: t('chat.response.default'),
            timestamp: new Date(),
          };
        }

        setMessages(prev => [...prev, response]);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [messages, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const message = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleSuggestedMessage = (text) => {
    const message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      setMessages(initialMessages);
      setNewMessage('');
      setIsTyping(false);
      setAgentAvailable(false);
      setIsMinimized(false);
    }
    setIsOpen(!isOpen);
  };
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed fixed-bottom bottom-5 right-5 me-5 d-flex flex-column align-items-end" style={{ zIndex: 99999 }}>
      {isOpen && (
        <div
          className={`card mb-4 shadow-lg ${isMinimized ? 'h-16' : 'h-500px'} transition-all duration-300`}
          style={{ width: '410px', borderRadius: '0 0.5rem 0.5rem 0.5rem' }}
        >
          <div className="card-header d-flex justify-content-between align-items-center p-3 text-white"
            style={{
              background: 'linear-gradient(to right, #0d6efd 0%, rgba(13, 110, 253, 0) 100%)',
              border: 'none',
              borderRadius: '0 0.5rem 0.5rem 0'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="fa fa-headphones"></i>
              <span className="fs-6">{t('chat.title')}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button onClick={toggleMinimize} className="btn p-0 text-white" aria-label={t('chat.minimize')}>
                <i className={`fa ${isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>
              <button onClick={toggleChat} className="btn p-0 text-white" aria-label={t('chat.close')}>
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="card-body p-0 d-flex flex-column">
                <div className="overflow-auto p-3 flex-1" style={{ maxHeight: '400px' }}>
                  {messages.map((message) => (
                    <div key={message.id} className={`d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                      {message.sender !== 'user' && (
                        <div className="me-1">
                          <div className={`avatar ${message.sender === 'agent' ? 'bg-white' : 'bg-white'}`}>
                            <i className={`fa ${message.sender === 'agent' ? 'fa-headphones' : 'fa-robot'} text-primary bg-white`}></i>
                          </div>
                        </div>
                      )}
                      <div
                        className={`rounded-3 ${message.sender === 'user' ? 'bg-primary text-white rounded-right-top' : message.sender === 'agent' ? 'bg-success text-white rounded-left-top' : 'bg-secondary-subtle rounded-left-top text-dark'}`}
                        style={{ padding: '6px 10px', maxWidth: '75%', fontSize: '0.9rem' }}
                      >
                        {message.sender === 'agent' && message.agentName && (
                          <div className="d-flex align-items-center mb-2">
                            <span className="text-xs fw-bold">{message.agentName}</span>
                            <span className="badge bg-success text-white ms-2">{message.agentRole}</span>
                          </div>
                        )}
                        <p className="mb-1">{message.text}</p>
                        <p className={`text-end fs-7 ${message.sender === 'bot' ? 'text-dark' : 'text-white'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="d-flex justify-content-start">
                      <div className="me-2">
                        <div className={`avatar ${agentAvailable ? 'bg-success' : 'bg-secondary-subtle'}`}>
                          <i className={`fa ${agentAvailable ? 'fa-headphones' : 'fa-robot'} text-primary bg-white`}></i>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="card-footer p-3 border-top">
                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <input
                    type="text"
                    placeholder={t('chat.input_placeholder')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="form-control flex-1"
                  />
                  <button type="submit" className="btn btn-primary" aria-label={t('chat.send')}>
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </div>

              <div className="px-3 pt-2 pb-3 d-flex gap-2 flex-wrap justify-content-center">
                {[
                   t('chat.suggestions.ventilator'),
                   t('chat.suggestions.ultrasound'),
                   t('chat.suggestions.price'),
                   t('chat.suggestions.agent'),
                   t('chat.suggestions.survey'),
                   t('chat.suggestions.donate'),
                   t('chat.suggestions.buy'),
                   t('chat.suggestions.sell')
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedMessage(suggestion)}
                    className="btn btn-light border rounded-pill px-3 py-1 shadow-sm"
                    style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!isOpen && (
        <div className="m-3 mb-5" style={{ zIndex: 99999 }}>
          <button
            onClick={toggleChat}
            className="btn btn-primary rounded-circle p-3 position-relative"
            aria-label={t('chat.open_chat')}
          >
            <i className="fa-solid fa-headset position-relative"></i>
            <span
              className="position-absolute top-25 end-25 translate-middle p-1 bg-success rounded-circle border border-success"
              style={{ transform: 'translate(-25%, -25%)' }}
            ></span>
          </button>
        </div>
      )}
    </div>
  );
}
