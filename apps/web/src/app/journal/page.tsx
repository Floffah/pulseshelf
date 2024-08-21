import { EntryList } from "@/app/journal/EntryList";
import { NewEntryForm } from "@/app/journal/NewEntryForm";

export default function HomePage() {
    return (
        <main className="flex flex-col gap-10">
            <NewEntryForm />

            <EntryList />
        </main>
    );
}
