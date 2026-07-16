import React, { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import Select from "react-select";

import { api } from "@/apiService";
import FormattedDateLong from "@/Utils/FormattedDateLong";
import DashboardLayout from "@/Layouts/DashboardLayout";

import HeaderCreate from "@/Components/HeaderCreate";
import LoadingData from "@/Components/LoadingData";
import { isAxiosError } from "axios";

import Svg from "@/Components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function Create() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("dataUser")),
    );
    const getDate = Date.now();
    const today = new Intl.DateTimeFormat("en-CA").format(new Date());

    const [productOptions, setProductOptions] = useState([]);
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [requestOptions, setRequestOptions] = useState([]);
    const [rows, setRows] = useState([
        {
            value: null,
            code: null,
            name: null,
            unit: null,
            qty: null,
            price: null,
            total: 0,
        },
    ]);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const inputQtyRef = useRef(null);
    const [supplier, setSupplier] = useState({
        code: "",
        name: "",
        address: "",
        phone: "",
        mobile: "",
        email: "",
    });
    const [purchaseRequest, setPurchaseRequest] = useState({
        number: "",
        request_by: "",
        note: "",
        created_at: "",
        warehouse_address: "",
    });
    const [products, setProducts] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [getErrors, setGetErrors] = useState({});
    const [error, setError] = useState(null);

    const { data, setData } = useForm({
        supplier_id: "",
        purchase_request_id: "",
        date: "2026-05-22",
        sub_total: "",
        tax: "",
        grand_total: "",
    });

    const errorRef = useRef();

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    };

    const handleSelectChange = (selectedOption, index) => {
        let rowIndex = index;
        const exists = rows.some((row) => row.value === selectedOption.value);
        const updatedRows = [...rows];
        if (exists) {
            const getIndex = rows.findIndex(
                (row) => row.value === selectedOption.value,
            );
            rowIndex = getIndex;
        } else {
            updatedRows[rowIndex].value = selectedOption.value;
            updatedRows[rowIndex].code = selectedOption.code;
            updatedRows[rowIndex].name = selectedOption.name;
            updatedRows[rowIndex].unit = selectedOption.unit;
            updatedRows[rowIndex].qty = selectedOption.qty;
        }
        setRows(updatedRows);
        setSelectedRowId(rowIndex);
        setIsSelected(true);

        if (rowIndex === rows.length - 1 && selectedOption) {
            const newProduct = {
                id: selectedOption.value,
                price: 0,
                qty: selectedOption.qty,
            };
            setProducts([...products, newProduct]);
            setRows([
                ...updatedRows,
                {
                    value: null,
                    code: null,
                    name: null,
                    unit: null,
                    qty: null,
                    price: null,
                    total: "",
                },
            ]);
        } else {
            const newProducts = [...products];
            const newProduct = {
                id: selectedOption.value,
                qty: selectedOption.qty,
                price: rows[rowIndex].price,
            };
            newProducts[rowIndex] = newProduct;
            setProducts(newProducts);
        }
    };
    const handleSelectSupplierChange = (selectedOption) => {
        setData("supplier_id", selectedOption.value);
        setSupplier({
            code: selectedOption.code,
            name: selectedOption.name,
            address: selectedOption.address,
            phone: selectedOption.phone,
            mobile: selectedOption.mobile,
            email: selectedOption.email,
        });
    };
    const handleSelectRequestChange = (selectedOption) => {
        setData("purchase_request_id", selectedOption.value);
        setPurchaseRequest({
            number: selectedOption.number,
            request_by: selectedOption.request_by,
            note: selectedOption.note,
            created_at: selectedOption.created_at,
            warehouse_address: selectedOption.warehouse_address,
            products: selectedOption.products,
        });
        selectedOption.products.map((item) => {
            if (item.pivot.po_qty < item.pivot.request_qty) {
                const newProduct = {
                    value: item.id,
                    label: item.code + " | " + item.name,
                    code: item.code,
                    name: item.name,
                    unit: item.unit,
                    qty: item.pivot.request_qty,
                };
                setProductOptions((prevProductOptions) => [
                    newProduct,
                    ...prevProductOptions,
                ]);
            }
        });
        // const formattedProductOptions = selectedOption.products.map((item) => ({
        //     value: item.id,
        //     label: item.code + " | " + item.name,
        //     code: item.code,
        //     name: item.name,
        //     unit: item.unit,
        //     qty: item.pivot.request_qty,
        // }));
        // setProductOptions(formattedProductOptions);
    };

    const removeRow = (indexToRemove) => {
        const updatedRows = rows.filter((_, index) => index !== indexToRemove);
        const updatedProducts = products.filter(
            (_, index) => index !== indexToRemove,
        );
        setProducts(updatedProducts);
        setRows(updatedRows);
        const getSubTotal = updatedRows.reduce(
            (acc, current) => acc + Number(current.total),
            0,
        );
        const getTax = (getSubTotal * 11) / 100;
        const getGrandTotal = getSubTotal + getTax;
        setSubTotal(getSubTotal);
        setTax(getTax);
        setGrandTotal(getGrandTotal);
        setData("sub_total", getSubTotal);
        setData("tax", getTax);
        setData("grand_total", getGrandTotal);
    };

    const handlePriceChange = (e, index) => {
        const newRows = [...rows];
        const newProducts = [...products];
        newProducts[index].price = Number(e.target.value);
        newRows[index].price = Number(e.target.value);
        newRows[index].total = newRows[index].price * newRows[index].qty;
        setProducts(newProducts);
        setRows(newRows);
        const getSubTotal = newRows.reduce(
            (acc, current) => acc + Number(current.total),
            0,
        );
        const getTax = (getSubTotal * 11) / 100;
        const getGrandTotal = getSubTotal + getTax;
        setSubTotal(getSubTotal);
        setTax(getTax);
        setGrandTotal(getGrandTotal);
        setData("sub_total", getSubTotal);
        setData("tax", getTax);
        setData("grand_total", getGrandTotal);
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
        const requestSuppliers = api.get("/api/suppliers", {
            headers,
        });
        const requestRequests = api.get("/api/open-requests", {
            headers,
        });

        const fetchMultipleData = async () => {
            try {
                setLoading(true);
                const [responseSuppliers, responseRequests] = await Promise.all(
                    [requestSuppliers, requestRequests],
                );

                const formattedSupplierOptions = responseSuppliers.data.map(
                    (item) => ({
                        value: item.id,
                        label: item.name,
                        name: item.name,
                        code: item.code,
                        address: item.address,
                        phone: item.phone,
                        mobile: item.mobile,
                        email: item.email,
                    }),
                );

                const formattedRequestOptions = responseRequests.data.map(
                    (item) => ({
                        value: item.id,
                        label: item.number,
                        number: item.number,
                        request_by: item.request_by,
                        note: item.note,
                        warehouse_address: item.warehouse.address,
                        created_at: item.created_at,
                        products: item.products,
                    }),
                );

                setSupplierOptions(formattedSupplierOptions);
                setRequestOptions(formattedRequestOptions);
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
        dataRequest.append("supplier_id", data.supplier_id);
        dataRequest.append("purchase_request_id", data.purchase_request_id);
        dataRequest.append("user_id", user.id);
        dataRequest.append("date", data.date);
        dataRequest.append("sub_total", data.sub_total);
        dataRequest.append("tax", data.tax);
        dataRequest.append("grand_total", data.grand_total);
        products.map((product, index) => {
            dataRequest.append(`products[${index}][id]`, product.id);
            dataRequest.append(`products[${index}][qty]`, product.qty);
            dataRequest.append(`products[${index}][price]`, product.price);
        });

        try {
            setProcessing(true);
            const response = await api.post(
                "/api/purchase-orders",
                dataRequest,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "mulipart/form-data",
                    },
                },
            );
            router.visit("/purchase-orders", {
                data: {
                    message: "Penambahan data purchase order (PO) berhasil..!!",
                },
            });
        } catch (err) {
            if (!err?.response) {
                setError("No Server Response..!!");
            } else if (err.response?.status === 401) {
                setError("Unauthorized..!!");
            } else {
                setGetErrors(err.response.data.errors);
                console.log(err.response);
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
                    <HeaderCreate
                        titleCreate="Data Purchase Order (PO)"
                        backUrl="/purchase-orders"
                        getProcessing={processing}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="p-2 border border-stone-500 rounded-lg">
                            <div className="flex items-center mt-2">
                                <label className="w-32">Nomor PO</label>
                                <label>:</label>
                                <label className="w-80 font-semibold ml-2 text-slate-400">
                                    Terisi otomatis
                                </label>
                            </div>
                            <div className="flex items-center mt-2">
                                <label className="w-32">Tanggal PO</label>
                                <label>:</label>
                                <label className="w-80 font-semibold ml-2">
                                    {FormattedDateLong(today)}
                                </label>
                            </div>
                            <div className="flex items-center mt-2">
                                <label className="w-32">No. Permintaan</label>
                                <div className="w-68">
                                    <Select
                                        onChange={(selectedOption) =>
                                            handleSelectRequestChange(
                                                selectedOption,
                                            )
                                        }
                                        required
                                        options={requestOptions}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center mt-2">
                                <label className="w-32">Tgl. Permintaan</label>
                                <label>:</label>
                                <label className="w-80 font-semibold ml-2">
                                    {purchaseRequest.created_at
                                        ? FormattedDateLong(
                                              purchaseRequest.created_at,
                                          )
                                        : "-"}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-32">Diminta oleh</label>
                                <label>:</label>
                                <label className="w-80 font-semibold ml-2">
                                    {purchaseRequest.request_by
                                        ? purchaseRequest.request_by
                                        : "-"}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-32">Catatan</label>
                                <label>:</label>
                                <label className="w-80 font-semibold ml-2">
                                    {purchaseRequest.note
                                        ? purchaseRequest.note
                                        : "-"}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-32">Pengiriman</label>
                                <label>:</label>
                                <label className="w-80 font-semibold ml-2">
                                    {purchaseRequest.warehouse_address
                                        ? purchaseRequest.warehouse_address
                                        : "-"}
                                </label>
                            </div>
                        </div>
                        <div className="p-2 border border-stone-500 rounded-lg">
                            <div className="flex items-center mt-2">
                                <label className="w-44">Pilih Supplier</label>
                                <div className="w-68">
                                    <Select
                                        onChange={(selectedOption) =>
                                            handleSelectSupplierChange(
                                                selectedOption,
                                            )
                                        }
                                        required
                                        options={supplierOptions}
                                    />
                                </div>
                            </div>
                            {getErrors.supplier_id && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors.supplier_id}
                                </span>
                            )}
                            <div className="flex items-center mt-2">
                                <label className="w-44">Kode Supplier</label>
                                <label>:</label>
                                <label className="w-44 font-semibold ml-2">
                                    {supplier.code ? supplier.code : "-"}
                                </label>
                            </div>
                            <div className="flex items-center mt-2">
                                <label className="w-44">Nama Supplier</label>
                                <label>:</label>
                                <label className="w-44 font-semibold ml-2">
                                    {supplier.name ? supplier.name : "-"}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-44">Alamat</label>
                                <label>:</label>
                                <label className="w-68 font-semibold ml-2">
                                    {supplier.address ? supplier.address : "-"}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-44">No. Telp.</label>
                                <label>:</label>
                                <label className="w-68 font-semibold ml-2">
                                    {supplier.phone ? supplier.phone : "-"}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-44">No. Hp</label>
                                <label>:</label>
                                <label className="w-68 font-semibold ml-2">
                                    {supplier.mobile ? supplier.mobile : "-"}
                                </label>
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-44">Email</label>
                                <label>:</label>
                                <label className="w-68 font-semibold ml-2">
                                    {supplier.email ? supplier.email : "-"}
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
                            {getErrors["products.0.qty"] && (
                                <span
                                    ref={errorRef}
                                    className={
                                        getErrors
                                            ? "flex w-full text-red-500 text-xs items-center"
                                            : "hidden"
                                    }
                                >
                                    {getErrors["products.0.qty"]}
                                </span>
                            )}
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="h-10 bg-slate-100">
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
                                        <th className="th-center w-32">
                                            Harga
                                        </th>
                                        <th className="th-center w-32">
                                            Total
                                        </th>
                                        <th className="th-center w-20">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index} className="bg-white">
                                            <td className="td-center">
                                                {index + 1}
                                            </td>
                                            <td className="td-left">
                                                <Select
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
                                                    required={rows.length === 1}
                                                    options={productOptions}
                                                    inputId={`select-${index}`}
                                                />
                                            </td>
                                            <td className="td-center">
                                                {row.unit}
                                            </td>
                                            <td className="td-center">
                                                {row.qty}
                                            </td>
                                            <td className="td-center">
                                                <input
                                                    className="spinner-disabled outline-none py-1 px-2 w-24 text-right"
                                                    min={0}
                                                    onChange={(event) =>
                                                        handlePriceChange(
                                                            event,
                                                            index,
                                                        )
                                                    }
                                                    value={
                                                        row.price
                                                            ? row.price
                                                            : ""
                                                    }
                                                    type="number"
                                                    disabled={!row.value}
                                                    hidden={!row.value}
                                                    required={row.value}
                                                    ref={
                                                        selectedRowId === index
                                                            ? inputQtyRef
                                                            : null
                                                    }
                                                />
                                            </td>
                                            <td className="td-right">
                                                {rupiah(row.total)}
                                            </td>
                                            <td className="td-center">
                                                <div className="flex-all-center">
                                                    {rows.length > 1 &&
                                                        row.value !== null && (
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
                            <table className="table-auto w-full">
                                <tbody>
                                    <tr className="bg-white">
                                        <td
                                            className="border text-right px-2 font-semibold"
                                            colSpan={5}
                                        >
                                            Total
                                        </td>
                                        <td className="td-right font-semibold w-32">
                                            {rupiah(subTotal)}
                                        </td>
                                        <td className="border w-20 bg-slate-400"></td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td
                                            className="border text-right px-2 font-semibold"
                                            colSpan={5}
                                        >
                                            PPN
                                        </td>
                                        <td className="td-right font-semibold w-32">
                                            {rupiah(tax)}
                                        </td>
                                        <td className="border w-20 bg-slate-400"></td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td
                                            className="border text-right px-2 font-semibold"
                                            colSpan={5}
                                        >
                                            Grand Total
                                        </td>
                                        <td className="td-right font-semibold w-32">
                                            {rupiah(grandTotal)}
                                        </td>
                                        <td className="border w-20 bg-slate-400"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
