// Download file directly to device
function downloadAPK() {
    const fileUrl = "IBAÑEZ_PALOMA.docx"; // must exist in same folder or correct path

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "My_Application.zip"; // actual downloaded filename

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Open Web Calculator
function openWebCalculator() {
    window.open("calculator.html", "_blank");
}