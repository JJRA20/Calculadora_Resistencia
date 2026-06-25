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

// DOM Elements
const mode4Btn = document.getElementById('mode4');
const mode5Btn = document.getElementById('mode5');
const band3Container = document.getElementById('band3-container');
const band1 = document.getElementById('band1');
const band2 = document.getElementById('band2');
const band3 = document.getElementById('band3');
const band4 = document.getElementById('band4');
const band5 = document.getElementById('band5');
const errorMsg = document.getElementById('error-message');
const resultValue = document.getElementById('result-value');
const btnCalculate = document.getElementById('btn-calculate');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const toast = document.getElementById('toast');
const tableBody = document.querySelector('#reference-table tbody');
const historyList = document.getElementById('history-list');
const btnClearHistory = document.getElementById('btn-clear-history');

// State
let is4Band = true;
let currentResultStr = "";
let historyArr = [];

function init() {
    populateSelects();
    populateTable();
    setupEventListeners();
}

function populateSelects() {
    const digitOpts = colorData.filter(c => c.digit !== null);
    const multOpts = colorData.filter(c => c.multiplier !== null);
    const tolOpts = colorData.filter(c => c.tol !== null);

    populateSelect(band1, digitOpts, 'digit');
    populateSelect(band2, digitOpts, 'digit');
    populateSelect(band3, digitOpts, 'digit');
    populateSelect(band4, multOpts, 'multiplier');
    populateSelect(band5, tolOpts, 'tol');
}

function populateSelect(selectEl, options, type) {
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.name;
        option.textContent = opt.name;
        option.style.backgroundColor = opt.hex;
        option.style.color = opt.textDark ? '#000' : '#fff';
        option.dataset[type] = opt[type];
        option.dataset.hex = opt.hex;
        selectEl.appendChild(option);
    });
}

function populateTable() {
    colorData.forEach(c => {
        const tr = document.createElement('tr');
        const colorCell = `<td style="display:flex; align-items:center; gap:0.5rem;"><div style="width:16px;height:16px;border-radius:50%;background-color:${c.hex};border:1px solid #444"></div>${c.name}</td>`;
        const valCell = `<td>${c.digit !== null ? c.digit : '-'}</td>`;
        let multStr = '-';
        if (c.multiplier !== null) {
            if (c.multiplier >= 1000000) multStr = `x ${c.multiplier / 1000000}M`;
            else if (c.multiplier >= 1000) multStr = `x ${c.multiplier / 1000}k`;
            else multStr = `x ${c.multiplier}`;
        }
        const multCell = `<td>${multStr}</td>`;
        const tolCell = `<td>${c.tol !== null ? `±${c.tol}%` : '-'}</td>`;
        
        tr.innerHTML = colorCell + valCell + multCell + tolCell;
        tableBody.appendChild(tr);
    });
}

function setupEventListeners() {
    mode4Btn.addEventListener('change', () => switchMode(true));
    mode5Btn.addEventListener('change', () => switchMode(false));

    btnCalculate.addEventListener('click', calculate);
    btnClear.addEventListener('click', clearForm);
    btnCopy.addEventListener('click', copyResult);
    btnClearHistory.addEventListener('click', clearHistory);

    // Hide error dynamically when filling all fields
    [band1, band2, band3, band4, band5].forEach(select => {
        select.addEventListener('change', () => {
            select.style.backgroundColor = select.options[select.selectedIndex].dataset.hex || 'transparent';
            select.style.color = select.options[select.selectedIndex].style.color;
            if (!errorMsg.classList.contains('hidden')) {
                if (validateForm()) errorMsg.classList.add('hidden');
            }
        });
    });
}

function switchMode(to4Band) {
    is4Band = to4Band;
    if (is4Band) {
        band3Container.style.display = 'none';
        band3.value = ""; 
        band3.style.backgroundColor = 'transparent';
        band3.style.color = 'inherit';
    } else {
        band3Container.style.display = 'flex';
    }
   
    if (validateForm()) errorMsg.classList.add('hidden');
}

function validateForm() {
    if (band1.value === "" || band2.value === "" || band4.value === "" || band5.value === "") return false;
    if (!is4Band && band3.value === "") return false;
    return true;
}

function formatUnit(value) {
    
    return value + " Ω";
}

function calculate() {
    if (!validateForm()) {
        errorMsg.classList.remove('hidden');
        
        addToHistory([], "Cálculo fallido");
        return;
    }
    errorMsg.classList.add('hidden');

    const v1 = parseInt(band1.options[band1.selectedIndex].dataset.digit);
    const v2 = parseInt(band2.options[band2.selectedIndex].dataset.digit);
    const mult = parseFloat(band4.options[band4.selectedIndex].dataset.multiplier);
    const tol = parseFloat(band5.options[band5.selectedIndex].dataset.tol);

    let baseValue = 0;
    const colors = [
        band1.options[band1.selectedIndex].dataset.hex,
        band2.options[band2.selectedIndex].dataset.hex
    ];

    if (is4Band) {
        baseValue = (v1 * 10) + v2;
    } else {
        const v3 = parseInt(band3.options[band3.selectedIndex].dataset.digit);
        baseValue = (v1 * 100) + (v2 * 10) + v3;
        colors.push(band3.options[band3.selectedIndex].dataset.hex);
    }
    
    colors.push(band4.options[band4.selectedIndex].dataset.hex);
    colors.push(band5.options[band5.selectedIndex].dataset.hex);

    const finalValue = baseValue * mult;
    const formattedVal = formatUnit(finalValue);
    
    currentResultStr = `${formattedVal} ±${tol}%`;
    resultValue.textContent = currentResultStr;

    addToHistory(colors, currentResultStr);
}

function clearForm() {
    document.getElementById('resistor-form').reset();
    band3Container.style.display = is4Band ? 'none' : 'flex';
    [band1, band2, band3, band4, band5].forEach(s => {
        s.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
        s.style.color = '#f8fafc';
    });
    
  
    errorMsg.classList.add('hidden');
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

function copyResult() {
    if (!currentResultStr) {
        
        return;
    }
    navigator.clipboard.writeText(currentResultStr).then(() => {
        
    }).catch(err => {
        console.error('Error al copiar', err);
    });
}

function addToHistory(colors, resultText) {
    
    historyArr.unshift({ colors, resultText });
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    if (historyArr.length === 0) {
        historyList.innerHTML = `<li class="empty-history">No hay cálculos aún.</li>`;
        return;
    }
    
    historyArr.forEach(item => {
        const li = document.createElement('li');
        const colorDiv = document.createElement('div');
        colorDiv.className = 'history-colors';
        item.colors.forEach(c => {
            const dot = document.createElement('div');
            dot.className = 'color-dot';
            dot.style.backgroundColor = c;
            colorDiv.appendChild(dot);
        });
        
        const valSpan = document.createElement('span');
        valSpan.textContent = item.resultText;
        valSpan.style.fontWeight = '600';
        
        li.appendChild(colorDiv);
        li.appendChild(valSpan);
        historyList.appendChild(li);
    });
}

function clearHistory() {
    historyArr = [];
    renderHistory();
}


init();
