import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";

function Contact() {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm("service_25fd36p", "template_9xowq6g", formRef.current, "DAKh3X85S7WRVC8BE")
      .then(
        () => { toast({ title: "✅ Message Sent", description: "We'll get back to you soon!" }); formRef.current.reset(); },
        () => { toast({ title: "❌ Failed", description: "Something went wrong. Try again.", variant: "destructive" }); }
      );
  };

  const contactInfo = [
    { icon: <MapPin size={16} />, label: "Location", value: "Karaikudi, Tamil Nadu" },
    { icon: <Mail size={16} />, label: "Email", value: "2006vigneshvicky@gmail.com" },
    { icon: <Phone size={16} />, label: "Mobile", value: "+91 89256 15178" },
  ];

  const social = [
    { label: "LeetCode", href: "https://leetcode.com/u/7VikneshVicky/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/viknesh-waran/" },
    { label: "GitHub",   href: "https://github.com/07-Vignesh" },
  ];

  return (
    <div className="page-bg">
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      {/* HERO */}
      <section className="page-content text-center py-24 sm:py-28 px-4 sm:px-6">
        <span className="badge-violet mb-6 inline-flex">Contact Us</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
          Get in <span className="accent-text">Touch</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
          Have questions, feedback, or want to collaborate? We'd love to hear from you.
        </p>
      </section>

      {/* CONTACT GRID */}
      <section className="page-content py-10 px-4 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto grid gap-6 sm:gap-8 md:grid-cols-2">

          {/* FORM */}
          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Your Name</label>
                <input name="user_name" placeholder="John Doe" required className="form-input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Email Address</label>
                <input type="email" name="user_email" placeholder="you@example.com" required className="form-input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Message</label>
                <textarea name="message" rows="5" placeholder="Tell us what you need..." required className="form-input resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-sm justify-center">Send Message</button>
            </form>
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-5">Contact Information</h3>
              <p className="text-gray-400 text-sm mb-5">We'll get back to you within 24 hours.</p>
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</div>
                      <div className="text-sm text-gray-200">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <h4 className="font-bold text-white mb-4">Follow Me</h4>
              <div className="flex flex-col gap-3">
                {social.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 rounded-lg transition-all group"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.38)"; e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  >
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{s.label}</span>
                    <ExternalLink size={14} className="text-gray-500 group-hover:text-violet-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="page-content footer-gradient text-center py-8 text-gray-500">
        <p className="text-sm">© 2026 SkillConnect. All rights reserved.</p>
        <p className="mt-1 text-xs" style={{ color: "#a78bfa" }}>Made with ❤️ by Vikneshwaran</p>
      </footer>
    </div>
  );
}

export default Contact;
