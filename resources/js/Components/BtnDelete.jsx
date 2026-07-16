import { router } from "@inertiajs/react";
import React, { useState } from "react";
import Svg from "@/Components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function BtnDelete({
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
                console.error("There was an error!", err);
            }
        }
    };
    return (
        <button
            type="button"
            onClick={() =>
                handleDelete(deleteUrl, deleteId, getToken, returnUrl)
            }
            className="flex-all-center button-danger cursor-pointer"
        >
            <Svg title="Delete" c={"w-5 fill-current mx-1"}>
                <DeleteSvg />
            </Svg>
            <span className="mx-1">Delete</span>
        </button>
    );
}
