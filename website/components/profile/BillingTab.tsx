"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Payment = {
    _id: string;
    createdAt: string;
    amount: number;
    status: "paid" | "pending" | "failed";
    tournamentID: string;
    metadata: {
        order_meta: {
            payment_methods: string;
        };
    };
};

export default function BillingTab() {
    // TODO: wire to backend payment API
    const isLoading = false;
    const paymentHistory: Payment[] = [];
   
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white mb-6">
                    Transaction History
                </h3>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                ) : paymentHistory.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No transactions found.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)]">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#11111A] text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
                                {paymentHistory.map((payment) => (
                                    <tr
                                        key={payment._id}
                                        className="bg-[#11111A] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                                    >
                                        <td className="px-6 py-4 text-gray-300">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium text-white">
                                            ₹{payment.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={
                                                    payment.status === "paid"
                                                        ? "bg-green-500/10 text-green-500"
                                                        : payment.status === "pending"
                                                            ? "bg-[#ff1b6b]/10 text-[#ff1b6b]"
                                                            : "bg-red-500/10 text-red-500"
                                                }
                                            >
                                                {payment.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/tournaments/${payment.tournamentID}`}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
