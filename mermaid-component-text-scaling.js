function multiplyMatrixByScalar(matrix, scalar) {
    return new DOMMatrix([
        matrix.a * scalar, matrix.b * scalar,
        matrix.c * scalar, matrix.d * scalar,
        matrix.e * scalar, matrix.f * scalar
    ]);
}

function addMatrices(m1, m2) {
    return new DOMMatrix([
        m1.a + m2.a, m1.b + m2.b,
        m1.c + m2.c, m1.d + m2.d,
        m1.e + m2.e, m1.f + m2.f
    ]);
}

const mermaidDiagrams = document.getElementsByClassName("mermaid");
for (let diagram of mermaidDiagrams) {
    const textScaling = parseFloat(diagram.getAttribute("data-text-scaling"));
    if (textScaling) {
        const components = diagram.querySelectorAll(".component");
        for (let component of components) {
            const label = component.querySelector(".label");
            // issue: transform is not expressed using CSS units here...
            // so DOMMatrix approach, which is more elegant, does not work
            const existingTranslation = label.getAttribute("transform") || "translate(0,0)";
            const match = existingTranslation.match(/translate\((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)\)/);
            const newTransform = `translate(${textScaling * parseFloat(match[1])},${textScaling * parseFloat(match[3])}) scale(${textScaling})`;
            label.setAttribute("transform", newTransform);
        }
    }
}
