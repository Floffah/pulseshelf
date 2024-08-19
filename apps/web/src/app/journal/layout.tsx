import NavBar from "@/components/NavBar";

export default function JournalLayout({ children }) {
    return (
        <div className="mx-auto flex flex-col gap-4 px-4 md:max-w-3xl">
            <NavBar />

            {children}
        </div>
    );
}
