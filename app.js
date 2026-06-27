const colorData = [
    { name: "Negro", hex: "#000000", digit: 0, multiplier: 1, tol: null, textDark: false },
    { name: "Marrón", hex: "#8B4513", digit: 1, multiplier: 10, tol: 1, textDark: false },
    { name: "Rojo", hex: "#ef4444", digit: 2, multiplier: 100, tol: 2, textDark: false },
    { name: "Naranja", hex: "#f97316", digit: 3, multiplier: 1000, tol: null, textDark: true },
    { name: "Amarillo", hex: "#eab308", digit: 4, multiplier: 10000, tol: null, textDark: true },
    { name: "Verde", hex: "#22c55e", digit: 5, multiplier: 100000, tol: 0.5, textDark: false },
    { name: "Azul", hex: "#3b82f6", digit: 6, multiplier: 1000000, tol: 0.25, textDark: false },
    { name: "Violeta", hex: "#8b5cf6", digit: 7, multiplier: 10000000, tol: 0.1, textDark: false },
    { name: "Gris", hex: "#6b7280", digit: 8, multiplier: 100000000, tol: 0.05, textDark: false },
    { name: "Blanco", hex: "#ffffff", digit: 9, multiplier: 1000000000, tol: null, textDark: true },
    { name: "Dorado", hex: "#eab308", digit: null, multiplier: 0.1, tol: 5, textDark: true },
    { name: "Plateado", hex: "#9ca3af", digit: null, multiplier: 0.01, tol: 10, textDark: true }
];

const band1 = document.getElementById("band1");
const band2 = document.getElementById("band2");
const band4 = document.getElementById("band4");
const band5 = document.getElementById("band5");
const summaryText = document.getElementById("summary-text");

function init() {
    populateSelects();
    setupEventListeners();
}

function populateSelects() {
    const digitColors = colorData.filter(color => color.digit !== null);
    const multiplierColors = colorData.filter(color => color.multiplier !== null);
    const toleranceColors = colorData.filter(color => color.tol !== null);

    populateSelect(band1, digitColors);
    populateSelect(band2, digitColors);
    populateSelect(band4, multiplierColors);
    populateSelect(band5, toleranceColors);
}

function populateSelect(selectElement, options) {
    options.forEach(color => {
        const option = document.createElement("option");
        option.value = color.name;
        option.textContent = color.name;
        option.style.backgroundColor = color.hex;
        option.style.color = color.textDark ? "#000000" : "#ffffff";

        selectElement.appendChild(option);
    });
}

function setupEventListeners() {
    [band1, band2, band4, band5].forEach(select => {
        select.addEventListener("change", function () {
            updateSelectStyle(select);
            updateSummary();
        });
    });
}

function updateSelectStyle(selectElement) {
    const selectedColor = colorData.find(color => color.name === selectElement.value);

    if (selectedColor) {
        selectElement.style.backgroundColor = selectedColor.hex;
        selectElement.style.color = selectedColor.textDark ? "#000000" : "#ffffff";
    }
}

function updateSummary() {
    if (band1.value && band2.value && band4.value && band5.value) {
        summaryText.textContent =
            `Selección actual: Banda 1 ${band1.value}, Banda 2 ${band2.value}, ` +
            `Multiplicador ${band4.value}, Tolerancia ${band5.value}.`;
    } else {
        summaryText.textContent = "Aún no se seleccionaron todos los colores.";
    }
}

init();