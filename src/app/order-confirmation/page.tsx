import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderNumber = order ?? `OMH${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      {/* Success animation */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-500" />
      </div>

      <h1 className="text-3xl font-black text-[#1A1A1A] mb-2">Order Placed Successfully!</h1>
      <p className="text-[#6B6B6B] mb-6">
        Thank you for spreading happiness! 🎉 Your order is confirmed and will be processed shortly.
      </p>

      <div className="bg-[#FFF9EE] border-2 border-[#FFE4C2] rounded-3xl p-6 mb-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <Package size={20} className="text-[#FFB449]" />
          <h3 className="font-bold text-[#1A1A1A]">Order Details</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Order Number</span>
            <span className="font-black text-[#FF8A00]">#{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Status</span>
            <span className="text-green-600 font-semibold">Confirmed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Estimated Delivery</span>
            <span className="font-semibold">3–5 Business Days</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFB449] to-[#FF8A00] rounded-3xl p-6 mb-8 text-white">
        <p className="font-black text-lg mb-1">Ohh My Happiness</p>
        <p className="text-white/90 text-sm italic">
          &ldquo;Your requirement is our responsibility.&rdquo;
        </p>
        <p className="text-white/80 text-xs mt-2">
          A confirmation email has been sent with tracking details.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders" className="btn-primary flex items-center justify-center gap-2">
          View My Orders <ArrowRight size={16} />
        </Link>
        <Link href="/store" className="btn-outline flex items-center justify-center">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
