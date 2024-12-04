// Función para cargar los datos del CSV
async function cargarDatosDeCSV() {
    try {
        const respuesta = await fetch('graficalinea.csv');
        if (!respuesta.ok) {
            throw new Error(`¡Vaya! No se pudo cargar el archivo de datos: ${respuesta.statusText}`);
        }

        const contenido = await respuesta.text();
        const filas = contenido.split('\n').slice(1); // Saltamos la primera fila (cabeceras)
        const anios = [];
        const valores = [];

        filas.forEach(fila => {
            const [entidad, codigo, anio, energia] = fila.split(',');
            if (entidad === 'Colombia' && anio && energia) {
                anios.push(anio.trim());
                valores.push(parseFloat(energia.trim()));
            }
        });

        if (anios.length === 0 || valores.length === 0) {
            throw new Error('No pudimos encontrar los datos necesarios. Por favor, revisa el archivo.');
        }

        return { anios, valores };
    } catch (error) {
        document.getElementById('mensajeError').textContent = error.message;
        console.error(error);
        return { anios: [], valores: [] };
    }
}

// Función para mostrar el gráfico de línea
async function mostrarGraficoLinea() {
    const { anios, valores } = await cargarDatosDeCSV();

    if (anios.length === 0 || valores.length === 0) {
        console.warn('No se pudo crear la gráfica porque faltan datos.');
        return;
    }

    const contexto = document.getElementById('graficoSolar').getContext('2d');
    new Chart(contexto, {
        type: 'line',
        data: {
            labels: anios,
            datasets: [{
                label: 'Generación de Energía Solar (TWh)',
                data: valores,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 3,
                tension: 0.5,
                pointRadius: function(context) {
                    const chartWidth = context.chart.width;
                    return chartWidth > 600 ? 3 : 1.5;
                },
                pointHoverRadius: function(context) {
                    const chartWidth = context.chart.width;
                    return chartWidth > 600 ? 5 : 3;
                }
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Evolución de la Electricidad Solar Generada en Colombia' }
            }
        }
    });
}

// Función para mostrar el gráfico de barras
function mostrarGraficoBarras() {
    const labels = [
        'Energía Eólica',
        'Energía Solar',
        'Energía Hidroeléctrica',
        'Biocombustibles',
        'Geotérmica'
    ];
    
    const dataValues = [0.07, 0.32, 71.92, 8.01, 0];
    
    const ctx = document.getElementById('graficoBarras').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Producción en TWh (2021)',
                data: dataValues,
                backgroundColor: [
                    'rgba(93, 156, 89, 0.8)',  // Verde oscuro (Eólica)
                    'rgba(255, 193, 7, 0.8)',  // Amarillo dorado (Solar)
                    'rgba(41, 128, 185, 0.8)', // Azul profundo (Hidroeléctrica)
                    'rgba(121, 85, 72, 0.8)',  // Marrón tierra (Biocombustibles)
                    'rgba(155, 89, 182, 0.8)'  // Púrpura neutral (Geotérmica)
                ],
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(39, 174, 96, 0.8)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                datalabels: {
                    color: '#34495e',
                    font: { weight: 'bold', size: 12 },
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => `${value.toFixed(2)} TWh`
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: { size: 14, weight: '500' },
                        color: '#2c3e50'
                    },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 14, weight: '500' },
                        color: '#2c3e50',
                        callback: (value) => `${value} TWh`
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                }
            },
            elements: {
                bar: { borderRadius: 8 }
            }
        },
        plugins: [ChartDataLabels]
    });
}
// Función para mostrar el gráfico de torta
function mostrarGraficoTorta() {
        // Los datos en formato CSV
    const csvData = `
    Entity,Electricity Type,Value (TWh)
    Colombia,Solar,0.32
    Colombia,Eolica,0.07415646
    Colombia,Hidroelectrica,71.91941
    Colombia,Biocombustible,8.00661
    Colombia,Geotermica,0
    `;

    // Convertir los datos CSV en un formato usable
    function parseCSV(csv) {
        const rows = csv.trim().split('\n').slice(1); // Eliminar la primera fila de encabezado
        return rows.map(row => {
            const cols = row.split(',');
            return {
                electricityType: cols[1],
                value: parseFloat(cols[2])
            };
        });
    }

    // Obtener los datos procesados
    const parsedData = parseCSV(csvData);

    // Extraer etiquetas y valores para el gráfico
    const labels = parsedData.map(item => item.electricityType);
    const values = parsedData.map(item => item.value);

    // Crear el gráfico de torta
    const ctx = document.getElementById('graficoTorta').getContext('2d');
    const energyChart = new Chart(ctx, {
        type: 'pie', // Tipo de gráfico (torta)
        data: {
            labels: labels,
            datasets: [{
                label: 'Electricidad por Fuente (TWh)',
                data: values,
                backgroundColor: [
                'rgba(255, 183, 3, 0.6)',   // Amarillo Vibrante (Solar)
                    'rgba(3, 169, 244, 0.6)',   // Azul Celeste (Wind)
                    'rgba(0, 200, 83, 0.6)',    // Verde Esmeralda (Hydro)
                    'rgba(255, 87, 34, 0.6)',   // Naranja Intenso (Biofuels)
                    'rgba(156, 39, 176, 0.6)'   // Morado Violeta (Geothermal)
                ],
                borderColor: [
                    'rgba(255, 183, 3, 1)',   // Amarillo Vibrante (Solar)
                    'rgba(3, 169, 244, 1)',   // Azul Celeste (Wind)
                    'rgba(0, 200, 83, 1)',    // Verde Esmeralda (Hydro)
                    'rgba(255, 87, 34, 1)',   // Naranja Intenso (Biofuels)
                    'rgba(156, 39, 176, 1)'   // Morado Violeta (Geothermal)
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Consumo de Energía Renovable en Colombia'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.raw.toFixed(2) + ' TWh'; // Mostrar dos decimales
                        }
                    }
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Función para mostrar el gráfico de área
function mostrarGraficoArea() {
    console.log('Intentando cargar datos para graficoArea...');
    fetch('datostwh.csv')
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar datostwh.csv');
            return response.text();
        })
        .then(data => {
            console.log('Datos cargados para graficoArea:', data);
            const datos = data.split('\n').map((fila) => {
                const valores = fila.split(',');
                return {
                    energia: valores[0],
                    valor: parseFloat(valores[1])
                };
            });

            const ctx = document.getElementById('graficoArea').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: datos.map((dato) => dato.energia),
                    datasets: [{
                        label: 'Colombia 2021',
                        data: datos.map((dato) => dato.valor),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'Gráfica de área' }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error al crear graficoArea:', error.message);
        });
}


document.addEventListener('DOMContentLoaded', () => {
    mostrarGraficoTorta();
    mostrarGraficoLinea();
    mostrarGraficoBarras();
    mostrarGraficoArea();
});

