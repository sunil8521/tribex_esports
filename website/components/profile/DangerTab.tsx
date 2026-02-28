"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function DangerTab() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-sm text-red-200/60 mb-8">
                    Once you delete your account, there is no going back. Please be
                    certain.
                </p>

                <div className="flex flex-col gap-4">
                    {/* Suspend */}
                    <div className="flex justify-between items-center p-4 border border-red-900/20 rounded-lg bg-red-900/5">
                        <div>
                            <h4 className="font-bold text-red-200">Suspend Account</h4>
                            <p className="text-xs text-red-200/50">
                                Temporarily disable your account.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-red-900/30 text-red-400 hover:bg-red-900/20"
                        >
                            Disable
                        </Button>
                    </div>

                    {/* Delete */}
                    <div className="flex justify-between items-center p-4 border border-red-900/20 rounded-lg bg-red-900/5">
                        <div>
                            <h4 className="font-bold text-red-200">Delete Account</h4>
                            <p className="text-xs text-red-200/50">
                                Permanently remove your data.
                            </p>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-white/10 text-white">
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        This action cannot be undone. This will permanently delete
                                        your account and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="ghost">Cancel</Button>
                                    <Button variant="destructive">Yes, delete account</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
