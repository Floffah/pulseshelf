"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AuthError } from "@pulseshelf/lib";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import { Form } from "@/components/Form";
import { api } from "@/lib/api";

const formSchema = z.object({
    name: z.string().min(5).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
});
type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
    const router = useRouter();

    const register = api.authentication.register.useMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        if (data.password !== data.confirmPassword) {
            form.setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }

        try {
            await register.mutateAsync(data);
        } catch (error: any) {
            switch (error.message) {
                case AuthError.EMAIL_TAKEN:
                    form.setError("email", {
                        type: "manual",
                        message: error.message,
                    });
                    break;
                case AuthError.NAME_TAKEN:
                    form.setError("name", {
                        type: "manual",
                        message: error.message,
                    });
                    break;
                default:
                    form.setError("email", {
                        type: "manual",
                        message: error.message,
                    });
                    break;
            }

            return;
        }

        router.push("/");
    };

    return (
        <Form
            form={form}
            submitHandler={onSubmit}
            className="flex flex-col gap-2"
        >
            <Form.Input name="name" label="Name" />
            <Form.Input name="email" label="Email" />
            <Form.Input name="password" label="Password" type="password" />
            <Form.Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
            />

            <div className="flex items-center gap-2">
                <Button
                    size="md"
                    color="secondary"
                    type="button"
                    link="/login"
                    className="flex-shrink-0 flex-grow"
                >
                    Login
                </Button>
                <Form.Button
                    size="md"
                    color="primary"
                    type="submit"
                    className="flex-shrink-0 flex-grow"
                >
                    Register
                </Form.Button>
            </div>
        </Form>
    );
}
