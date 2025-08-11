// src/app/login/page.jsx
'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
// We no longer need the router on this page for login, but we'll keep it for now
import { useRouter } from 'next/navigation'

// Import shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter() // Keep for potential future use or remove if not needed

  const handleSignUp = async () => {
    setError(null)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      setError(error.message)
    } else {
      handleLogin()
    }
  }

  const handleLogin = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setError(error.message)
    } else {
      // --- THE NEW FIX ---
      // This forces a full browser reload to the admin page,
      // ensuring the new session cookie is sent to the server.
      window.location.assign('/admin')
      // --- END OF NEW FIX ---
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your email below to log in or sign up.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm p-4 bg-red-100 rounded-md">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={handleLogin} className="w-full">
            Log In
          </Button>
          <Button onClick={handleSignUp} className="w-full" variant="outline">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}