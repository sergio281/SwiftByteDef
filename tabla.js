document.addEventListener('DOMContentLoaded', () => {
    const resultados = document.getElementById('resultados');
    const paisSelect = document.getElementById('paisSelect');
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

            mostrarDatos(headers, data, paisSelect.value);

            paisSelect.addEventListener('change', () => {
                mostrarDatos(headers, data, paisSelect.value);
            });
        })
        .catch(error => {
            resultados.innerHTML = `<p>Error: ${error.message}</p>`;
        });
});

function mostrarDatos(headers, data, paisSeleccionado) {
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = "";

    const filtered = data.filter(row => {
        const columns = row.split(',');
        return columns[0].trim() === paisSeleccionado;
    });

    if (filtered.length === 0) {
        resultados.innerHTML = `<p>No se encontraron datos para ${paisSeleccionado}.</p>`;
        return;
    }

    const tabla = document.createElement('table');
    tabla.border = "1";
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header.trim();
        headerRow.appendChild(th);
    });

    tabla.appendChild(headerRow);

    filtered.forEach(row => {
        const columns = row.split(',');
        const tr = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            td.innerText = column.trim();
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });

    resultados.appendChild(tabla);
}
