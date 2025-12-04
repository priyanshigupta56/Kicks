import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = ({ faqs = defaultFaqs }) => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-white">
   
      <div className="max-w-[1400px] mx-auto px-8">
        
        <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="mt-2 text-gray-500">
          Got questions? We’ve got answers — quick and clear.
        </p>

        <div className="space-y-4 mt-10">
          {faqs.map((f) => {
            const isOpen = openId === f.id;
            return (
              <div
                key={f.id}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggle(f.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 transition"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {f.question}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    } text-gray-600`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-gray-700 leading-relaxed bg-white">
                    {f.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;

const defaultFaqs = [
  {
    id: "delivery",
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 3–7 business days depending on your location. Express options are available at checkout.",
  },
  {
    id: "returns",
    question: "What is your return policy?",
    answer:
      "Returns are accepted within 30 days of delivery for unworn items with original packaging.",
  },
  {
    id: "payment",
    question: "Which payment methods do you accept?",
    answer:
      "We accept UPI, Credit/Debit Cards, Net Banking, and PayPal. All transactions are secure.",
  },
];