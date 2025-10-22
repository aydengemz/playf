"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    // Animate amount
    const finalAmount = 100;
    const duration = 2000;
    const steps = 60;
    const increment = finalAmount / steps;
    let currentStep = 0;

    const amountInterval = setInterval(() => {
      currentStep++;
      const currentAmount = Math.min(finalAmount, currentStep * increment);
      setAmount(currentAmount);

      if (currentAmount >= finalAmount) {
        clearInterval(amountInterval);
      }
    }, duration / steps);

    // Timer countdown
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(amountInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const steps = [
    {
      number: 1,
      title: "Download Playful Rewards",
      subtitle: "Get started in seconds",
      icon: "📱"
    },
    {
      number: 2,
      title: "Complete 3-5 Tasks (Important)", 
      subtitle: "Surveys, trials & more",
      icon: "🎯"
    },
    {
      number: 3,
      title: "Get Your Rewards",
      subtitle: "Earn up to $750!",
      icon: "💰"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6B11D6] via-[#8A1FD6] to-[#A62CD6] p-2 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-[#6B11D6]/20 to-[#A62CD6]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-[#8A1FD6]/20 to-[#6B11D6]/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-r from-[#A62CD6]/20 to-[#8A1FD6]/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md mx-auto relative">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50 relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B11D6]/5 to-[#A62CD6]/5 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-6">
              {/* Logo */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/plaf.webp"
                  alt="Playful Rewards Logo"
                  width={80}
                  height={80}
                  priority
                  className="rounded-xl"
                />
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6B11D6] to-[#A62CD6] bg-clip-text text-transparent mb-3">
                Playful Rewards
              </h1>
              
              {/* Amount Display */}
              <div className="bg-gradient-to-r from-[#6B11D6]/10 to-[#A62CD6]/10 rounded-xl p-3 mb-3 border border-[#6B11D6]/20 shadow-inner">
                <p className="text-gray-600 text-sm mb-1 font-medium">Complete fun tasks to earn up to</p>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#6B11D6] to-[#A62CD6] bg-clip-text text-transparent mb-1 tracking-tight">
                  ${amount.toFixed(2)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">4.8/5.0 • 16.5k+ Reviews</span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2 mb-6">
              {steps.map((step) => (
                <div 
                  key={step.number}
                  className="group flex items-center gap-3 bg-gradient-to-r from-[#6B11D6]/10 to-[#A62CD6]/10 p-3 rounded-xl border border-[#6B11D6]/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative">
                    <div className="bg-gradient-to-r from-[#6B11D6] to-[#A62CD6] text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                    <div className="absolute -top-1 -right-1 text-base">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-base">{step.title}</p>
                    <p className="text-xs text-gray-600">{step.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button 
              className="w-full bg-gradient-to-r from-[#6B11D6] to-[#A62CD6] text-white py-4 rounded-xl font-bold text-base hover:from-[#5A0FB6] hover:to-[#8F26B6] transition-all duration-300 mb-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transform group"
              onClick={() => window.location.href = "https://affrkr.com/?TTT=PqH%2bDyuRGCtn2ef4fI49JMYeOSl1JcQ4vQJDRoz7h5U%3d&s1="}
            >
              <span>Download & Start Earning</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>

            {/* Disclaimer */}
            <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-200/50">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                This offer requires downloading the Playful Rewards app. Earnings vary based on task completion. 
                Not affiliated with any payment apps. Terms and conditions apply.
              </p>
            </div>
          </div>
        </div>

        {/* Floating testimonial */}
        <div className="mt-4 bg-white/70 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#6B11D6] to-[#A62CD6] rounded-full flex items-center justify-center text-white font-bold text-sm">
              J
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-700 font-medium">&ldquo;Made $425 in my first week! So easy and fun.&rdquo;</p>
              <p className="text-[10px] text-gray-500 mt-0.5">- Jessica M. ⭐⭐⭐⭐⭐</p>
            </div>
          </div>
        </div>

        {/* Fixed Timer at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm border-t border-white/50 z-50">
          <div className="max-w-md mx-auto flex items-center justify-center gap-2">
            <span className="text-red-600 text-sm font-medium">⏰ Offer ends in:</span>
            <span className="font-bold text-red-700">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}