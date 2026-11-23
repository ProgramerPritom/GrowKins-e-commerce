import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  productSuggestion?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

interface GeminiToyChatbotProps {
  products: any[];
  onSelectProduct?: (product: any) => void;
  onScrollToCheckout?: () => void;
}

export const GeminiToyChatbot: React.FC<GeminiToyChatbotProps> = ({ 
  products, 
  onSelectProduct,
  onScrollToCheckout 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: 'আসসালামু আলাইকুম! GrowKins কিডস টয় ওয়ার্ল্ডে আপনাকে স্বাগতম। 🧸✨\nআমি আপনার ব্যক্তিগত খেলনা পরামর্শক। আপনার সোনামণির বয়স বা কি ধরনের খেলনা খুঁজছেন জানালে আমি সেরা মন্টেসরি ও ব্রেন ডেভেলপমেন্ট খেলনা খুঁজে দেব। যেকোনো প্রশ্ন করতে পারেন!',
      timestamp: 'এখন'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Extract API key from environment with fallback
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCo9DdFSIGc9FRpI7eqgRkPBTVO2gLzVdc';

  // Construct Live System Knowledge Base for RAG
  const buildSystemPrompt = (): string => {
    const catalogSummary = products.slice(0, 20).map((p, idx) => {
      const price = Number(p.price) || 0;
      const originalPrice = Number(p.originalPrice || p.compareAtPrice) || '';
      const age = p.ageBadge || p.ageGroup || '১–৫ বছর';
      const benefits = Array.isArray(p.benefits) ? p.benefits.join(', ') : (p.subtitle || '');
      return `${idx + 1}. [ID: ${p.id}] "${p.name}" - বর্তমান অফার মূল্য: ৳${price}${originalPrice ? ` (আগের দাম: ৳${originalPrice})` : ''} | বয়স: ${age} | সুবিধাসমূহ: ${benefits}`;
    }).join('\n');

    return `You are the friendly, expert Bengali AI Product Assistant & Child Development Specialist for "GrowKins Kids Toy World" (গ্রো কিন্স টয় ওয়ার্ল্ড - growkins.com/growkins-toy-world).
Your tone is warm, polite, reassuring, and 100% natural conversational Bengali (বাংলা).

=== POLICIES & ORDERING FACTS ===
1. **Cash on Delivery (ক্যাশ অন ডেলিভারি):**
   - সারা বাংলাদেশে সম্পূর্ণ ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।
   - কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। ডেলিভারিম্যান থেকে পার্সেল খুলে চেক করে টাকা পরিশোধ করতে পারবেন।
2. **Delivery Charges & Timing (ডেলিভারি চার্জ ও সময়):**
   - ঢাকার ভেতরে: মাত্র ৳৭০ (২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি)।
   - ঢাকার বাইরে (সকল জেলা ও থানা): মাত্র ৳১৩০ (২ থেকে ৪ দিনের মধ্যে হোম ডেলিভারি)।
3. **Safety & Quality (শিশুর শতভাগ নিরাপত্তা):**
   - প্রিমিয়াম ন্যাচারাল বিচউড ও পাইনউড কাঠ।
   - সম্পূর্ণ চাইল্ড-সেফ, নন-টক্সিক ও ইকোলজিক্যাল ওয়াটার বেসড কালার।
   - কোনো ধারালো কোণা নেই, ১০০% মসৃণ হ্যান্ড-স্যান্ডেড ফিনিশ।
4. **How to Order (অর্ডার করার নিয়ম):**
   - যেকোনো খেলনার "এখনই অর্ডার করুন" বাটন চাপলে বা পেজের নিচে নাম, ফোন ও ঠিকানা লিখে অর্ডার সাবমিট করলেই কনফার্ম হয়ে যাবে।
5. **Customer Hotline:** 01767026831

=== LIVE TOY CATALOG IN STOCK (${products.length} Products) ===
${catalogSummary}

=== INSTRUCTIONS FOR YOUR REPLIES ===
- Always reply in warm, natural Bengali (বাংলা).
- Answer the customer's question directly and concisely (2 to 3 short paragraphs maximum).
- If the customer asks for price reduction or discounts ("kom hobe na?", "দাম কম হবে?", "কিছু ছাড় দিন", "aro kom koren"):
  Explain politely that our prices are already deeply discounted special offer prices for 100% premium smooth, non-toxic child-safe toys. Mention that ordering 2 or more toys combines shipping for extra savings!
- If the customer asks how to order ("kivabe order korbo?", "অর্ডার কীভাবে করব?"):
  Explain that they just select toys and fill in their name, mobile phone number, and address at the bottom of the page with Cash on Delivery.
- If the customer asks about delivery timeline ("kobe pabo?", "koto din lagbe?"):
  Tell them: Dhaka within 24-48 hours, outside Dhaka 2-4 days.
- If the customer asks for contact/hotline: Provide 01767026831.
- When recommending a toy, mention its exact name, age suitability, and offer price in Taka (৳).
- Never make up fake toy names; only recommend from the above catalog.`;
  };

  // Find best matching product for suggestion card (ONLY when query or reply refers to toys)
  const findMatchingProduct = (query: string, botReply: string) => {
    const combined = (query + ' ' + botReply).toLowerCase();
    for (const p of products) {
      const pName = (p.name || '').toLowerCase();
      const pId = (p.id || '').toLowerCase();
      if ((pName.length > 3 && combined.includes(pName.slice(0, 5))) || combined.includes(pId)) {
        return p;
      }
    }
    // Age based matching
    if (combined.includes('১ বছর') || combined.includes('1 year') || combined.includes('1 yr') || combined.includes('১-৩')) {
      return products.find(p => (p.ageBadge || '').includes('1')) || products[0];
    }
    if (combined.includes('২ বছর') || combined.includes('2 year') || combined.includes('2 yr') || combined.includes('২-৪')) {
      return products.find(p => (p.ageBadge || '').includes('2')) || products[1] || products[0];
    }
    if (combined.includes('৩ বছর') || combined.includes('3 year') || combined.includes('3 yr') || combined.includes('৩-৬')) {
      return products.find(p => (p.ageBadge || '').includes('3')) || products[2] || products[0];
    }
    return undefined;
  };

  // Local Fallback RAG Engine
  const generateLocalFallbackReply = (q: string): { reply: string; matchedProduct?: any } => {
    const queryLower = q.toLowerCase().trim();

    // 1. Bargaining / Discount / Price reduction queries
    if (
      queryLower.includes('kom') || queryLower.includes('কম') ||
      queryLower.includes('discount') || queryLower.includes('ছাড়') ||
      queryLower.includes('offer') || queryLower.includes('কমান') ||
      queryLower.includes('dam') && queryLower.includes('kom')
    ) {
      return {
        reply: 'সম্মানিত গ্রাহক, আমাদের প্রতিটি শিক্ষণীয় খেলনায় ইতিমধ্যেই সর্বোচ্চ ছাড় দিয়ে স্পেশাল অফার প্রাইজ নির্ধারণ করা হয়েছে। শিশুদের শতভাগ নিরাপত্তা নিশ্চিতে আমরা ১০০% মসৃণ বিচউড কাঠ ও নন-টক্সিক ফুড-গ্রেড রঙ ব্যবহার করি।\n\nতবে আপনি একসাথে একাধিক খেলনা অর্ডার করলে সম্পূর্ণ ডেলিভারি চার্জ একসাথেই প্রযোজ্য হবে! আপনি চাইলে পছন্দের খেলনাটি বেছে নিয়ে এখনই অর্ডার কনফার্ম করতে পারেন।'
      };
    }

    // 2. Delivery charge queries
    if (queryLower.includes('ডেলিভারি') || queryLower.includes('চার্জ') || queryLower.includes('delivery') || queryLower.includes('charge')) {
      return {
        reply: 'আমাদের হোম ডেলিভারি চার্জ:\n• ঢাকার ভেতরে: মাত্র ৳৭০ (২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি)\n• ঢাকার বাইরে (যেকোনো জেলা/উপজেলায়): মাত্র ৳১৩০ (২ থেকে ৪ দিনের মধ্যে ডেলিভারি)\n\nআমরা সম্পূর্ণ ক্যাশ অন ডেলিভারিতে পণ্য পৌঁছাই—পণ্য হাতে পেয়ে চেক করে টাকা দিতে পারবেন!'
      };
    }

    // 3. Delivery timeline / When will I get it
    if (queryLower.includes('kobe') || queryLower.includes('কবে') || queryLower.includes('koto din') || queryLower.includes('কতদিন') || queryLower.includes('সময়')) {
      return {
        reply: 'আমাদের ডেলিভারি সময়:\n• ঢাকার ভেতরে: অর্ডার নিশ্চিত করার ২৪ থেকে ৪৮ ঘণ্টার মধ্যে পৌঁছে যাবে।\n• ঢাকার বাইরে: ২ থেকে ৪ কার্যদিবসের মধ্যে আপনার ঠিকানায় সরাসরি হোম ডেলিভারি দেওয়া হবে।'
      };
    }

    // 4. Cash on delivery / Advance payment
    if (queryLower.includes('ক্যাশ অন') || queryLower.includes('cod') || queryLower.includes('অগ্রিম') || queryLower.includes('advance')) {
      return {
        reply: 'জ্বী! আমাদের সারা বাংলাদেশেই ১০০% ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা রয়েছে। আপনাকে কোনো প্রকার অগ্রিম টাকা দিতে হবে না। পার্সেল হাতে পেয়ে খুলে দেখে তারপর মূল্য পরিশোধ করবেন।'
      };
    }

    // 5. How to order
    if (queryLower.includes('kivabe') || queryLower.includes('কীভাবে') || queryLower.includes('order') || queryLower.includes('অর্ডার') || queryLower.includes('kinbo')) {
      return {
        reply: 'অর্ডার করার নিয়ম খুবই সহজ:\n১. পছন্দের খেলনার নিচে "এখনই অর্ডার করুন" বাটনে ক্লিক করুন।\n২. অথবা পেজের নিচে গিয়ে আপনার নাম, ১১ ডিজিটের মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা লিখে "অর্ডার কনফার্ম করুন" বাটনে চাপ দিন।\n\nআমাদের প্রতিনিধি আপনার নম্বরে কল দিয়ে দ্রুত পার্সেল পাঠিয়ে দেবেন!'
      };
    }

    // 6. Hotline / Contact
    if (queryLower.includes('phone') || queryLower.includes('number') || queryLower.includes('hotline') || queryLower.includes('নম্বর') || queryLower.includes('কল') || queryLower.includes('যোগাযোগ')) {
      return {
        reply: 'আমাদের হটলাইন নম্বর: 📞 01767026831\nসকাল ৯টা থেকে রাত ১০টা পর্যন্ত যেকোনো তথ্যের জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করতে পারেন।'
      };
    }

    // 7. Product or Age recommendations
    const matched = findMatchingProduct(q, '');
    if (matched) {
      const price = Number(matched.price) || 0;
      const originalPrice = Number(matched.originalPrice || matched.compareAtPrice) || '';
      return {
        reply: `আপনার সোনামণির জন্য আমাদের সেরা পরামর্শ: "${matched.name}"।\n• উপযুক্ত বয়স: ${matched.ageBadge || '১–৫ বছর'}\n• বিশেষ অফার মূল্য: মাত্র ৳${price}${originalPrice ? ` (আগের দাম: ৳${originalPrice})` : ''}\n• ১০০% পরিবেশবান্ধব নিরাপদ কাঠ ও মসৃণ ফিনিশিং যা শিশুর মানসিক ও শারীরিক বিকাশে অত্যন্ত সহায়ক।\n\nনিচের বাটন চেপে এটি সরাসরি আপনার অর্ডারে যুক্ত করতে পারেন!`,
        matchedProduct: matched
      };
    }

    // Default polite conversational response
    return {
      reply: 'GrowKins এ আপনাকে স্বাগতম! আমাদের প্রতিটি খেলনাই শিশুদের ব্রেন ডেভেলপমেন্ট ও স্ক্রিন-টাইম কমানোর জন্য বিশেষভাবে তৈরি।\n\nআপনার বাচ্চার বয়স কত কিংবা কোনো নির্দিষ্ট খেলনা সম্পর্কে জানতে চান? আমাকে জানালে আমি সেরা তথ্য দিয়ে সাহায্য করব। অথবা আমাদের হটলাইনে কল করতে পারেন: 01767026831।'
    };
  };

  // Gemini API Multi-Turn RAG Query Processor (matching Ferry-server architecture)
  const processQueryWithGemini = async (userQuery: string): Promise<{ text: string; suggestion?: any }> => {
    const systemPrompt = buildSystemPrompt();
    const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];

    // Format multi-turn conversation history
    const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

    // Include last 4 turns for context
    const recentMessages = messages.slice(-4);
    for (const msg of recentMessages) {
      contents.push({
        role: msg.sender === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      });
    }

    // Add current query
    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    // Try models in cascade
    for (const modelName of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }]
              },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (generatedText && generatedText.trim().length > 0) {
            const matchedProduct = findMatchingProduct(userQuery, generatedText);
            return {
              text: generatedText.trim(),
              suggestion: matchedProduct ? {
                id: matchedProduct.id,
                name: matchedProduct.name,
                price: Number(matchedProduct.price) || 0,
                image: matchedProduct.featuredImage || (Array.isArray(matchedProduct.images) ? matchedProduct.images[0]?.url : matchedProduct.images?.main)
              } : undefined
            };
          }
        }
      } catch (err) {
        console.warn(`Gemini model ${modelName} failed, attempting next in cascade:`, err);
      }
    }

    // Fallback to intelligent local RAG engine if API is unavailable
    const fallback = generateLocalFallbackReply(userQuery);
    return {
      text: fallback.reply,
      suggestion: fallback.matchedProduct ? {
        id: fallback.matchedProduct.id,
        name: fallback.matchedProduct.name,
        price: Number(fallback.matchedProduct.price) || 0,
        image: fallback.matchedProduct.featuredImage || (Array.isArray(fallback.matchedProduct.images) ? fallback.matchedProduct.images[0]?.url : fallback.matchedProduct.images?.main)
      } : undefined
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: 'এখন'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await processQueryWithGemini(text);
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: response.text,
        timestamp: 'এখন',
        productSuggestion: response.suggestion
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallback = generateLocalFallbackReply(text);
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          sender: 'assistant',
          text: fallback.reply,
          timestamp: 'এখন'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <aside aria-label="Chat assistant" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 sm:px-5 py-3.5 rounded-full bg-gradient-to-r from-[#24221F] to-[#383530] hover:from-[#E76F51] hover:to-[#D45A3D] text-white font-extrabold text-xs sm:text-sm shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-white/80 group"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </div>
            <span>সরাসরি কথা বলুন</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </aside>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <aside aria-label="Customer support chat" className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[88vh] h-[580px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#24221F] to-[#383530] text-white p-4 sm:p-5 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E76F51] to-[#F4A261] flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white leading-tight flex items-center gap-2">
                  <span>GrowKins এআই চ্যাটবট</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Gemini RAG</span>
                  </span>
                </h4>
                <p className="text-[11px] text-gray-300 font-medium">
                  খেলনা পরামর্শক • সম্পূর্ণ বাংলা সহায়তা
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer hover:scale-105"
              title="চ্যাট বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="bg-[#FAF7F1] px-3.5 py-2.5 border-b border-[#E8E0D2] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px] shrink-0">
            <button
              onClick={() => handleQuickQuestion('২ বছরের বাচ্চার জন্য কোন খেলনা সবচেয়ে ভালো?')}
              className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:border-[#E76F51] hover:text-[#E76F51] shrink-0 cursor-pointer transition-all shadow-2xs"
            >
              👶 ২ বছরের খেলনা
            </button>
            <button
              onClick={() => handleQuickQuestion('ডেলিভারি চার্জ কত এবং কতদিনে পাব?')}
              className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:border-[#E76F51] hover:text-[#E76F51] shrink-0 cursor-pointer transition-all shadow-2xs"
            >
              🚚 ডেলিভারি চার্জ
            </button>
            <button
              onClick={() => handleQuickQuestion('ক্যাশ অন ডেলিভারিতে চেক করে নেওয়া যাবে?')}
              className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:border-[#E76F51] hover:text-[#E76F51] shrink-0 cursor-pointer transition-all shadow-2xs"
            >
              💵 ক্যাশ অন ডেলিভারি
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF7F1]/40 text-xs sm:text-[13px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#E76F51] text-white rounded-br-xs font-medium'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Interactive Product Recommendation Card */}
                {msg.productSuggestion && (
                  <div className="mt-2.5 bg-white rounded-2xl p-3 border border-emerald-200 shadow-md flex items-center justify-between gap-3 max-w-[88%] animate-in fade-in">
                    {msg.productSuggestion.image && (
                      <img 
                        src={msg.productSuggestion.image} 
                        alt={msg.productSuggestion.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100" 
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-xs text-gray-900 truncate">
                        {msg.productSuggestion.name}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-black">
                        ৳{msg.productSuggestion.price}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const target = products.find(p => p.id === msg.productSuggestion?.id);
                        if (target && onSelectProduct) {
                          onSelectProduct(target);
                        }
                        if (onScrollToCheckout) {
                          onScrollToCheckout();
                        }
                        setIsOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform hover:scale-105"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>অর্ডার করুন</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 bg-white px-3.5 py-2.5 rounded-2xl border border-gray-200 w-fit shadow-xs animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E76F51]" />
                <span className="text-xs font-semibold">Gemini AI উত্তর প্রস্তুত করছে...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-3.5 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="যেকোনো খেলনা বা প্রশ্ন বাংলায় লিখুন..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#E76F51] focus:ring-1 focus:ring-[#E76F51]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-[#E76F51] hover:bg-[#D45A3D] text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
              title="পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </aside>
      )}
    </>
  );
};
