import "./bootstrap";
import "../css/app.css";
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

createInertiaApp({
    title: (title) => (title ? `OOH-APP : ${title}` : "OOH-APP : Welcome"),
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
