import { type NextRequest, NextResponse } from "next/server"

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export async function POST(request: NextRequest) {
  try {
    const options: PasswordOptions = await request.json()

    // Validate input
    if (options.length < 6 || options.length > 32) {
      return NextResponse.json({ error: "Password length must be between 6 and 32 characters" }, { status: 400 })
    }

    const hasAtLeastOneOption =
      options.includeUppercase || options.includeLowercase || options.includeNumbers || options.includeSymbols

    if (!hasAtLeastOneOption) {
      return NextResponse.json({ error: "At least one character type must be selected" }, { status: 400 })
    }

    // Build character pool based on user selections
    let characterPool = ""
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
    const numberChars = "0123456789"
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (options.includeUppercase) characterPool += uppercaseChars
    if (options.includeLowercase) characterPool += lowercaseChars
    if (options.includeNumbers) characterPool += numberChars
    if (options.includeSymbols) characterPool += symbolChars

    // Generate password ensuring at least one character from each selected type
    let password = ""
    const requiredChars: string[] = []

    // Add at least one character from each selected type
    if (options.includeUppercase) {
      requiredChars.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)])
    }
    if (options.includeLowercase) {
      requiredChars.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)])
    }
    if (options.includeNumbers) {
      requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)])
    }
    if (options.includeSymbols) {
      requiredChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)])
    }

    // Fill the rest of the password length with random characters from the pool
    const remainingLength = options.length - requiredChars.length
    for (let i = 0; i < remainingLength; i++) {
      password += characterPool[Math.floor(Math.random() * characterPool.length)]
    }

    // Add required characters and shuffle the entire password
    const allChars = [...requiredChars, ...password.split("")]

    // Fisher-Yates shuffle algorithm
    for (let i = allChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allChars[i], allChars[j]] = [allChars[j], allChars[i]]
    }

    const finalPassword = allChars.join("")

    return NextResponse.json({ password: finalPassword })
  } catch (error) {
    console.error("Password generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
