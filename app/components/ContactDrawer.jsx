"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactDrawer({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to send your message."
        );
      }

      toast.success(
        "Message sent successfully! We will get back to you soon. 🙌"
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      // Close drawer after a short delay
      setTimeout(() => {
        onClose();
      }, 2500);

    } catch (error) {
      console.error("CONTACT FORM ERROR:", error);

      toast.error(
        error.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-hero text-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 lg:py-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rotaract">
              Get in touch
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Contact Us
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact form"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl text-white/70 transition hover:border-rotaract hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 lg:py-8 py-4">
          <p className="lg:mb-8 mb-6 text-sm leading-6 text-white/60">
            Have a question, idea, or want to learn more about
            Rotaract Lagos Prime? Send us a message.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-sm font-medium"
              >
                Name
              </label>

              <input
                id="contact-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-rotaract"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="contact-phone"
                className="mb-2 block text-sm font-medium"
              >
                Phone Number
              </label>

              <input
                id="contact-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="08012345678"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-rotaract"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm font-medium"
              >
                Email Address
              </label>

              <input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-rotaract"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-sm font-medium"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="How can we help?"
                className="w-full resize-none rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-rotaract"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-200">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-rotaract px-6 py-4 text-sm font-bold transition hover:bg-rotaract-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "SENDING..."
                : "SEND MESSAGE →"}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}