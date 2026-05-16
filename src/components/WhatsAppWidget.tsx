import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function WhatsAppWidget() {
  const phoneNumber = "254748042633"; 
  const message = encodeURIComponent("Hello ShambaIQ, I need help with my farm!");
  
  return (
    <Link
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-28 md:bottom-8 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all animate-bounce-slow"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="text-white fill-white" />
    </Link>
  );
}
