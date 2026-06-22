import { Link } from 'react-router-dom';
import {
    AcademicCapIcon,
    UserGroupIcon,
    LightBulbIcon,
    ChartBarIcon,
    CheckCircleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const About = () => {

    const values = [
        {
            icon: <LightBulbIcon className="w-8 h-8 text-[#7c3aed]" />,
            title: "Learn Smarter",
            description: "We use AI to personalise your learning path so you spend time on what actually matters for your goals."
        },
        {
            icon: <UserGroupIcon className="w-8 h-8 text-[#7c3aed]" />,
            title: "Community First",
            description: "Learning is better together. GrowAcademy connects students, instructors, and industry professionals in one place."
        },
        {
            icon: <AcademicCapIcon className="w-8 h-8 text-[#7c3aed]" />,
            title: "Expert Instruction",
            description: "Every course is built by instructors with real-world experience — not just academic knowledge."
        },
        {
            icon: <ChartBarIcon className="w-8 h-8 text-[#7c3aed]" />,
            title: "Measurable Growth",
            description: "Track your progress with detailed analytics and earn certificates that employers actually recognise."
        },
    ];

    const stats = [
        { number: "10,000+", label: "Students Enrolled" },
        { number: "500+", label: "Expert Instructors" },
        { number: "1,000+", label: "Quality Courses" },
    ];

    const team = [
        {
            name: "Abu Shahma",
            role: "Founder & CEO",
            description: "Passionate about making quality education accessible to every learner, regardless of background."
        },
        {
            name: "Abu Shufan",
            role: "Head of Curriculum",
            description: "10+ years in edtech, ensuring every course meets industry standards and learner expectations."
        },
        {
            name: "Rohan Das",
            role: "Lead Engineer",
            description: "Building the AI-powered infrastructure that makes personalised learning possible at scale."
        },
    ];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">

            {/* ─── HERO ─── */}
            <section className="relative py-16 md:py-24 overflow-hidden">

                {/* Glow — right */}
                <div className="absolute -right-32 top-0 w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[120px] z-0 pointer-events-none" />
                {/* Glow — left */}
                <div className="absolute -left-20 bottom-0 w-80 h-80 bg-purple-300 opacity-15 rounded-full blur-3xl z-0 pointer-events-none" />

                <div className="relative z-10 container mx-auto px-6 md:px-12 text-center max-w-3xl">
                    <p className="inline-flex items-center text-[#7c3aed] text-xs font-semibold tracking-widest border border-[#7c3aed] rounded-full px-4 py-1 mb-8">
                        ABOUT GROWACADEMY
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black">
                        We believe everyone deserves to{" "}
                        <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                            grow.
                        </span>
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mb-10">
                        GrowAcademy is an AI-powered edtech platform built to bridge the gap between where you are and where you want to be — through expert-led courses, real community, and smart learning tools.
                    </p>
                    <Link
                        to="/courses"
                        className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
                    >
                        Start Learning Today
                    </Link>
                </div>
            </section>

            {/* ─── MISSION ─── */}
            <section className="py-14 md:py-20 bg-gray-50">
                <div className="container mx-8 px-6 md:px-12">
                    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div>
                            <p className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">
                                Our Mission
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-black mb-5 leading-snug">
                                Making quality education{" "}
                                <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                                    accessible to all.
                                </span>
                            </h2>
                            <p className="text-gray-600 text-base leading-relaxed mb-4">
                                We started GrowAcademy with one question: why does quality education still feel out of reach for so many people? Too expensive, too rigid, too disconnected from what the real world actually needs.
                            </p>
                            <p className="text-gray-500 text-base leading-relaxed">
                                So we built a platform that puts the learner first — flexible schedules, industry-relevant content, and AI that adapts to how you learn best. Whether you're switching careers, upskilling, or learning something new for the first time, GrowAcademy is built for you.
                            </p>
                        </div>

                        {/* Stats Block */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-8 px-12">
                            {stats.map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 cursor-default"
                                >
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent mb-1">
                                        {stat.number}
                                    </h3>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── VALUES ─── */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6 md:px-12">
                    <p className="text-center text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">
                        What We Stand For
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-black">
                        Our core{" "}
                        <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                            values.
                        </span>
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
                        Everything we build and every decision we make comes back to these four principles.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mx-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group bg-white border border-gray-500 p-6 rounded-2xl shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 cursor-default"
                            >
                                <p className="text-4xl font-bold text-black mb-2 group-hover:text-purple-900 transition">
                                    0{index + 1}
                                </p>
                                <div className="mb-4">{value.icon}</div>
                                <h3 className="text-gray-900 text-lg font-semibold mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-500">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TEAM ─── */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-6 md:px-12">
                    <p className="text-center text-xs font-semibold tracking-widest text-[#7c3aed] uppercase mb-3">
                        The Team
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
                        The people behind{" "}
                        <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                            GrowAcademy.
                        </span>
                    </h2>
                    <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">
                        A small team obsessed with learning, technology, and making education work better for everyone.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mx-8">
                        {team.map((member, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md hover:shadow-2xl hover:border-purple-700 transition-all duration-300 cursor-default"
                            >
                                {/* Avatar placeholder */}
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center mb-4">
                                    <span className="text-white text-xl font-bold">
                                        {member.name.charAt(0)}
                                    </span>
                                </div>
                                <h3 className="text-gray-900 font-semibold text-lg mb-1">{member.name}</h3>
                                <p className="text-xs font-semibold text-[#7c3aed] tracking-wide uppercase mb-3">
                                    {member.role}
                                </p>
                                <p className="text-sm text-gray-500 leading-relaxed">{member.description}</p>
                            </div>
                        ))}
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
                        Join Us Today
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-2xl mx-auto">
                        Ready to start your learning journey?
                    </h2>
                    <p className="text-purple-200 text-base md:text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of students already building real skills on GrowAcademy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-block bg-white text-[#7c3aed] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
                        >
                            Get Started Free →
                        </Link>
                        <Link
                            to="/courses"
                            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#7c3aed] transition"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;