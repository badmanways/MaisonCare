"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingChatTrigger from "@/components/layout/FloatingChatTrigger";
import BookServiceModal from "@/components/modals/BookServiceModal";
import LeaveReviewModal from "@/components/modals/LeaveReviewModal";

export default function PublicChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#242423]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingChatTrigger />
      <BookServiceModal />
      <LeaveReviewModal />
    </div>
  );
}
