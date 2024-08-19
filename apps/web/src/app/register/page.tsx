import RegisterForm from "@/app/register/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex h-screen">
            <div className="flex flex-shrink-0 flex-grow flex-col gap-4 p-4">
                <h1 className="w-fit text-2xl font-bold">Register</h1>

                <RegisterForm />
            </div>
            <div className="hidden flex-grow bg-blue-500 sm:block dark:bg-blue-900"></div>
        </div>
    );
}
