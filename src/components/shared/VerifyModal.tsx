import React, { useState } from "react";
import { ShieldCheck, X } from "lucide-react";

interface VerifyModalProps {
  onClose: () => void;
  onVerifySuccess: () => void;
  showAlert: (text: string, type?: "success" | "error" | "info") => void;
}

export default function VerifyModal({
  onClose,
  onVerifySuccess,
  showAlert
}: VerifyModalProps) {
  const [verificationAadhaar, setVerificationAadhaar] = useState("");
  const [verificationOtp, setVerificationOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRequestVerificationOtp = () => {
    if (!verificationAadhaar || verificationAadhaar.length < 12) {
      showAlert("Please enter a valid 12-digit Aadhaar ID.", "error");
      return;
    }
    setOtpSent(true);
    showAlert("OTP sent to Aadhaar-linked mobile number.", "success");
  };

  const handleVerifyResidentAndClaim = () => {
    if (!verificationOtp || verificationOtp.length < 6) {
      showAlert("Please enter the 6-digit confirmation OTP.", "error");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      onVerifySuccess();
      setIsVerifying(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl text-left flex flex-col animate-fade-in border border-slate-100">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-display font-black text-slate-900 text-base">Claim Verified Resident Badge</h2>
          </div>
          <button 
            id="close-verify-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 text-left">
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            To guarantee organic, non-automated municipal dialogue, verify your Indian residency. Verified Resident profiles unlock **2x Grievance Vote Power** and award **+100 Civic Reputation Points** immediately.
          </p>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase">12-Digit Aadhaar / Resident ID</label>
            <input
              id="verify-aadhaar-input"
              type="text"
              maxLength={12}
              disabled={otpSent}
              placeholder="e.g. 5432 9876 1234"
              value={verificationAadhaar}
              onChange={(e) => setVerificationAadhaar(e.target.value.replace(/\D/g, ""))}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-twitter-blue bg-slate-50 text-slate-700 font-medium"
            />
          </div>

          {otpSent && (
            <div className="flex flex-col gap-1 text-left animate-fade-in">
              <label className="text-[10px] font-bold text-emerald-700 uppercase">6-Digit Mobile Confirmation OTP</label>
              <input
                id="verify-otp-input"
                type="text"
                maxLength={6}
                placeholder="e.g. 451290"
                value={verificationOtp}
                onChange={(e) => setVerificationOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-twitter-blue bg-slate-50 font-black text-center text-lg tracking-widest text-slate-800"
              />
              <span className="text-[9.5px] text-slate-400 mt-1 font-medium">One-Time password dispatched to Aadhaar linked mobile ending in ••••99</span>
            </div>
          )}

          {/* Modal action */}
          <div className="mt-2.5">
            {!otpSent ? (
              <button
                id="request-otp-btn"
                type="button"
                onClick={handleRequestVerificationOtp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-100 transition cursor-pointer"
              >
                Send Verification OTP
              </button>
            ) : (
              <button
                id="submit-otp-verify-btn"
                type="button"
                onClick={handleVerifyResidentAndClaim}
                disabled={isVerifying}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-200 transition cursor-pointer"
              >
                {isVerifying ? "Securing Credentials..." : "Confirm OTP & Unlock Badge"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
