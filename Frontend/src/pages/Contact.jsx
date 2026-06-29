import { useState } from 'react';
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const socials = [
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/abu-shahma',
        description: 'Connect professionally',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'GitHub',
        href: 'https://github.com/AbuShahma05',
        description: 'See what I\'m building',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        ),
    },
    {
        label: 'LeetCode',
        href: 'https://leetcode.com/u/abushahmasiddiqui880',
        description: 'Check my problem solving',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.lodged763-1.048-2.737-1.248V0h-.002z" />
            </svg>
        ),
    },
    {
        label: 'X (Twitter)',
        href: 'https://x.com/Abushahma24',
        description: 'Follow my thoughts',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/abu______shahma',
        description: 'See the journey',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
        ),
    },
    {
        label: 'Portfolio',
        href: 'https://portfolio-project-psi-two.vercel.app',
        description: 'Explore my work',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
        ),
    },
];

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Wire this to your backend or emailjs later
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden  text-black ">

            {/* ─── HERO ─── */}
            <section className="relative py-16 md:py-24 overflow-hidden">

                {/* Glow — right */}
                <div className="absolute -right-32 top-0 w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[120px] z-0 pointer-events-none" />
                {/* Glow — left */}
                <div className="absolute -left-20 bottom-0 w-80 h-80 bg-purple-300 opacity-15 rounded-full blur-3xl z-0 pointer-events-none" />

                <div className="relative z-10 container mx-auto px-6 md:px-12 text-center max-w-3xl">
                    <p className="inline-flex items-center text-[#7c3aed] text-xs font-semibold tracking-widest border border-[#7c3aed] rounded-full px-4 py-1 mb-8">
                        CONTACT US
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black">
                        Let's{" "}
                        <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                            connect.
                        </span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
                        Have a question, want to collaborate, or just want to say hi? Drop a message or reach out through any of the platforms below.
                    </p>
                </div>
            </section>

            {/* ─── MAIN CONTENT ─── */}
            <section className="py-10 md:py-16 bg-white mx-8">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">

                        {/* LEFT — Contact Form */}
                        <div>
                            <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">
                                Send a Message
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                                Got something on your{" "}
                                <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                                    mind?
                                </span>
                            </h2>

                            {submitted ? (
                                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8 text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#7c3aed] to-[#a855f7] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <PaperAirplaneIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-500 text-sm">
                                        Thanks for reaching out. I'll get back to you at <span className="text-[#7c3aed] font-medium">{form.email}</span> as soon as possible.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="Your name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                placeholder="your@email.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            required
                                            placeholder="What's this about?"
                                            value={form.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={5}
                                            placeholder="Write your message here..."
                                            value={form.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm transition resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* RIGHT — Email + Socials */}
                        <div className="space-y-8">

                            {/* Direct Email */}
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">
                                    Direct Email
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                                    Prefer to email{" "}
                                    <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                                        directly?
                                    </span>
                                </h2>
                                <a
                                    href="mailto:abushahmasiddiqui880@gmail.com"
                                    className="group flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#7c3aed] to-[#a855f7] rounded-full flex items-center justify-center flex-shrink-0">
                                        <EnvelopeIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Email me at</p>
                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-[#7c3aed] transition break-all">
                                            abushahmasiddiqui880@gmail.com
                                        </p>
                                    </div>
                                </a>
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">
                                    Find Me Online
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                                    Let's connect on{" "}
                                    <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                                        socials.
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {socials.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300"
                                        >
                                            <div className="w-10 h-10 bg-purple-50 group-hover:bg-gradient-to-br group-hover:from-[#7c3aed] group-hover:to-[#a855f7] rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 text-[#7c3aed] group-hover:text-white">
                                                {social.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#7c3aed] transition">
                                                    {social.label}
                                                </p>
                                                <p className="text-xs text-gray-500">{social.description}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="relative py-16 md:py-24 overflow-hidden mx-4 sm:mx-6 md:mx-10 lg:mx-16 rounded-2xl my-16">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1f0154] to-[#d9cbe7] z-0" />
                <div className="absolute -top-10 -left-10 w-32 h-32 md:w-64 md:h-64 bg-white opacity-10 rounded-full blur-2xl md:blur-3xl z-0" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-64 md:h-64 bg-white opacity-10 rounded-full blur-2xl md:blur-3xl z-0" />

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <p className="text-purple-200 text-xs font-semibold tracking-widest uppercase mb-4">
                        Not here to talk?
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-2xl mx-auto">
                        Jump straight into learning.
                    </h2>
                    <p className="text-purple-200 text-base md:text-lg mb-10 max-w-xl mx-auto">
                        Thousands of students are already building real skills on GrowAcademy. Join them today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/courses"
                            className="inline-block bg-white text-[#7c3aed] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
                        >
                            Browse Courses →
                        </a>
                        <a
                            href="/register"
                            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#7c3aed] transition"
                        >
                            Sign Up Free
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;