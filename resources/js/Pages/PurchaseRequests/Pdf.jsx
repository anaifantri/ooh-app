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
        marginTop: 10,
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
                    Form Permintaan Barang
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
                                width: 64,
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
                                width: 64,
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
                            marginTop: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                marginHorizontal: 2,
                                width: 64,
                            }}
                        >
                            Diminta Oleh
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
                            {data.request_by}
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
                            Alamat pengiriman :
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
                            Kode Gudang
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
                            {data.warehouse.code}
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
                            {data.warehouse.name}
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
                            {data.warehouse.address}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={[styles.thCol, { width: "5%" }]}>
                        <Text style={styles.thCell}>No.</Text>
                    </View>
                    <View style={[styles.thCol, { width: "15%" }]}>
                        <Text style={styles.thCell}>Kode</Text>
                    </View>
                    <View style={[styles.thCol, { width: "60%" }]}>
                        <Text style={styles.thCell}>Nama Barang / Produk</Text>
                    </View>
                    <View style={[styles.thCol, { width: "10%" }]}>
                        <Text style={styles.thCell}>Satuan</Text>
                    </View>
                    <View style={[styles.thCol, { width: "10%" }]}>
                        <Text style={styles.thCell}>Jumlah</Text>
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
                                { width: "15%", justifyContent: "center" },
                            ]}
                        >
                            <Text style={styles.tdCell}>{product.code}</Text>
                        </View>
                        <View style={[styles.tdCol, { width: "60%" }]}>
                            <Text style={styles.tdCell}>{product.name}</Text>
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
                                { width: "10%", justifyContent: "center" },
                            ]}
                        >
                            <Text style={styles.tdCell}>
                                {data.request_products[index].request_qty}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <View>
                <Text
                    style={{
                        fontSize: 10,
                        marginTop: 20,
                    }}
                >
                    Keterangan :
                </Text>
            </View>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    width: "100%",
                    marginTop: 4,
                    padding: 4,
                    height: 75,
                }}
            >
                <Text
                    style={{
                        fontSize: 10,
                        fontWeight: 600,
                    }}
                >
                    {data.note}
                </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View>
                    <View>
                        <Text
                            style={{
                                fontSize: 10,
                            }}
                        >
                            Diminta oleh,
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
                            ( {data.request_by} )
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
    const requestId = splitUrl[splitUrl.length - 1];
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [purchaseRequest, setPurchaseRequest] = useState(null);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(
                    "/api/purchase-requests/" + requestId,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setPurchaseRequest(response.data);
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
            <LoadingPdf
                url={`ooh-app.test/purchase-requests/pdf/${requestId}`}
            />
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
                    <BtnBack backUrl={`/purchase-requests/show/${requestId}`} />
                    <PDFDownloadLink
                        document={
                            <PdfContent
                                data={purchaseRequest}
                                products={products}
                                qrDataUri={qrDataUri}
                            />
                        }
                        fileName={`${purchaseRequest.number}.pdf`}
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
                    data={purchaseRequest}
                    products={products}
                    qrDataUri={qrDataUri}
                />
            </PDFViewer>
        </div>
    );
}

CreatePdf.layout = (page) => <DashboardLayout children={page} />;
