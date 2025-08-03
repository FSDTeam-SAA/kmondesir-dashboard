"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authAPI } from "@/lib/auth-api"
import { toast } from "sonner"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits")
      return
    }

    setIsLoading(true)

    try {
      await authAPI.verifyOTP({ email, otp: otpString })
      toast.success("OTP verified successfully!")
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otpString}`)
    } catch (error) {
      toast.error("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await authAPI.forgotPassword({ email })
      toast.success("OTP resent successfully!")
      setCountdown(60)
      setCanResend(false)
    } catch (error) {
      toast.error("Failed to resend OTP")
    }
  }

  return (
    <div className="min-h-screen bg-[#2A3441] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Verify OTP</h1>
          <p className="text-gray-400 mb-2">
            Please check your Email for a message with your code. Your code is 6 numbers long.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center bg-[#334155] border-gray-600 text-white text-lg font-semibold"
              />
            ))}
          </div>

          <div className="text-center">
            {canResend ? (
              <button type="button" onClick={handleResend} className="text-[#C5A46D] hover:text-[#B8956A] text-sm">
                Resend code
              </button>
            ) : (
              <p className="text-gray-400 text-sm">Resend code in {countdown}s</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C5A46D] hover:bg-[#B8956A] text-white h-12 text-lg font-medium"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  )
}
