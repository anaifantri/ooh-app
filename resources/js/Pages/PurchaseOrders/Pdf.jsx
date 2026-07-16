import { usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    PDFDownloadLink,
    PDFViewer,
} from "@react-pdf/renderer";

import { api } from "@/apiService";
import FormattedDateLong from "@/Utils/FormattedDateLong";

import DashboardLayout from "@/Layouts/DashboardLayout";

import Svg from "@/Components/Svg";

import Logo from "@/Assets/Img/logo-vista-media-text.png";
import LineTop from "@/Assets/Img/line-top.png";
import LineBottom from "@/Assets/Img/line-bottom.png";
import DownloadSvg from "@/Assets/Svg/DownloadSvg";
import SpinSvg from "@/Assets/Svg/SpinSvg";
import BtnBack from "@/Components/BtnBack";
import LoadingPdf from "@/Components/LoadingPdf";

const styles = StyleSheet.create({
    logo: {
        width: 80,
    },
    lineTop: {
        marginTop: "12",
    },
    page: {
        paddingBottom: 40,
        paddingHorizontal: 40,
        paddingTop: 30,
        fontSize: 12,
        fontFamily: "Helvetica",
    },
    header: {
        display: "flex",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        color: "#333",
    },
    section: {
        flexDirection: "row",
        marginVertical: 10,
        justifyContent: "center",
    },
    headerContent: {
        marginHorizontal: 4,
        borderWidth: 1,
        padding: 4,
        borderRadius: 10,
        width: 250,
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    thCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        flexDirection: "row",
        justifyContent: "center",
    },
    tdCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        flexDirection: "row",
    },
    thCell: {
        margin: 5,
        fontSize: 10,
        fontWeight: 600,
    },
    tdCell: {
        margin: 5,
        fontSize: 10,
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 40,
        right: 40,
        textAlign: "center",
        color: "grey",
        fontSize: 10,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4,
    },
});

const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(number);
};

const PdfContent = ({ data, products, qrDataUri }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View fixed style={styles.header}>
                <Image src={Logo} style={styles.logo} alt="" />
                <Image src={LineTop} style={styles.lineTop} alt="" />
            </View>

            <View style={styles.section}>
                <Text
                    style={{
                        fontSize: 12,
                        borderBottom: 1,
                        fontWeight: 600,
                        marginTop: 10,
                    }}
                >
                    Purchase Order (PO)
                </Text>
            </View>
            <View style={styles.section}>
                <View style={styles.headerContent}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            Nomor
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                fontWeight: 600,
                            }}
                        >
                            {data.number}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            Tanggal
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                fontWeight: 600,
                            }}
                        >
                            {FormattedDateLong(data.created_at)}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 600,
                                marginHorizontal: 2,
                                marginTop: 8,
                                width: 96,
                            }}
                        >
                            Alamat pengiriman
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            Nama Gudang
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                fontWeight: 600,
                            }}
                        >
                            {data.purchase_request.warehouse.name}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            Alamat
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                width: 150,
                                fontWeight: 600,
                            }}
                        >
                            {data.purchase_request.warehouse.address}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            No. Telepon
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                width: 150,
                                fontWeight: 600,
                            }}
                        >
                            {data.purchase_request.warehouse.phone}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            No. Hp.
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                width: 150,
                                fontWeight: 600,
                            }}
                        >
                            {data.purchase_request.warehouse.mobile
                                ? data.purchase_request.warehouse.mobile
                                : "-"}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerContent}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                fontWeight: 600,
                                marginHorizontal: 2,
                                width: 96,
                            }}
                        >
                            Suppliers / Toko
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            Kode Supplier
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                fontWeight: 600,
                            }}
                        >
                            {data.supplier.code}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            Nama Supplier
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                fontWeight: 600,
                            }}
                        >
                            {data.supplier.name}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            Alamat
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                width: 150,
                                fontWeight: 600,
                            }}
                        >
                            {data.supplier.address}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            No. Telepon
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                width: 150,
                                fontWeight: 600,
                            }}
                        >
                            {data.supplier.phone ? data.supplier.phone : "-"}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            No. Hp.
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                width: 150,
                                fontWeight: 600,
                            }}
                        >
                            {data.supplier.mobile ? data.supplier.mobile : "-"}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 72,
                            }}
                        >
                            Email
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                            }}
                        >
                            :
                        </Text>
                        <Text
                            style={{
                                fontSize: 10,
                                color: "black",
                                marginHorizontal: 2,
                                width: 150,
                                fontWeight: 600,
                            }}
                        >
                            {data.supplier.email ? data.supplier.email : "-"}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.table, { marginTop: 10 }]}>
                <View style={styles.tableRow}>
                    <View style={[styles.thCol, { width: "5%" }]}>
                        <Text style={styles.thCell}>No.</Text>
                    </View>
                    <View style={[styles.thCol, { width: "12%" }]}>
                        <Text style={styles.thCell}>Kode</Text>
                    </View>
                    <View style={[styles.thCol, { width: "38%" }]}>
                        <Text style={styles.thCell}>Nama Barang / Produk</Text>
                    </View>
                    <View style={[styles.thCol, { width: "7%" }]}>
                        <Text style={styles.thCell}>Qty.</Text>
                    </View>
                    <View style={[styles.thCol, { width: "10%" }]}>
                        <Text style={styles.thCell}>Sat.</Text>
                    </View>
                    <View style={[styles.thCol, { width: "13%" }]}>
                        <Text style={styles.thCell}>Harga</Text>
                    </View>
                    <View style={[styles.thCol, { width: "15%" }]}>
                        <Text style={styles.thCell}>Total</Text>
                    </View>
                </View>
                {products.map((product, index) => (
                    <View style={styles.tableRow} key={index}>
                        <View
                            style={[
                                styles.tdCol,
                                { width: "5%", justifyContent: "center" },
                            ]}
                        >
                            <Text style={styles.tdCell}>{index + 1}</Text>
                        </View>
                        <View
                            style={[
                                styles.tdCol,
                                { width: "12%", justifyContent: "center" },
                            ]}
                        >
                            <Text style={styles.tdCell}>{product.code}</Text>
                        </View>
                        <View style={[styles.tdCol, { width: "38%" }]}>
                            <Text style={styles.tdCell}>{product.name}</Text>
                        </View>
                        <View
                            style={[
                                styles.tdCol,
                                { width: "7%", justifyContent: "center" },
                            ]}
                        >
                            <Text style={styles.tdCell}>
                                {data.order_products[index].qty}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.tdCol,
                                { width: "10%", justifyContent: "center" },
                            ]}
                        >
                            <Text style={styles.tdCell}>{product.unit}</Text>
                        </View>
                        <View
                            style={[
                                styles.tdCol,
                                { width: "13%", justifyContent: "flex-end" },
                            ]}
                        >
                            <Text style={styles.tdCell}>
                                {rupiah(data.order_products[index].price)}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.tdCol,
                                { width: "15%", justifyContent: "flex-end" },
                            ]}
                        >
                            <Text style={styles.tdCell}>
                                {rupiah(
                                    data.order_products[index].price *
                                        data.order_products[index].qty,
                                )}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View
                        style={[
                            styles.tdCol,
                            {
                                fontWeight: 600,
                                width: "85%",
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text style={styles.tdCell}>Sub Total</Text>
                    </View>
                    <View
                        style={[
                            styles.tdCol,
                            {
                                fontWeight: 600,
                                width: "15%",
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text style={styles.tdCell}>
                            {rupiah(data.sub_total)}
                        </Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View
                        style={[
                            styles.tdCol,
                            {
                                fontWeight: 600,
                                width: "85%",
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text style={styles.tdCell}>Tax</Text>
                    </View>
                    <View
                        style={[
                            styles.tdCol,
                            {
                                fontWeight: 600,
                                width: "15%",
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text style={styles.tdCell}>{rupiah(data.tax)}</Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View
                        style={[
                            styles.tdCol,
                            {
                                fontWeight: 600,
                                width: "85%",
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text style={styles.tdCell}>Grand Total</Text>
                    </View>
                    <View
                        style={[
                            styles.tdCol,
                            {
                                fontWeight: 600,
                                width: "15%",
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text style={styles.tdCell}>
                            {rupiah(data.grand_total)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View>
                    <View>
                        <Text
                            style={{
                                fontSize: 10,
                            }}
                        >
                            Dibuat oleh,
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 10,
                                marginTop: 60,
                                fontWeight: 600,
                                textDecoration: "underline",
                            }}
                        >
                            ( {data.user.name} )
                        </Text>
                    </View>
                </View>
                <View style={{ marginHorizontal: 20 }}>
                    {qrDataUri && (
                        <Image
                            src={qrDataUri}
                            style={{ width: 80, height: 80 }}
                        />
                    )}
                </View>
                <View style={{ marginLeft: 175 }}>
                    <View style={{ marginLeft: 32 }}>
                        <Text
                            style={{
                                fontSize: 10,
                            }}
                        >
                            Mengetahui,
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 10,
                                marginTop: 60,
                                fontWeight: 600,
                                textDecoration: "underline",
                            }}
                        >
                            (_____________________)
                        </Text>
                    </View>
                </View>
            </View>

            <View fixed style={styles.footer}>
                <Image src={LineBottom} alt="" />
                <View style={styles.rowContainer}>
                    <Text
                        style={{
                            fontSize: 12,
                            color: "red",
                            marginHorizontal: 2,
                        }}
                    >
                        PT. Vista
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: "black",
                            marginHorizontal: 2,
                        }}
                    >
                        Media
                    </Text>
                </View>
                <Text>Jl. Pulau Kawe No. 40, Kel. Dauh Puri Kauh</Text>
                <Text>Kec. Denpasar Barat - Kota Denpasar | BALI 80113</Text>
                <Text>
                    Phone : +62 361 230000 | Email : info@vistamedia.co.id |
                    Website : www.vistamedia.co.id
                </Text>
            </View>
        </Page>
    </Document>
);

export default function CreatePdf() {
    const [qrDataUri, setQrDataUri] = useState("");
    const { url } = usePage();
    const splitUrl = url.split("/");
    const orderId = splitUrl[splitUrl.length - 1];
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [purchaseOrder, setPurchaseOrder] = useState(null);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(
                    "/api/purchase-orders/" + orderId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setPurchaseOrder(response.data);
                setProducts(response.data.products);
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

        fetchData();
    }, []);

    useEffect(() => {
        const canvas = document.getElementById("pdf-qr-code");
        if (canvas) {
            setQrDataUri(canvas.toDataURL("image/png"));
        }
    }, []);

    if (loading) {
        return (
            <LoadingPdf url={`ooh-app.test/purchase-orders/pdf/${orderId}`} />
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="w-full px-10">
            <div className="flex border-b w-full">
                <label className="flex font-semibold text-lg w-96">
                    PDF Preview
                </label>
                <div className="flex justify-end items-center w-full m-1">
                    <BtnBack backUrl={`/purchase-orders/show/${orderId}`} />
                    <PDFDownloadLink
                        document={
                            <PdfContent
                                data={purchaseOrder}
                                products={products}
                                qrDataUri={qrDataUri}
                            />
                        }
                        fileName={`${purchaseOrder.number}.pdf`}
                        className={"flex-all-center button-success p-1"}
                        style={{
                            textDecoration: "none",
                        }}
                    >
                        {({ loading }) =>
                            loading ? (
                                <>
                                    <Svg
                                        title="Spin"
                                        c={"w-4 fill-current mx-2 animate-spin"}
                                    >
                                        <SpinSvg />
                                    </Svg>
                                    <span className="mx-1">Loading...</span>
                                </>
                            ) : (
                                <>
                                    <Svg
                                        title="Download"
                                        c={"w-4 fill-current"}
                                    >
                                        <DownloadSvg />
                                    </Svg>
                                    <span className="mx-1">Download</span>
                                </>
                            )
                        }
                    </PDFDownloadLink>
                </div>
            </div>

            <PDFViewer style={{ width: "100%", height: "100%" }}>
                <PdfContent
                    data={purchaseOrder}
                    products={products}
                    qrDataUri={qrDataUri}
                />
            </PDFViewer>
        </div>
    );
}

CreatePdf.layout = (page) => <DashboardLayout children={page} />;
