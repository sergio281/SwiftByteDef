document.addEventListener('DOMContentLoaded', () => {
    const paisSelect = document.getElementById('paisSelect');
    const consumoMensualInput = document.getElementById('consumoMensual');
    const calcularBtn = document.getElementById('calcularBtn');
    const resultados = document.getElementById('resultados');
    const csvFile = `modern-renewable-energy-consumption.csv`;

    let headers = [];
    let data = [];

    fetch(csvFile)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo CSV.");
            }
            return response.text();
        })
        .then(csvText => {
            const lines = csvText.split('\n');
            headers = lines[0].split(',');
            data = lines.slice(1).filter(row => row.trim() !== "");

            const paises = [...new Set(data.map(row => row.split(',')[0].trim()))].sort();
            paisSelect.innerHTML = paises.map(pais => `<option value="${pais}">${pais}</option>`).join('');
        })
        .catch(error => {
            resultados.innerHTML = `<p>Error: ${error.message}</p>`;
        });

    calcularBtn.addEventListener('click', () => {
        const paisSeleccionado = paisSelect.value;
        const consumoMensual = parseFloat(consumoMensualInput.value);

        if (!paisSeleccionado || isNaN(consumoMensual) || consumoMensual < 0) {
            resultados.innerHTML = `<p>Por favor, selecciona un país e introduce un consumo mensual válido.</p>`;
            return;
        }

        calcularPorcentaje(headers, data, paisSeleccionado, consumoMensual);
    });
});

function calcularPorcentaje(headers, data, paisSeleccionado, consumoMensual) {
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = "";

    const solarIndex = headers.indexOf('Solar Generation - TWh');
    if (solarIndex === -1) {
        resultados.innerHTML = `<p>Error: columna "Solar Generation - TWh" no encontrada en el archivo CSV.</p>`;
        return;
    }

    const filtered = data.filter(row => {
        const columns = row.split(',');
        return columns[0].trim() === paisSeleccionado;
    });

    if (filtered.length === 0) {
        resultados.innerHTML = `<p>No se encontraron datos para ${paisSeleccionado}.</p>`;
        return;
    }

    const lastRow = filtered[filtered.length - 1];
    const columns = lastRow.split(',');
    const solarGeneration = parseFloat(columns[solarIndex]);
    const consumoAnual = (consumoMensual * 12) / 1000;
    const porcentaje = (consumoAnual * 100) / solarGeneration;

    resultados.innerHTML = `
        <p>Consumo anual: ${consumoAnual.toFixed(6)} TWh</p>
        <p>Porcentaje del consumo respecto a la generación solar: ${porcentaje.toFixed(2)}%</p>
    `;
}
