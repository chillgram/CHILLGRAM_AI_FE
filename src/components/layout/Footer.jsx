import React from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 border-t border-gray-800">
      <Container>
        {/* Top: Links */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-6 mb-6 text-sm text-gray-400">
          <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 w-full">
            <Link to="#" className="hover:text-white transition-colors">회사소개</Link>
            <span className="hidden md:inline text-gray-800">|</span>
            <Link to="#" className="hover:text-white transition-colors">이용약관</Link>
            <span className="hidden md:inline text-gray-800">|</span>
            <Link to="/privacy" className="text-white font-bold transition-colors">개인정보처리방침</Link>
            <span className="hidden md:inline text-gray-800">|</span>
            {/* 이용안내 제거 */}
            <Link to="/qna" className="hover:text-white transition-colors">고객만족센터</Link>
          </div>
        </div>

        {/* Middle: Brand & Info */}
        <div className="text-[11px] sm:text-xs text-gray-500 leading-relaxed font-light tracking-wide">
          <div className="mb-4">
            <h2 className="text-xl font-black text-gray-200 tracking-tight flex items-center gap-2">
              ADSCRAMBL
            </h2>
          </div>

          <div className="space-y-1">
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              <span>법인명(상호) : 주식회사 에드스크램블</span>
              <span className="text-gray-800">|</span>
              <span>대표자(성명) : AIVLE 8기 5조</span>
              <span className="text-gray-800">|</span>
              <span>사업자 등록번호 : 123-45-67890</span>
              <span className="text-gray-800">|</span>
              <span>통신판매업 신고 : 제 2024-서울송파-0000 호</span>
              <button className="bg-[#222] px-1.5 py-0.5 rounded text-[10px] border border-gray-700 hover:bg-gray-800 transition-colors ml-1">사업자정보확인</button>
            </p>
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              <span>주소 : 서울특별시 송파구 송파대로 123 (가락동) 스크램블빌딩 7층</span>
              <span className="text-gray-800">|</span>
              <span>개인정보보호 책임자 : 김스크램블</span>
            </p>
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              <span>호스팅제공자 : (주)스크램블</span>
              <span className="text-gray-800">|</span>
              <span>문의 : help@adscramble.com</span>
              <span className="text-gray-800">|</span>
              <span>고객센터 : 1533-0000</span>
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-900/50">
            <p className="text-[#333] font-medium text-[10px]">COPYRIGHT © ADSCRAMBL. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
