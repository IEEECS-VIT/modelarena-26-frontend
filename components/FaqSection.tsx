"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is ModelArena?",
    answer:
      "ModelArena is a competitive ML platform where participants submit models and climb the leaderboard.",
  },
  {
    question: "Who can participate?",
    answer:
      "Anyone with an interest in machine learning can participate after logging in.",
  },
  {
    question: "How are models evaluated?",
    answer:
      "Models are evaluated based on predefined metrics specific to each competition.",
  },
  {
    question: "Is participation free?",
    answer:
      "Yes, ModelArena is completely free to use.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="min-h-screen bg-transparent p-12">
      <div className="bg-overlay p-8 rounded-lg max-w-7xl mx-auto w-full text-white">
        <h2 className="text-3xl font-semibold mb-8">FAQs</h2>

        <div className="max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-white/20 rounded-md">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-4 text-left font-medium text-white"
              >
                {faq.question}
                <span>
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="p-4 pt-0 text-white/70">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
