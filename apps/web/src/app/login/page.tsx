import LoginForm from "@/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your NotesApp account",
};

export default function Login() {
    return <LoginForm />;
}