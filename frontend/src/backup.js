import React, { useState, useEffect } from 'react';
import { Heart, Users, TrendingUp, Compass, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Menu, X, CheckCircle, ArrowRight } from 'lucide-react';

// --- 1. THEME DEFINITION ---
// Define multiple themes here. You can easily switch the entire site's look
// by changing the 'currentThemeName' constant inside the App component.
const themes = {
    'OceanGreen': {
        // Main Action Colors (Buttons, Nav background)
        primaryBg: 'bg-green-600', primaryText: 'text-white', primaryHover: 'hover:bg-green-700',
        // Secondary/Accent Colors (Headers, Icons)
        secondaryBg: 'bg-indigo-600', secondaryText: 'text-indigo-600', secondaryHover: 'hover:bg-indigo-700',
        // Highlight Colors (Small text, accents)
        accentText: 'text-yellow-500',
        // Backgrounds
        background: 'bg-gray-50',
        card: 'bg-white',
        // Text/UI
        textColor: 'text-gray-800',
        shadow: 'shadow-lg',
        darkText: 'text-gray-900'
    },
    'WarmSunset': {
        primaryBg: 'bg-orange-600', primaryText: 'text-white', primaryHover: 'hover:bg-orange-700',
        secondaryBg: 'bg-red-700', secondaryText: 'text-red-700', secondaryHover: 'hover:bg-red-800',
        accentText: 'text-amber-400',
        background: 'bg-stone-100',
        card: 'bg-white',
        textColor: 'text-stone-700',
        shadow: 'shadow-xl',
        darkText: 'text-stone-900'
    },
    'DeepNavy': {
        primaryBg: 'bg-cyan-600', primaryText: 'text-gray-900', primaryHover: 'hover:bg-cyan-700',
        secondaryBg: 'bg-blue-800', secondaryText: 'text-blue-400', secondaryHover: 'hover:bg-blue-900',
        accentText: 'text-pink-400',
        background: 'bg-gray-900',
        card: 'bg-gray-800',
        textColor: 'text-gray-300',
        shadow: 'shadow-2xl shadow-cyan-500/50',
        darkText: 'text-white'
    }
};

// Placeholder Data
const ngoData = {
    name: 'GLOBAL CARE INITIATIVE',
    motto: 'Empowering Communities, Sustaining Futures.',
    impact: [
        { icon: <Users size={32} />, value: '15,000+', label: 'Lives Impacted' },
        { icon: <TrendingUp size={32} />, value: '25', label: 'Projects Completed' },
        { icon: <Heart size={32} />, value: '10M+', label: 'Raised Funds (USD)' },
    ],
    news: [
        { title: 'New Water Project Launched in Sudan', date: 'Oct 2, 2025', snippet: 'Our team successfully drilled three new boreholes, providing clean water to 5,000 people.' },
        { title: 'Annual Gala Raises Record Funds', date: 'Sep 15, 2025', snippet: 'The event saw participation from global leaders, raising over $2.5 million for educational programs.' },
    ],
    missionItems: [
        { title: 'Education', icon: <Compass />, description: 'Providing access to quality education for underprivileged children worldwide.' },
        { title: 'Health', icon: <Heart />, description: 'Delivering essential medical supplies and services to remote and conflict-affected areas.' },
        { title: 'Sustainability', icon: <Globe />, description: 'Promoting ecological balance through reforestation and clean energy adoption.' },
    ],
    testimonials: [
        { quote: 'Their commitment to transparency and measurable impact is truly inspiring.', name: 'Sarah Chen', title: 'Volunteer' },
        { quote: 'We saw immediate and lasting positive change in our village after the intervention.', name: 'Kofi Abio', title: 'Community Leader' },
    ],
    members: [
        { name: 'Dr. Evelyn Reed', role: 'Board Chair', img: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=ER' },
        { name: 'Marcus Jin', role: 'Lead Strategist', img: 'https://placehold.co/100x100/555555/FFFFFF?text=MJ' },
        { name: 'Aisha Khan', role: 'Field Director', img: 'https://placehold.co/100x100/4299E1/FFFFFF?text=AK' },
    ]
};

// --- 2. COMPONENTS ---

// Navbar Component
const Navbar = ({ theme, primaryBg, primaryText, secondaryText, primaryHover }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [];

    const ActionButton = ({ children, className = '' }) => (
        <button className={`px-4 py-2 font-semibold rounded-full transition duration-300 ${className} ${theme.shadow}`}>
            {children}
        </button>
    );

    return (
        <nav className={`sticky top-0 z-50 ${primaryBg} ${theme.shadow}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo/Name - Left Side */}
                    <div className="flex-shrink-0">
                        <a href="#" className={`text-2xl font-extrabold tracking-wider ${primaryText}`}>
                            {ngoData.name}
                        </a>
                    </div>

                    {/* Desktop Menu - Right Side */}
                    <div className="hidden lg:flex lg:space-x-8 items-center">
                        {navItems.map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className={`text-sm font-medium ${primaryText} opacity-80 ${primaryHover} p-2 rounded-lg transition duration-150`}>
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Action Buttons - Right Side */}
                    <div className="hidden lg:flex items-center space-x-3">
                        <ActionButton className={`bg-white ${theme.darkText} ${primaryHover}`}>
                            Enquire Now
                        </ActionButton>
                        <ActionButton className={`bg-yellow-400 ${theme.darkText} hover:bg-yellow-500`}>
                            <Heart className="inline-block w-4 h-4 mr-1 mb-0.5" /> Donate Now
                        </ActionButton>
                        <ActionButton className={`bg-transparent border-2 border-white ${primaryText} ${primaryHover} border-opacity-50`}>
                            Login
                        </ActionButton>
                        <ActionButton className={`bg-white ${secondaryText} font-bold hover:bg-gray-100`}>
                            Become a Member
                        </ActionButton>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className={`${primaryText} p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white`}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className={`lg:hidden ${primaryBg} pb-4 transition-all duration-300 ease-in-out`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${primaryText} ${primaryHover}`}>
                                {item}
                            </a>
                        ))}
                        <div className="flex flex-col space-y-2 pt-4 px-3">
                            <ActionButton className={`bg-white ${theme.darkText}`}>Enquire Now</ActionButton>
                            <ActionButton className={`bg-yellow-400 ${theme.darkText}`}>Donate Now</ActionButton>
                            <ActionButton className={`bg-transparent border-2 border-white ${primaryText}`}>Login</ActionButton>
                            <ActionButton className={`bg-white ${secondaryText} font-bold`}>Become a Member</ActionButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

// Footer Component
const Footer = ({ theme, primaryBg, primaryText, accentText }) => (
    <footer className={`${primaryBg} pt-16 pb-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white border-opacity-20 pb-10">
                {/* NGO Info */}
                <div>
                    <h3 className={`text-2xl font-extrabold tracking-wider mb-4 ${primaryText}`}>{ngoData.name}</h3>
                    <p className={`text-sm ${primaryText} opacity-80 mb-4`}>{ngoData.motto}</p>
                    <p className={`text-xs ${primaryText} opacity-60`}>© {new Date().getFullYear()} Global Care Initiative. All Rights Reserved.</p>
                </div>

                {/* Contact */}
                <div>
                    <h4 className={`text-lg font-semibold mb-4 ${accentText}`}>Contact Us</h4>
                    <ul className={`space-y-3 ${primaryText} opacity-80 text-sm`}>
                        <li className="flex items-start">
                            <MapPin size={18} className="mr-3 mt-1 flex-shrink-0" />
                            <span>123 Global Street, Social Hub, New York, NY 10001</span>
                        </li>
                        <li className="flex items-center">
                            <Phone size={18} className="mr-3 flex-shrink-0" />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li className="flex items-center">
                            <Mail size={18} className="mr-3 flex-shrink-0" />
                            <a href="mailto:contact@globalcare.org" className="hover:underline">contact@globalcare.org</a>
                        </li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className={`text-lg font-semibold mb-4 ${accentText}`}>Quick Links</h4>
                    <ul className={`space-y-3 ${primaryText} opacity-80 text-sm`}>
                        <li><a href="#about-us" className="hover:underline">About Us</a></li>
                        <li><a href="#our-goals" className="hover:underline">Our Missions</a></li>
                        <li><a href="#impact" className="hover:underline">Transparency</a></li>
                        <li><a href="#" className="hover:underline">Careers</a></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h4 className={`text-lg font-semibold mb-4 ${accentText}`}>Connect</h4>
                    <div className="flex space-x-4">
                        {/* Changed hover color to theme.darkText for better contrast on white background */}
                        <a href="#" aria-label="Facebook" className={`p-2 rounded-full border border-white border-opacity-40 ${primaryText} hover:bg-white ${theme.darkText} transition duration-300`}><Facebook size={20} /></a>
                        <a href="#" aria-label="Twitter" className={`p-2 rounded-full border border-white border-opacity-40 ${primaryText} hover:bg-white ${theme.darkText} transition duration-300`}><Twitter size={20} /></a>
                        <a href="#" aria-label="Instagram" className={`p-2 rounded-full border border-white border-opacity-40 ${primaryText} hover:bg-white ${theme.darkText} transition duration-300`}><Instagram size={20} /></a>
                        <a href="#" aria-label="LinkedIn" className={`p-2 rounded-full border border-white border-opacity-40 ${primaryText} hover:bg-white ${theme.darkText} transition duration-300`}><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
            <div className={`text-center pt-6 text-sm ${primaryText} opacity-60`}>
                Designed with <Heart className="inline-block w-4 h-4 text-red-400 mx-1 mb-0.5" /> by AI for a better world.
            </div>
        </div>
    </footer>
);

// --- 3. MAIN APP COMPONENT ---

const App = () => {
    // --- THEME CONTROL: CHANGE THIS VARIABLE TO SWITCH THE ENTIRE THEME ---
    const currentThemeName = 'OceanGreen'; // Options: 'OceanGreen', 'WarmSunset', 'DeepNavy'
    const theme = themes[currentThemeName];
    const { primaryBg, primaryText, secondaryBg, secondaryText, primaryHover, accentText, background, card, textColor, darkText, shadow } = theme;

    // Helper for Section Titles
    const SectionTitle = ({ id, children }) => (
        <h2 id={id} className={`text-4xl sm:text-5xl font-extrabold text-center mb-12 ${darkText} border-b-4 border-dashed border-opacity-30 pb-4`}>
            {children}
        </h2>
    );

    // Hero Section
    const HeroSection = () => (
        <section id="hero" className={`relative h-[60vh] sm:h-[80vh] flex items-center justify-center overflow-hidden ${background}`}>
            {/* Background Image/Pattern Placeholder */}
            <div className="absolute inset-0 bg-cover bg-center bg-gray-200" style={{ backgroundImage: "url('https://placehold.co/1920x1080/C6F6D5/38A169/png?text=Empowerment+Hero+Image')" }}>
                <div className={`absolute inset-0 bg-black opacity-40`}></div> {/* Dark overlay for text contrast */}
            </div>

            <div className="relative text-center max-w-4xl px-4 z-10">
                <h1 className={`text-5xl sm:text-7xl font-black text-white mb-4 leading-tight tracking-tight`}>
                    Every Life Matters. <span className={`${accentText.replace('text-', 'text-')} block sm:inline`}>Join the Global Change.</span>
                </h1>
                <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                    We are dedicated to fostering sustainable growth, education, and health in the world's most vulnerable communities.
                </p>
                <div className="flex justify-center space-x-4">
                    <button className={`px-8 py-3 text-lg font-bold rounded-full ${primaryBg} ${primaryText} ${primaryHover} ${shadow} transform hover:scale-[1.03] transition duration-300`}>
                        Explore Our Work
                    </button>
                    <button className={`px-8 py-3 text-lg font-bold rounded-full bg-white ${secondaryText} hover:bg-gray-100 ${shadow} transform hover:scale-[1.03] transition duration-300`}>
                        Watch Our Video
                    </button>
                </div>
            </div>
        </section>
    );

    // About Us Section
    const AboutUsSection = () => (
        <section id="about-us" className={`py-20 ${background}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle id="about-us">Our Story</SectionTitle>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className={`text-3xl font-bold mb-4 ${darkText}`}>From a Simple Vision to Global Impact</h3>
                        <p className={`text-lg mb-6 ${textColor}`}>
                            Founded in 2005 by a small group of passionate humanitarians, Global Care Initiative was built on the belief that localized, community-driven solutions are the key to overcoming global poverty and inequality. We started with one school project and have grown into a worldwide network.
                        </p>
                        <ul className="space-y-3">
                            {['Community-focused approach', '100% Transparency in funding', 'Sustainable and long-term projects', 'Dedicated global volunteer network'].map((item, index) => (
                                <li key={index} className="flex items-center text-md">
                                    <CheckCircle size={20} className={`mr-3 ${secondaryText}`} />
                                    <span className={`${textColor}`}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-96 rounded-3xl overflow-hidden ${shadow}">
                        <img src="https://placehold.co/600x400/90EE90/1C6E41?text=Team+Working" alt="NGO team working" className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${primaryBg.replace('bg-', 'from-')} opacity-20`}></div>
                    </div>
                </div>
            </div>
        </section>
    );

    // Our Goals/Mission Section
    const GoalsSection = () => (
        <section id="our-goals" className={`py-20 bg-opacity-70 ${primaryBg.replace('bg-green', 'bg-emerald').replace('bg-orange', 'bg-red-900/10').replace('bg-cyan', 'bg-blue-950')}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle id="our-goals" className={`${darkText.replace('text-gray-900', 'text-white')}`}>Our Core Missions</SectionTitle>
                <div className="grid md:grid-cols-3 gap-8">
                    {ngoData.missionItems.map((item, index) => (
                        <div key={index} className={`p-8 rounded-2xl ${card} ${shadow} text-center transition duration-500 hover:scale-[1.05] hover:shadow-2xl`}>
                            <div className={`inline-block p-4 rounded-full ${secondaryBg} mb-4 ${secondaryText.replace('text-', 'text-white')}`}>
                                {React.cloneElement(item.icon, { size: 40 })}
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${darkText}`}>{item.title}</h3>
                            <p className={`${textColor}`}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Impact & Metrics Section (The 'Stand Out' Section)
    const ImpactSection = () => (
        <section id="impact" className={`py-20 ${background}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle id="impact">Our Proven Impact</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {ngoData.impact.map((item, index) => (
                        <div key={index} className={`p-8 rounded-2xl text-center ${card} ${shadow}`}>
                            <div className={`${secondaryText} mb-3 mx-auto`}>{item.icon}</div>
                            <p className={`text-5xl font-black ${darkText} mb-2`}>{item.value}</p>
                            <h3 className={`text-lg font-semibold ${textColor} uppercase tracking-wider`}>{item.label}</h3>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className={`px-6 py-3 font-semibold rounded-full ${primaryBg} ${primaryText} ${primaryHover} ${shadow}`}>
                        View Full Financial Report <ArrowRight className="inline-block w-4 h-4 ml-2 mb-0.5" />
                    </button>
                </div>
            </div>
        </section>
    );

    // Testimonials Section
    const TestimonialsSection = () => (
        <section id="testimonials" className={`py-20 ${primaryBg} bg-opacity-95`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-4xl sm:text-5xl font-extrabold text-center mb-12 ${primaryText}`}>Voices of Change</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {ngoData.testimonials.map((testimonial, index) => (
                        <div key={index} className={`p-8 rounded-2xl ${card} ${shadow} relative`}>
                            <p className={`text-lg italic mb-6 ${textColor}`}>"&nbsp;{testimonial.quote}&nbsp;"</p>
                            <div className="flex items-center">
                                <img src={`https://placehold.co/60x60/${primaryBg.replace('bg-', '')}/FFFFFF?text=${testimonial.name.split(' ').map(n => n[0]).join('')}`} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                                <div>
                                    <p className={`font-bold ${darkText}`}>{testimonial.name}</p>
                                    <p className={`text-sm ${secondaryText}`}>{testimonial.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // News & Updates Section
    const NewsSection = () => (
        <section id="news" className={`py-20 ${background}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle id="news">Latest News & Updates</SectionTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ngoData.news.map((item, index) => (
                        <div key={index} className={`p-6 rounded-xl ${card} ${shadow} transition duration-300 hover:shadow-2xl`}>
                            <p className={`text-sm mb-2 ${accentText}`}>{item.date}</p>
                            <h3 className={`text-xl font-bold mb-3 ${darkText} hover:${secondaryText}`}>{item.title}</h3>
                            <p className={`text-sm ${textColor} mb-4`}>{item.snippet}</p>
                            <a href="#" className={`text-sm font-semibold ${secondaryText} hover:underline`}>Read More &rarr;</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Members Section
    const MembersSection = () => (
        <section id="members" className={`py-20 ${primaryBg.replace('bg-green', 'bg-emerald').replace('bg-orange', 'bg-red-900/10').replace('bg-cyan', 'bg-blue-950')}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle id="members" className={`${darkText.replace('text-gray-900', 'text-white')}`}>Meet Our Dedicated Team</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ngoData.members.map((member, index) => (
                        <div key={index} className={`text-center p-6 ${card} rounded-xl ${shadow}`}>
                            <img src={member.img} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white" />
                            <h4 className={`text-xl font-bold ${darkText}`}>{member.name}</h4>
                            <p className={`${secondaryText}`}>{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    return (
        <div className={`min-h-screen font-inter ${background}`}>
            {/* Navbar */}
            <Navbar theme={theme} primaryBg={primaryBg} primaryText={primaryText} secondaryText={secondaryText} primaryHover={primaryHover} />

            <main>
                <HeroSection />
                <AboutUsSection />
                <GoalsSection />
                <ImpactSection />
                <TestimonialsSection />
                <NewsSection />
                <MembersSection />
            </main>

            {/* Footer */}
            <Footer theme={theme} primaryBg={primaryBg} primaryText={primaryText} accentText={accentText} />
        </div>
    );
};

export default App;