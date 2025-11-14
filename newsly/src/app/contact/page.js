"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";

const ContactPage = () => {
  const { user } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    featureType: "feature",
    subject: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null,
          userEmail: user?.email || formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Thank you! Your feature request has been submitted successfully.",
        );
        setFormData({
          name: "",
          email: "",
          featureType: "feature",
          subject: "",
          description: "",
        });
      } else {
        setMessage(
          data.error || "Failed to submit your request. Please try again.",
        );
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-8">
        <div className="">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Contact Newsly
          </h1>
          <p className="text-text-primary mb-8">
            Have an idea for a new feature? We'd love to hear from you!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input w-full"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input w-full"
                  placeholder="john@example.com"
                  disabled={!!user?.email}
                />
                {user?.email && (
                  <p className="text-xs text-text-secondary mt-1">
                    Using your account email
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="featureType"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Request Type
              </label>
              <select
                id="featureType"
                name="featureType"
                value={formData.featureType}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="improvement">Improvement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="input w-full"
                placeholder="Brief description of your request"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="input w-full resize-none"
                placeholder="Please describe your feature request in detail..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-md ${
                message.includes("success")
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-error/10 text-error border border-error/20"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="text-text-secondary hover:text-primary transition-colors font-medium"
          >
            ← Back to previous page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

