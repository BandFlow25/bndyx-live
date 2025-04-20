// src/components/LiveAbout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FullFooter, BndyLogo } from 'bndy-ui'; // Keep importing FullFooter from bndy-ui

import {
  Music,
  MapPin,
  Bell,
  Filter,
  Users,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';

// Define FAQ items
const faqs = [
  {
    question: "What is Feed Fatigue?",
    answer: "Feed Fatigue is the overwhelming feeling of constantly scrolling through social media platforms filled with ads, algorithms, and irrelevant content just to find information about events you're actually interested in. BNDY Live eliminates this by providing a dedicated, uncluttered platform focused solely on authentic live music events."
  },
  {
    question: "How does BNDY find events?",
    answer: "BNDY sources events directly from our community of artists, venues, and promoters who use our platform to manage and promote their events. This creates an ecosystem of verified, authentic live music experiences without the noise."
  },
  {
    question: "Is BNDY Live free to use?",
    answer: "Yes! BNDY Live is completely free for event discovery and following your favorite artists and venues. We believe access to information about live music should be open and accessible to everyone."
  },
  {
    question: "How is BNDY different from social media platforms?",
    answer: "Unlike social media platforms where music events get lost in algorithms and ads, BNDY is purpose-built for live music discovery. We don't sell your data, we don't serve ads, and we don't manipulate what you see with algorithms designed to maximize engagement."
  }
];

interface LiveAboutProps {
  showFooter?: boolean;
  LinkComponent?: React.ElementType;
}

export function LiveAbout({
  showFooter = true,
  LinkComponent = 'a'
}: LiveAboutProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect for detecting dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);


  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <main className=" bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Hero Section - Matching the style from CombinedAbout */}
      <section className="pt-16 pb-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center bg-orange-500">
            <Music className="w-10 h-10 text-white" />
          </div>

          <div className="mx-auto mb-8">
            <BndyLogo
              className="mx-auto w-48 md:w-64"
              color="#f97316"
              holeColor="#1a1f2d"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Discover Live Music </span>
            <span className="text-orange-500">Without The Noise</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            BNDY Live is designed to solve the problem of Feed Fatigue and make discovering authentic live music events simple and enjoyable again.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Problem: <span className="text-orange-500">Feed Fatigue</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              In today's digital landscape, finding authentic live music events has become increasingly difficult.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-orange-50 dark:bg-slate-800 p-6 rounded-xl border border-orange-100 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center mb-4">
                <RefreshCw className="w-8 h-8 text-orange-500" />
                <h3 className="text-xl font-semibold ml-4">Endless Scrolling</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Social media feeds are designed to maximize engagement, not to help you find events. This leads to endless scrolling through irrelevant content just to find events near you.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-slate-800 p-6 rounded-xl border border-orange-100 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center mb-4">
                <Filter className="w-8 h-8 text-orange-500" />
                <h3 className="text-xl font-semibold ml-4">Algorithm Manipulation</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Events you might love are often hidden by algorithms that prioritize sponsored content and popular posts, making it harder to discover new artists and venues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-16 px-4 bg-orange-50 dark:bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Solution: <span className="text-orange-500">BNDY Live</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              A platform dedicated exclusively to authentic live music discovery without the distractions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-orange-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location-Based Discovery</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Easily find authentic live music near you with our interactive map and filtering options.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-orange-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Notifications</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Follow your favorite artists and venues to receive notifications about upcoming events without the noise.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-orange-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Curation</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Events are added by our community of artists, venues, and music lovers, ensuring quality and relevance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Focus Section - Added from CombinedAbout */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">A Community-Driven Platform</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Supporting Grassroots</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Built specifically for independent artists, specialist venues, and passionate music fans.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">No Ads, No Noise</h3>
              <p className="text-slate-600 dark:text-slate-300">
                We don't sell your data or attention. Just pure, direct connections to the music you love.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">By Musicians, For Everyone</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Created by musicians who understand the challenges of the live music scene.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 transition-all duration-200 hover:shadow-md"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-lg text-slate-900 dark:text-white">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-orange-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-orange-500" />
                  )}
                </button>

                <div
                  className={`px-6 transition-all duration-300 ease-in-out ${expandedFaq === index ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                    } overflow-hidden`}
                >
                  <p className="text-slate-600 dark:text-slate-300">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Same style as CombinedAbout */}
      <section className="py-8 px-9 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to discover live music differently?</h2>
          <p className="text-xl text-white mb-8">Join thousands in our community finding authentic live music events every day.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkComponent
              href="https://bndy.live"
              className="px-8 py-3 rounded-full bg-white text-orange-600 hover:bg-orange-50 font-medium text-lg shadow-lg shadow-orange-500/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Explore Live Events
            </LinkComponent>

            <LinkComponent
              href="/contact"
              className="px-8 py-3 rounded-full bg-transparent hover:bg-orange-600 text-white border border-white font-medium text-lg transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Contact Us
            </LinkComponent>
          </div>
        </div>
      </section>

      {/* Footer */}
      {showFooter && (
        <FullFooter
          badgePath='/assets/images/BndyBeatBadge.png'
          className="max-w-screen-xl mx-auto"
        />
      )}
    </main>
  );
}

// Default export
export default LiveAbout;