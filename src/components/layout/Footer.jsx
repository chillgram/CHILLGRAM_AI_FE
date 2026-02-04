import React from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container";

export default function Footer() {
  const teamMembers = [
    { name: "하태욱", role: "PM • FE • BE • Data • Infra", github: null },
    { name: "황태민", role: "PM • FE • AI Modeling", github: null },
    { name: "김채환", role: "PM • AI Modeling", github: null },
    { name: "김지윤", role: "Data Serving • AI Modeling", github: null },
    { name: "이한조", role: "FE • AI Modeling", github: null },
    { name: "오홍찬", role: "BE • Server • AI Modeling", github: null },
    { name: "반선우", role: "FE • AI Modeling", github: null },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white py-10 mt-20">
      <Container>
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* Left Side: Brand & Description */}
          <div className="flex flex-col gap-6 md:w-1/3">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">CHILLGRAM</h2>
              <div className="space-y-1">
                <p className="text-sm text-white font-medium">AIVLE School 8기 5조의 작품입니다.</p>
                <a
                  href="https://github.com/chillgram"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-white/80 hover:text-white hover:underline transition-colors block"
                >
                  https://github.com/chillgram
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-auto">
              <div className="flex items-center gap-4 text-xs font-semibold">
                <Link to="/privacy" className="hover:text-gray-300 transition-colors">
                  개인정보 처리방침
                </Link>
                <span className="w-[1px] h-3 bg-gray-500"></span>
                <span className="hover:text-gray-300 transition-colors cursor-not-allowed">
                  이용약관
                </span>
              </div>
              <p className="text-xs text-white/70 mt-2">
                © {new Date().getFullYear()} CHILLGRAM. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Side: Team Members */}
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
              Team Chillgram
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="text-white font-medium">
                    {member.name}
                  </span>
                  <span className="text-xs text-white font-medium text-right">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </footer>
  );
}
