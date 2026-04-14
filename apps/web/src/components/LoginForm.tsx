"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import API, { setAuthToken } from "@/lib/api";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setLoading(true);
            const res = await API.post("/auth/login", { email, password });
            const token = res.data.access_token;

            document.cookie = `token=${token}; path=/; max-age=86400`;
            setAuthToken(token);

            toast.success("Login successful!");
            router.push("/");
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Login failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-cyan-900 to-slate-900 p-4">
            <Card className="w-full max-w-md shadow-2xl border-slate-700">
                <CardHeader className="space-y-2 pb-6">
                    <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
                    <p className="text-muted-foreground text-center text-sm">Sign in to your account to continue</p>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            <Button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                variant="ghost"
                                size="icon"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <Button onClick={handleLogin} className="w-full h-11" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </Button>
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don&apos;t have an account? </span>
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Register here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
