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
const resultValue = document.getElementById("result-value");
const btnCalculate = document.getElementById("btn-calculate");
const btnClear = document.getElementById("btn-clear");
const errorMessage = document.getElementById("error-message");
const historyList = document.getElementById("history-list");
const btnClearHistory = document.getElementById("btn-clear-history");

let historyArr = [];

function init() {
    populateSelects();
    setupEventListeners();
    renderHistory();
}

function populateSelects() {
    const digitColors = colorData.filter(color => color.digit !== null);
    const multiplierColors = colorData.filter(color => color.multiplier !== null);
    const toleranceColors = colorData.filter(color => color.tol !== null);

    populateSelect(band1, digitColors, "digit");
    populateSelect(band2, digitColors, "digit");
    populateSelect(band4, multiplierColors, "multiplier");
    populateSelect(band5, toleranceColors, "tol");
}

function populateSelect(selectElement, options, type) {
    options.forEach(color => {
        const option = document.createElement("option");
        option.value = color.name;
        option.textContent = color.name;
        option.style.backgroundColor = color.hex;
        option.style.color = color.textDark ? "#000000" : "#ffffff";
        option.dataset[type] = color[type];
        option.dataset.hex = color.hex;

        selectElement.appendChild(option);
    });
}

function setupEventListeners() {
    [band1, band2, band4, band5].forEach(select => {
        select.addEventListener("change", function () {
            updateSelectStyle(select);
            updateSummary();

            if (validateForm()) {
                hideError();
            }
        });
    });

    btnCalculate.addEventListener("click", calculateResistance);
    btnClear.addEventListener("click", clearForm);
    btnClearHistory.addEventListener("click", clearHistory);
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

function validateForm() {
    return Boolean(band1.value && band2.value && band4.value && band5.value);
}

function showError() {
    errorMessage.textContent = "Debe seleccionar todas las bandas";
    errorMessage.classList.remove("hidden");
}

function hideError() {
    errorMessage.classList.add("hidden");
}

function calculateResistance() {
    if (!validateForm()) {
        showError();
        resultValue.textContent = "--";
        return;
    }

    hideError();

    const digit1 = parseInt(band1.options[band1.selectedIndex].dataset.digit);
    const digit2 = parseInt(band2.options[band2.selectedIndex].dataset.digit);
    const multiplier = parseFloat(band4.options[band4.selectedIndex].dataset.multiplier);
    const tolerance = parseFloat(band5.options[band5.selectedIndex].dataset.tol);

    const baseValue = (digit1 * 10) + digit2;
    const finalValue = baseValue * multiplier;
    const resultText = `${formatUnit(finalValue)} ±${formatNumber(tolerance)}%`;

    resultValue.textContent = resultText;
    addToHistory(resultText);
}

function clearForm() {
    document.getElementById("resistor-form").reset();

    [band1, band2, band4, band5].forEach(select => {
        select.style.backgroundColor = "#0f172a";
        select.style.color = "#f8fafc";
    });

    summaryText.textContent = "Aún no se seleccionaron todos los colores.";
    resultValue.textContent = "--";
    hideError();
}

function addToHistory(resultText) {
    historyArr.unshift(resultText);
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";

    if (historyArr.length === 0) {
        historyList.innerHTML = `<li class="empty-history">No hay cálculos aún.</li>`;
        return;
    }

    historyArr.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    historyArr = [];
    renderHistory();
}

function formatUnit(value) {
    if (value >= 1000000) {
        return formatNumber(value / 1000000) + " MΩ";
    }

    if (value >= 1000) {
        return formatNumber(value / 1000) + " kΩ";
    }

    return formatNumber(value) + " Ω";
}

function formatNumber(number) {
    return Number.isInteger(number) ? number.toString() : number.toFixed(2);
}

init();