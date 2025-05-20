"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getCatchContract } from "../../../lib/contracts/CatchContract";

type CatchDetail = {
    species: string;
    method: string;
    quantity: number;
};

type CatchInfo = {
    id: string;
    location: string;
    vesselName: string;
    fisher: string;
    timestamp: number;
    verified: boolean;
    entryCount: number;
    details: CatchDetail[];
};

export default function CatchList() {
    const [catches, setCatches] = useState<CatchInfo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
            const contract = getCatchContract(provider);

            try {
                const ids = await contract.getAllCatchIds();

                const catchInfoList: CatchInfo[] = await Promise.all(
                    ids.map(async (id: string) => {
                        const [location, vesselName, fisher, timestamp, verified, entryCount] =
                            await contract.getCatchInfo(id);

                        const details: CatchDetail[] = [];

                        for (let i = 0; i < entryCount; i++) {
                            const [species, method, quantity] = await contract.getCatchDetail(id, i);
                            details.push({ species, method, quantity: Number(quantity) });
                        }

                        return {
                            id,
                            location,
                            vesselName,
                            fisher,
                            timestamp: Number(timestamp),
                            verified,
                            entryCount: Number(entryCount),
                            details,
                        };
                    })
                );

                setCatches(catchInfoList);
            } catch (err) {
                console.error("Error fetching catch info:", err);
            }
        };

        fetchData();
    }, []);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    return (
        <section>
            <h2 className="text-black">All Logged Catches</h2>
            {catches.map((c, idx) => (
                <div className="text-black" key={idx} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
                    <p><strong>ID:</strong> {c.id}</p>
                    <p><strong>Location:</strong> {c.location}</p>
                    <p><strong>Vessel:</strong> {c.vesselName}</p>
                    <p><strong>Fisher:</strong> {c.fisher}</p>
                    <p><strong>Timestamp:</strong> {formatDate(c.timestamp)}</p>
                    <p><strong>Verified:</strong> {c.verified ? "✅ Yes" : "❌ No"}</p>
                    <button
                        onClick={async () => {
                            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
                            const signer = new ethers.Wallet("0xff52c49aebfa026f246c877beb26d84024219ce02f4f728fd48791906b574370", provider);
                            const contract = getCatchContract(signer);

                            try {
                                const tx = await contract.verifyCatch(c.id, { gasLimit: 100000 });
                                await tx.wait();
                                alert("✅ Catch verified!");
                                location.reload(); // crude but effective for now
                            } catch (err) {
                                console.error("Verification failed:", err);
                            }
                        }}
                        className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        ✅ Verify Catch
                    </button>

                    <p><strong>Catch Details:</strong></p>
                    <ul>
                        {c.details.map((d, i) => (
                            <li key={i}>
                                {d.quantity}x {d.species} caught using {d.method}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}
