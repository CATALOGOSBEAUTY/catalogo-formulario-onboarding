import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Footer } from "../../src/modules/Footer";
import { Header } from "../../src/modules/Header";

describe("layout branding", () => {
  it("renders the Sistematize brand instead of the legacy BeautySync brand", () => {
    const headerMarkup = renderToStaticMarkup(<Header />);
    const footerMarkup = renderToStaticMarkup(<Footer />);
    const combinedMarkup = `${headerMarkup}${footerMarkup}`.toLowerCase();

    expect(combinedMarkup).toContain("sistematize");
    expect(combinedMarkup).toContain("estética de alto padrão");
    expect(combinedMarkup).toContain("experiência premium em cada detalhe");
    expect(combinedMarkup).not.toContain("catalogo");
    expect(combinedMarkup).not.toContain("beautysync");
    expect(combinedMarkup).toContain("lgpd");
  });
});
