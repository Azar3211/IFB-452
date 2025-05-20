
import Link from "next/link";
export default function Page() {
    return (
        <>
            <h1 className="text-3xl font-bold text-center mt-4 text-black">Seatrace DApp</h1>
            <Link href="/Regulators" className="text-black hover:underline mt-4 block text-center">
                Go to Regulators Page
            </Link>
            <Link href="/Fisherman" className="text-black hover:underline mt-4 block text-center">
                Go to Fishermen Page
            </Link>
            <Link href="/Consumer" className="text-black hover:underline mt-4 block text-center">
                Go to Consumer Page
            </Link>
            <Link href="/ProcessorAndDistrbutors" className="text-black hover:underline mt-4 block text-center">
                Go to ProcessorAndDistrbutors Page
            </Link>
        </>
    );
}
