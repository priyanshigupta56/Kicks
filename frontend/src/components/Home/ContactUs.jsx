import React, { useEffect, useState } from "react";

const ContactUs = () => {
  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // captcha
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");

  // ui state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    makeCaptcha();
  }, []);

  const makeCaptcha = () => {
    const x = Math.floor(Math.random() * 6) + 1;
    const y = Math.floor(Math.random() * 6) + 1;
    setA(x);
    setB(y);
    setCaptchaInput("");
  };

  const isValidEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(email)) e.email = "Enter a valid email.";
    if (!subject.trim()) e.subject = "Subject is required.";
    if (!message.trim()) e.message = "Message is required.";
    if (!captchaInput.trim()) e.captcha = "Captcha is required.";
    else if (Number(captchaInput) !== a + b) e.captcha = "Captcha incorrect.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSuccessMsg("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      captcha: { a, b, answer: Number(captchaInput) },
      createdAt: new Date().toISOString(),
    };

    try {
      // send to backend route
     const res = await fetch("http://localhost:5000/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // fallback 
        console.warn("Server error, logged locally");
        console.log("Contact fallback:", payload);
        setSuccessMsg("Message recorded (server fallback).");
      } else {
        setSuccessMsg("Thanks — your message has been sent.");
      }
    } catch (err) {
      console.error("Network error, logged locally", err);
      console.log("Contact fallback:", payload);
      setSuccessMsg("Message recorded (offline fallback).");
    } finally {
      setSubmitting(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      makeCaptcha();
      setTimeout(() => setSuccessMsg(""), 6000);
    }
  };

  return (
    <section id="contact" className="py-16 bg-[#f7f8fa]">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
          <p className="mt-2 text-gray-600">
            Have a question? Send us a message and we'll get back to you.
          </p>
        </div>

      {/* Two-column layout */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
         {/* (Contact Form) */}
  <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 h-full">
 
    <div className="h-full flex flex-col">

            <form onSubmit={handleSubmit} className="space-y-4">
           
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 ${
                      errors.name ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"
                    }`}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 ${
                      errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"
                    }`}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.subject ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"
                  }`}
                />
                {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-700">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className={`mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.message ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"
                  }`}
                />
                {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
              </div>

              {/* captcha (compact) */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 font-medium">
                  {a} + {b} = ?
                </div>
                <input
                  type="number"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className={`w-28 rounded-md border px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.captcha ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"
                  }`}
                />
                <button
                  type="button"
                  onClick={makeCaptcha}
                  className="text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Refresh
                </button>
                {errors.captcha && <p className="text-sm text-red-600 ml-3">{errors.captcha}</p>}
              </div>

              {/* submit */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-md bg-black text-white px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>

                {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
              </div>
            </form>
          </div>
          </div>

       {/* RIGHT CARD (Kicks Club) */}
  <aside className="bg-[#f2f2f2] rounded-xl shadow-sm p-8 border border-gray-200 h-full">

    <div className="h-full flex flex-col justify-between">

  <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
    Join&nbsp; Kicks Club Get Rewarded<br />Today.
  </h2>

  <p className="text-gray-800 text-lg leading-relaxed mb-6">
    As kicks club member you get rewarded with what you love for doing what you love.
    Sign up today and receive immediate access to these Level 1 benefits:
  </p>

  <ul className="space-y-3 text-gray-800 text-lg mb-8">
    <li className="flex items-start gap-3">
      <span className="text-2xl leading-none">•</span>
      Free shipping
    </li>
    <li className="flex items-start gap-3">
      <span className="text-2xl leading-none">•</span>
      A 15% off voucher for your next purchase
    </li>
    <li className="flex items-start gap-3">
      <span className="text-2xl leading-none">•</span>
      Access to Members Only products and sales
    </li>
    <li className="flex items-start gap-3">
      <span className="text-2xl leading-none">•</span>
      Access to adidas Running and Training apps
    </li>
    <li className="flex items-start gap-3">
      <span className="text-2xl leading-none">•</span>
      Special offers and promotions
    </li>
  </ul>

  <p className="text-gray-800 text-lg leading-relaxed mb-8">
    Join now to start earning points, reach new levels and unlock more rewards
    and benefits from Kicks Club.
  </p>

  <button className="w-full flex items-center justify-between bg-black text-white px-6 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition">
    JOIN THE CLUB
    <span className="text-2xl">→</span>
  </button>
</div>
</aside>
        </div>
      </div>
      
    </section>
  );
};

export default ContactUs;
