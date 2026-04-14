import RegisterForm from "@/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register",
    description: "Create a new NotesApp account",
};

export default function Register() {
    return <RegisterForm />;
}