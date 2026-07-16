import React, { useEffect, useRef, useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import Select from "react-select";

import { api } from "@/apiService";
import DashboardLayout from "@/Layouts/DashboardLayout";
import FormattedDateLong from "@/Utils/FormattedDateLong";

import HeaderEdit from "@/Components/HeaderEdit";
import LoadingData from "../../Components/LoadingData";
import { isAxiosError } from "axios";

import Svg from "@/Components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function Edit() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("dataUser")),
    );

    const { url } = usePage();
    const splitUrl = url.split("/");
    const requestId = splitUrl[splitUrl.length - 1];

    const [productOptions, setProductOptions] = useState([]);
    const [warehouseOptions, setWarehouseOptions] = useState([]);
    const [rows, setRows] = useState([
        { value: null, code: null, name: null, unit: null, qty: null },
    ]);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const inputQtyRef = useRef(null);
    const [purchaseRequest, setPurchaseRequest] = useState([]);
    const [products, setProducts] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [getErrors, setGetErrors] = useState({});
    const [error, setError] = useState(null);

    const { data, setData } = useForm({
        warehouse_id: "",
        note: "",
        request_by: "",
    });

    const errorRef = useRef();

    const handleSelectChange = (selectedOption, index) => {
        let rowIndex = index;
        const exists = rows.some((row) => row.value === selectedOption.value);
        if (exists) {
            const getIndex = rows.findIndex(
                (row) => row.value === selectedOption.value,
            );
            rowIndex = getIndex;
        }
        const updatedRows = [...rows];
        updatedRows[rowIndex].value = selectedOption.value;
        updatedRows[rowIndex].code = selectedOption.code;
        updatedRows[rowIndex].name = selectedOption.name;
        updatedRows[rowIndex].unit = selectedOption.unit;
        setRows(updatedRows);
        setSelectedRowId(rowIndex);
        setIsSelected(true);

        if (rowIndex === rows.length - 1 && selectedOption) {
            const newProduct = {
                id: selectedOption.value,
                request_qty: 0,
                po_qty: 0,
            };
            setProducts([...products, newProduct]);
            setRows([
                ...updatedRows,
                {
                    value: null,
                    label: null,
                    code: null,
                    name: null,
                    unit: null,
                    hasPo: null,
                    request_qty: null,
                    po_qty: null,
                },
            ]);
        } else {
            const newProducts = [...products];
            const newProduct = {
                id: selectedOption.value,
                request_qty: rows[rowIndex].request_qty,
                po_qty: rows[rowIndex].po_qty,
            };
            newProducts[rowIndex] = newProduct;
            setProducts(newProducts);
        }
    };
    const handleSelectWarehouseChange = (selectedOption) => {
        setData("warehouse_id", selectedOption.value);
        setWarehouse({
            code: selectedOption.code,
            name: selectedOption.name,
            address: selectedOption.address,
        });
    };

    const removeRow = (indexToRemove) => {
        if (products.length == 1) {
            alert("Minimal 1 produk..!!");
        } else {
            // const updatedRows = [...rows];
            // updatedRows.splice(indexToRemove, 1);
            const updatedRows = rows.filter(
                (_, index) => index !== indexToRemove,
            );
            const updatedProducts = products.filter(
                (_, index) => index !== indexToRemove,
            );
            setProducts(updatedProducts);
            setRows(updatedRows);
        }
    };

    const handleQtyChange = (e, index) => {
        products[index].request_qty = Number(e.target.value);
        rows[index].request_qty = Number(e.target.value);
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    useEffect(() => {
        if (isSelected && inputQtyRef.current) {
            inputQtyRef.current.focus();
            inputQtyRef.current.value = null;
        }
        setIsSelected(false);
    }, [isSelected]);

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
        };
        const requestWarehouses = api.get("/api/warehouses", {
            headers,
        });
        const requestProducts = api.get("/api/products", {
            headers,
        });
        const requestPurchaseRequest = api.get(
            "/api/purchase-requests/" + requestId,
            {
                headers,
            },
        );

        const fetchMultipleData = async () => {
            try {
                setLoading(true);
                const [
                    responseWarehouses,
                    responseProducts,
                    responsePurchaseRequest,
                ] = await Promise.all([
                    requestWarehouses,
                    requestProducts,
                    requestPurchaseRequest,
                ]);

                const formattedProductOptions = responseProducts.data.map(
                    (item) => ({
                        value: item.id,
                        label: item.code + " | " + item.name,
                        code: item.code,
                        name: item.name,
                        unit: item.unit,
                    }),
                );

                const formattedWarehouseOptions = responseWarehouses.data.map(
                    (item) => ({
                        value: item.id,
                        label: item.name,
                        name: item.name,
                        code: item.code,
                        address: item.address,
                    }),
                );
                const purchaseOrders =
                    responsePurchaseRequest.data.purchase_orders;

                responsePurchaseRequest.data.products.map((item, index) => {
                    const newProduct = {
                        id: item.id,
                        request_qty: item.pivot.request_qty,
                        po_qty: item.pivot.po_qty,
                    };
                    if (item.pivot.po_qty < item.pivot.request_qty) {
                        const newRow = {
                            value: item.id,
                            label: item.code + " | " + item.name,
                            code: item.code,
                            name: item.name,
                            unit: item.unit,
                            hasPo: false,
                            request_qty:
                                responsePurchaseRequest.data.request_products[
                                    index
                                ].request_qty,
                            po_qty: responsePurchaseRequest.data
                                .request_products[index].po_qty,
                        };
                        setRows((prevRows) => [newRow, ...prevRows]);
                    } else {
                        const newRow = {
                            value: item.id,
                            label: item.code + " | " + item.name,
                            code: item.code,
                            name: item.name,
                            unit: item.unit,
                            hasPo: true,
                            request_qty:
                                responsePurchaseRequest.data.request_products[
                                    index
                                ].request_qty,
                            po_qty: responsePurchaseRequest.data
                                .request_products[index].po_qty,
                        };
                        setRows((prevRows) => [newRow, ...prevRows]);
                    }
                    setProducts((prevProducts) => [
                        newProduct,
                        ...prevProducts,
                    ]);
                });

                setProductOptions(formattedProductOptions);
                setWarehouseOptions(formattedWarehouseOptions);
                // setProducts(responsePurchaseRequest.data.products);
                setPurchaseRequest(responsePurchaseRequest.data);
                setData(
                    "warehouse_id",
                    responsePurchaseRequest.data.warehouse_id,
                );
                setData("note", responsePurchaseRequest.data.note);
                setData("request_by", responsePurchaseRequest.data.request_by);
            } catch (err) {
                if (!err?.response) {
                    setError("No Server Response..!!");
                } else if (err.response?.status === 401) {
                    setError("Unauthorized..!!");
                } else {
                    setError(err.response.data.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMultipleData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");

        const dataRequest = new FormData();
        dataRequest.append("warehouse_id", data.warehouse_id);
        dataRequest.append("user_id", user.id);
        dataRequest.append("request_by", data.request_by);
        products.map((product, index) => {
            dataRequest.append(`products[${index}][id]`, product.id);
            dataRequest.append(
                `products[${index}][request_qty]`,
                product.request_qty,
            );
            dataRequest.append(`products[${index}][po_qty]`, product.po_qty);
        });
        {
            data.note != null && dataRequest.append("note", data.note);
        }
        try {
            setProcessing(true);
            const response = await api.post(
                `/api/purchase-requests/${requestId}/update`,
                dataRequest,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/purchase-requests", {
                data: {
                    message: "Edit data permintaan barang berhasil..!!",
                },
            });
        } catch (err) {
            if (!err?.response) {
                setError("No Server Response..!!");
            } else if (err.response?.status === 401) {
                setError("Unauthorized..!!");
            } else {
                setGetErrors(err.response.data.errors);
                console.log(err.response.data);
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <LoadingData />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <HeaderEdit
                        titleEdit="Data Permintaan Barang"
                        backUrl="/purchase-requests"
                        getProcessing={processing}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="p-2 border border-stone-500 rounded-lg">
                            <div className="flex items-center mt-2">
                                <label className="w-32">Nomor</label>
                                <label>:</label>
                                <label className="w-80 font-semibold ml-2">
                                    {purchaseRequest.number}
                                </label>
                            </div>
                            <div className="flex items-center mt-2">
                                <label className="w-32">Tanggal</label>
                                <label>:</label>
                                <label className="w-80 font-semibold ml-2">
                                    {FormattedDateLong(
                                        purchaseRequest.created_at,
                                    )}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-32">Diminta oleh</label>
                                <input
                                    type="text"
                                    defaultValue={data.request_by}
                                    name="request_by"
                                    className="flex px-2 h-8 w-80 font-semibold"
                                    placeholder="Input yang meminta barang"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex mt-2">
                                <label className="w-44">Catatan</label>
                                <textarea
                                    className="flex p-2 w-full"
                                    name="note"
                                    placeholder="Input catatan"
                                    rows={5}
                                    defaultValue={purchaseRequest.note}
                                    onChange={handleChange}
                                />
                                {getErrors.note && (
                                    <span
                                        ref={errorRef}
                                        className={
                                            getErrors
                                                ? "flex w-full text-red-500 text-xs items-center"
                                                : "hidden"
                                        }
                                    >
                                        {getErrors.note}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-2 border border-stone-500 rounded-lg">
                            <div className="flex items-center mt-2">
                                <label className="w-44">Ganti Gudang</label>
                                <div className="w-68">
                                    <Select
                                        defaultValue={warehouseOptions.find(
                                            (opt) =>
                                                opt.value ===
                                                purchaseRequest.warehouse.id,
                                        )}
                                        onChange={(selectedOption) =>
                                            handleSelectWarehouseChange(
                                                selectedOption,
                                            )
                                        }
                                        required
                                        options={warehouseOptions}
                                    />
                                </div>
                            </div>
                            {getErrors.warehouse_id && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.warehouse_id}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">Kode Gudang</label>
                                <label>:</label>
                                <label className="w-44 font-semibold ml-2">
                                    {purchaseRequest.warehouse.code
                                        ? purchaseRequest.warehouse.code
                                        : "-"}
                                </label>
                            </div>
                            <div className="flex items-center mt-2">
                                <label className="w-44">Nama Gudang</label>
                                <label>:</label>
                                <label className="w-44 font-semibold ml-2">
                                    {purchaseRequest.warehouse.name
                                        ? purchaseRequest.warehouse.name
                                        : "-"}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-44">Alamat</label>
                                <label>:</label>
                                <label className="w-68 font-semibold ml-2">
                                    {purchaseRequest.warehouse.address
                                        ? purchaseRequest.warehouse.address
                                        : "-"}
                                </label>
                            </div>
                        </div>
                        <div className="col-span-2">
                            {getErrors.products && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.products}
                                </span>
                            )}
                            {getErrors["products.0.request_qty"] && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors["products.0.request_qty"]}
                                </span>
                            )}
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="th-center w-12">No.</th>
                                        <th className="th-center">
                                            Produk / Barang
                                        </th>
                                        <th className="th-center w-20">
                                            Satuan
                                        </th>
                                        <th className="th-center w-20">
                                            Jumlah
                                        </th>
                                        <th className="th-center w-20">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index}>
                                            <td className="td-center">
                                                {index + 1}
                                            </td>
                                            <td className="td-left">
                                                <Select
                                                    isDisabled={row.hasPo}
                                                    value={
                                                        row.value
                                                            ? productOptions.find(
                                                                  (opt) =>
                                                                      opt.value ===
                                                                      row.value,
                                                              )
                                                            : null
                                                    }
                                                    onChange={(
                                                        selectedOption,
                                                    ) =>
                                                        handleSelectChange(
                                                            selectedOption,
                                                            index,
                                                        )
                                                    }
                                                    options={productOptions}
                                                    inputId={`select-${index}`}
                                                />
                                            </td>
                                            <td className="td-center">
                                                {row.unit}
                                            </td>
                                            <td className="td-center">
                                                <input
                                                    className={
                                                        row.hasPo
                                                            ? "spinner-disabled outline-none bg-slate-100 text-slate-500 py-1 px-2 w-16 text-right"
                                                            : "spinner-disabled outline-none py-1 px-2 w-16 text-right"
                                                    }
                                                    min={0}
                                                    defaultValue={
                                                        row.request_qty
                                                    }
                                                    onChange={(event) =>
                                                        handleQtyChange(
                                                            event,
                                                            index,
                                                        )
                                                    }
                                                    type="number"
                                                    disabled={
                                                        !row.value || row.hasPo
                                                    }
                                                    hidden={!row.value}
                                                    required={row.value}
                                                    ref={
                                                        selectedRowId === index
                                                            ? inputQtyRef
                                                            : null
                                                    }
                                                />
                                            </td>
                                            <td className="td-center">
                                                <div className="flex-all-center">
                                                    {rows.length > 1 &&
                                                        row.value !== null &&
                                                        !row.hasPo && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeRow(
                                                                        index,
                                                                    )
                                                                }
                                                                className="flex-all-center p-1 m-1 rounded-md text-white bg-red-700 hover:bg-red-500 cursor-pointer"
                                                            >
                                                                <Svg
                                                                    title="Delete"
                                                                    c={
                                                                        "w-5 fill-current"
                                                                    }
                                                                >
                                                                    <DeleteSvg />
                                                                </Svg>
                                                            </button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
