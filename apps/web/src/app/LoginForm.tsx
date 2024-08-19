"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import { Form } from "@/components/Form";
import { api } from "@/lib/api";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
    const router = useRouter();

    const loginWithPassword =
        api.authentication.loginWithPassword.useMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        try {
            await loginWithPassword.mutateAsync(data);
        } catch (error: any) {
            form.setError("email", {
                type: "manual",
                message: error.message,
            });
            return;
        }

        router.push("/home");
    };

    return (
        <Form
            form={form}
            submitHandler={onSubmit}
            className="flex flex-col gap-2"
        >
            <Form.Input name="email" label="Email" />
            <Form.Input name="password" label="Password" type="password" />

            <div className="flex items-center gap-2">
                <Button
                    size="md"
                    color="secondary"
                    type="button"
                    link="/register"
                    className="flex-shrink-0 flex-grow"
                >
                    Register
                </Button>
                <Form.Button
                    size="md"
                    color="primary"
                    type="submit"
                    className="flex-shrink-0 flex-grow"
                >
                    Login
                </Form.Button>
            </div>
        </Form>
    );
}
