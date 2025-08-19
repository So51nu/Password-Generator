"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw, Shield, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  })
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generatePassword = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        throw new Error("Failed to generate password")
      }

      const data = await response.json()
      setGeneratedPassword(data.password)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!generatedPassword) return

    try {
      await navigator.clipboard.writeText(generatedPassword)
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy password to clipboard.",
        variant: "destructive",
      })
    }
  }

  const hasAtLeastOneOption =
    options.includeUppercase || options.includeLowercase || options.includeNumbers || options.includeSymbols

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-primary/5 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">SecureGen</span>
          </div>
          <div className="text-sm text-muted-foreground">Professional Password Generator</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl mt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Lock className="h-10 w-10 text-primary" />
            Password Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Create cryptographically secure passwords with advanced customization
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Controls Card */}
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-foreground">Password Settings</CardTitle>
              <CardDescription>Customize your password requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Password Length */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">Password Length</Label>
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                    {options.length}
                  </div>
                </div>
                <Slider
                  value={[options.length]}
                  onValueChange={(value) => setOptions({ ...options, length: value[0] })}
                  min={6}
                  max={32}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Weak (6)</span>
                  <span>Strong (32)</span>
                </div>
              </div>

              {/* Character Type Options */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">Character Types</Label>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="uppercase"
                        checked={options.includeUppercase}
                        onCheckedChange={(checked) => setOptions({ ...options, includeUppercase: checked as boolean })}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="uppercase" className="text-sm font-medium cursor-pointer">
                        Uppercase Letters
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">A-Z</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="lowercase"
                        checked={options.includeLowercase}
                        onCheckedChange={(checked) => setOptions({ ...options, includeLowercase: checked as boolean })}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="lowercase" className="text-sm font-medium cursor-pointer">
                        Lowercase Letters
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">a-z</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="numbers"
                        checked={options.includeNumbers}
                        onCheckedChange={(checked) => setOptions({ ...options, includeNumbers: checked as boolean })}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="numbers" className="text-sm font-medium cursor-pointer">
                        Numbers
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">0-9</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="symbols"
                        checked={options.includeSymbols}
                        onCheckedChange={(checked) => setOptions({ ...options, includeSymbols: checked as boolean })}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="symbols" className="text-sm font-medium cursor-pointer">
                        Special Characters
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">!@#$%</span>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generatePassword}
                disabled={!hasAtLeastOneOption || isGenerating}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Generating Secure Password...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Generate Password
                  </>
                )}
              </Button>

              {!hasAtLeastOneOption && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive text-center font-medium">
                    ⚠️ Please select at least one character type
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Display Card */}
          <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-foreground">Generated Password</CardTitle>
              <CardDescription>Your secure password is ready</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {generatedPassword ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={generatedPassword}
                      readOnly
                      className="pr-12 font-mono text-lg h-14 bg-muted/50 border-2 focus:border-primary text-center font-bold tracking-wider"
                    />
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-accent/20 text-accent hover:text-accent"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Cryptographically secure password generated</span>
                  </div>

                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors duration-300 bg-transparent"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Lock className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">No password generated yet</p>
                  <p className="text-sm text-muted-foreground">Configure your settings and click generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 All passwords are generated locally in your browser for maximum security
          </p>
        </div>
      </div>
    </div>
  )
}
