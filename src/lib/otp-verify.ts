"use client"
import { useState } from 'react';

interface OtpVerificationOptions {
  expiryMinutes?: number;
  apiKey?: string;
  senderId?: string;
  templateId?: string;
}

export const useOtpVerification = (options: OtpVerificationOptions = {}) => {
  const {
    expiryMinutes = 5,
    apiKey = process.env.NEXT_PUBLIC_APY_KEY || "",
    senderId = process.env.NEXT_PUBLIC_SENDER_ID || "",
    templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID || ""
  } = options;
  console.log("API Key:", apiKey);
  console.log("Sender ID:", senderId);
        console.log("Template ID:", templateId);

  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (phoneNumber: string) => {
        if (!phoneNumber) return false;
        
        const generatedOTP = generateOTP();
        
        localStorage.setItem('formOTP', generatedOTP);
        localStorage.setItem('otpExpiry', String(new Date().getTime() + expiryMinutes * 60 * 1000));
        
        try {
          const data = {
            api_key: apiKey,
            msg: `Your OTP for verification is ${generatedOTP}. Valid for ${expiryMinutes} minutes.`,
            senderid: senderId,
            templateID: templateId,
            coding: "1",
            to: phoneNumber,
            callbackData: "cb"
          };

          const response = await fetch('https://smscannon.com/api/api.php', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Key ${apiKey}`
            },
            body: JSON.stringify(data)
          });
          
          const result = await response.json();
          console.log("API Response:", result);

          if (result.success) {
            setOtpSent(true);
            return true;
          } else {
            console.error("Failed to send OTP:", result);
            return false;
          }
        } catch (error) {
          console.error("Error sending OTP:", error);
          return false;
        }
      };

  const verifyOTP = () => {
    setVerifying(true);
    const storedOTP = localStorage.getItem('formOTP');
    const expiry = parseInt(localStorage.getItem('otpExpiry') || '0');
    
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (storedOTP && enteredOtp === storedOTP && new Date().getTime() < expiry) {
          setVerified(true);
          localStorage.removeItem('formOTP');
          localStorage.removeItem('otpExpiry');
          resolve(true);
        } else {
          setVerified(false);
          resolve(false);
        }
        setVerifying(false);
      }, 1000);
    });
  };

  const resetVerification = () => {
    setOtpSent(false);
    setVerified(false);
    setEnteredOtp("");
  };

  return {
    otpSent,
    verifying,
    verified,
    enteredOtp,
    setEnteredOtp,
    sendOTP,
    verifyOTP,
    resetVerification
  };
};