import LogCatchForm from "../../../components/contract/catch/catchForm";
import CatchList from "../../../components/contract/catch/catchlist";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <h1 className="text-3xl font-bold text-center mt-4 text-black">Fisherman Page</h1>
            <Link href="/" className="text-blue-500 hover:underline mt-4 block text-center">
                Go to Home Page
            </Link>

            <LogCatchForm />
            <hr />
            <CatchList />
        </>
    );
}