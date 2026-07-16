import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import Svg from "@/Components/Svg";
import { api } from "@/apiService";

import ShowSvg from "@/Assets/Svg/ShowSvg";
import EditSvg from "@/Assets/Svg/EditSvg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function TdAction({
    showUrl,
    editUrl,
    deleteId,
    deleteUrl,
    getToken,
    returnUrl,
}) {
    const [error, setError] = useState(null);
    // Handle the delete operation
    const handleDelete = async (url, id, token, getReturnUrl) => {
        const isConfirmed = window.confirm(
            "Apakah anda yakin ingin menghapus data ini..?",
        );
        if (isConfirmed) {
            try {
                // Send the DELETE request to the API
                const response = await axios.post(
                    url + id,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    },
                );
                if (response.data.message) {
                    router.visit(getReturnUrl, {
                        data: { message: response.data.message },
                    });
                } else if (response.data.failed) {
                    router.visit(getReturnUrl, {
                        data: { failed: response.data.failed },
                    });
                }
            } catch (err) {
                setError(err.message);
                console.error("There was an error!", err.message);
            }
        }
    };
    return (
        <div className="flex-all-center">
            <Link
                href={showUrl}
                className="flex-all-center p-1 m-1 rounded-md bg-teal-700 text-white hover:bg-teal-500"
            >
                <Svg title="Show" c={"w-5 fill-current"}>
                    <ShowSvg />
                </Svg>
            </Link>
            <Link
                href={editUrl}
                className="flex-all-center p-1 m-1 rounded-md text-white bg-amber-700 hover:bg-amber-500"
            >
                <Svg title="Edit" c={"w-5 fill-current"}>
                    <EditSvg />
                </Svg>
            </Link>
            <button
                type="button"
                onClick={() =>
                    handleDelete(deleteUrl, deleteId, getToken, returnUrl)
                }
                className="flex-all-center p-1 m-1 rounded-md text-white bg-red-700 hover:bg-red-500 cursor-pointer"
            >
                <Svg title="Delete" c={"w-5 fill-current"}>
                    <DeleteSvg />
                </Svg>
            </button>
        </div>
    );
}
