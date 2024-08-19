export default function AuthRoutesLayout({ children }) {
    return (
        <div className="flex h-screen">
            <div className="flex max-w-full flex-shrink-0 flex-grow flex-col gap-4 p-4 py-10 sm:max-w-[80%]">
                <h1 className="w-fit text-2xl font-bold">PulseShelf</h1>

                {children}
            </div>
            <div className="hidden flex-grow bg-blue-500 sm:block dark:bg-blue-900"></div>
        </div>
    );
}
