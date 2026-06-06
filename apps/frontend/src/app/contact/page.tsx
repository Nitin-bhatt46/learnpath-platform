"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import {
  MailIcon,
  SupportIcon,
  FeedbackIcon,
  ClockIcon,
  ChevronDownIcon,
  TargetIcon
} from "@/components/ui/icons";

const faqs = [
  {
    question: "Who is LearnPath for?",
    answer: "LearnPath is designed for aspiring software engineers, students, self-taught developers, and industry professionals looking to transition to specialized engineering careers (like Full Stack, Backend, Data, AI, or DevOps) with structured curricula."
  },
  {
    question: "Do I need prior experience?",
    answer: "No prior coding experience is required for the Full Stack Web Development path. Other advanced paths like AI and Data Engineering assume a baseline familiarity with programming concepts (like variables, functions, and basic logic)."
  },
  {
    question: "Are projects included?",
    answer: "Yes! Every pathway includes structured hands-on milestones where you build concrete production-ready applications. You won't just study syntax; you'll build real platforms to display in your portfolio."
  },
  {
    question: "How are learning paths structured?",
    answer: "Pathways are broken down into Modules (e.g. JavaScript), which are composed of ordered Parts (e.g. Fundamentals, Memory Model). Inside each Part are concepts/lessons complete with explanations, interactive visual code guides, and verification quizzes."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <main className="bg-bg-primary px-4 py-12 text-text-main sm:px-6 sm:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-5xl space-y-20">
        
        {/* HERO */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-text border border-primary/10">
            Get In Touch
          </span>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-main sm:text-4xl">
            Let's Build Better Learning Together
          </h1>
          <p className="text-xs text-text-muted">
            Questions, feedback, partnerships or suggestions? We'd love to hear from you.
          </p>
        </section>

        {/* TWO COLUMN LAYOUT */}
        <section className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          
          {/* LEFT: CONTACT INFORMATION */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-text-main">Contact Information</h2>
              <p className="mt-1.5 text-xs text-text-muted">Choose the channel that fits your inquiry best.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/40 flex-shrink-0">
                  <MailIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-main">Email Address</h4>
                  <p className="mt-1 text-sm text-text-main font-semibold">bhattnitin07@gmail.com</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-muted font-medium">
                    <ClockIcon className="h-3.5 w-3.5" />
                    <span>Response time: Under 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/40 flex-shrink-0">
                  <SupportIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-main">Partnerships</h4>
                  <p className="mt-1 text-xs text-text-muted leading-5">
                    For bootcamp alignments, school integrations, or bulk student licenses.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/40 flex-shrink-0">
                  <FeedbackIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-main">Curriculum Feedback</h4>
                  <p className="mt-1 text-xs text-text-muted leading-5">
                    Suggestions for new exercises, spelling corrections, or advanced parts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="rounded-xl border border-border-color bg-card-bg p-6 shadow-3xs sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary border border-primary/20">
                  ✓
                </div>
                <h3 className="text-base font-bold text-text-main">Message Sent Successfully!</h3>
                <p className="text-xs text-text-muted max-w-xs leading-5">
                  Thank you for reaching out, {formData.name}. Our team will review your message and get back to you shortly.
                </p>
                <Button variant="secondary" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-border-color bg-bg-primary px-3.5 py-2 text-xs text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-border-color bg-bg-primary px-3.5 py-2 text-xs text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    required
                    placeholder="Feedback / Inquiry / Support"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-lg border border-border-color bg-bg-primary px-3.5 py-2 text-xs text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-border-color bg-bg-primary px-3.5 py-2 text-xs text-text-main focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* SECTION: FAQ */}
        <section className="space-y-8 border-t border-border-color/60 pt-16">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-display font-semibold text-text-main">Frequently Asked Questions</h2>
            <p className="text-xs text-text-muted">Everything you need to know about the platform structure.</p>
          </div>

          <div className="mx-auto max-w-2xl space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="rounded-xl border border-border-color bg-card-bg shadow-3xs overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-left text-xs font-bold text-text-main hover:bg-bg-primary/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-text-muted flex-shrink-0">
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-border-color/50 bg-bg-primary/40 px-5 py-3 text-xs leading-5 text-text-muted">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center space-y-5 max-w-xl mx-auto border-t border-border-color/60 pt-16">
          <h2 className="text-2xl font-display font-semibold text-text-main">Ready to Start Learning?</h2>
          <p className="text-xs text-text-muted leading-5">
            Launch your course, build actual projects, and test your knowledge. Zero setup needed.
          </p>
          <div className="flex justify-center pt-2">
            <ButtonLink href="/courses" variant="primary" size="md">
              Explore Career Paths
            </ButtonLink>
          </div>
        </section>

      </div>
    </main>
  );
}
