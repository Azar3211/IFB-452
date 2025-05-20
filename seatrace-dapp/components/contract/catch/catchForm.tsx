"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getCatchContract } from "../../../lib/contracts/CatchContract";

export default function LogCatchForm() {
    const [location, setLocation] = useState("");
    const [vesselName, setVesselName] = useState("");
    const [details, setDetails] = useState([{ species: "", method: "", quantity: 0 }]);
    const [successMessage, setSuccessMessage] = useState("");

    const handleAddDetail = () => {
        setDetails([...details, { species: "", method: "", quantity: 0 }]);
    };

    const handleDetailChange = (index: number, key: string, value: string | number) => {
        const newDetails = [...details];
        newDetails[index][key as keyof typeof newDetails[0]] = value;
        setDetails(newDetails);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
        const signer = new ethers.Wallet("0xff52c49aebfa026f246c877beb26d84024219ce02f4f728fd48791906b574370", provider);
        const contract = getCatchContract(signer);

        try {
            const speciesList = details.map((d) => d.species);
            const methodList = details.map((d) => d.method);
            const quantityList = details.map((d) => Number(d.quantity));

            const tx = await contract.logCatch(location, vesselName, speciesList, methodList, quantityList, {
                gasLimit: 500000,
            });
            await tx.wait();

            setSuccessMessage("✅ Catch logged successfully!");
            setLocation("");
            setVesselName("");
            setDetails([{ species: "", method: "", quantity: 0 }]);
        } catch (err) {
            console.error(err);
            setSuccessMessage("❌ Error logging catch.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-4 space-y-4 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700">Log a New Catch</h2>

            <div className="space-y-2">
                <label className="block">
                    <span className="text-sm font-medium text-black">Location</span>
                    <input
                        type="text"
                        value={location}
                        placeholder="Enter Location"
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="text-black mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-black">Vessel Name</span>
                    <input
                        type="text"
                        placeholder="Enter Vessel Name"
                        value={vesselName}
                        onChange={(e) => setVesselName(e.target.value)}
                        required
                        className="text-black mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>
            </div>

            <h3 className="text-lg font-medium text-black">Catch Details</h3>

            {details.map((detail, idx) => (
                <div key={idx} className="border p-4 rounded-md bg-gray-50 space-y-2 mb-2">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Species"
                            value={detail.species}
                            onChange={(e) => handleDetailChange(idx, "species", e.target.value)}
                            className="text-black w-1/3 border rounded px-3 py-2"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Method"
                            value={detail.method}
                            onChange={(e) => handleDetailChange(idx, "method", e.target.value)}
                            className="text-black w-1/3 border rounded px-3 py-2"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={detail.quantity}
                            onChange={(e) => handleDetailChange(idx, "quantity", Number(e.target.value))}
                            className="text-black w-1/3 border rounded px-3 py-2"
                            required
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddDetail}
                className="text-blue-600 font-semibold hover:underline"
            >
                + Add Another Species
            </button>

            <div className="pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Submit Catch
                </button>
            </div>

            {successMessage && <p className="text-green-700 font-medium mt-2">{successMessage}</p>}
        </form>
    );
}
