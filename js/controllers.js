document.addEventListener('DOMContentLoaded', () => {
    if (window.controllerInitialized) return;
    window.controllerInitialized = true;

    let isSubmitting = false;
    const customElement = document.querySelector('extend-d');
    const form = customElement.querySelector('form');

    if (!form.dataset.listenerAdded) {
        form.dataset.listenerAdded = 'true';

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (isSubmitting) return;
            isSubmitting = true;

            // Deshabilitar botón
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            // Obtener valores del formulario
            const nombre = form.querySelector('#nombre').value;
            const documento = form.querySelector('#documento').value;
            const monto = parseFloat(form.querySelector('#monto').value);
            const tasa = parseFloat(form.querySelector('#tasa').value);
            const plazo = parseInt(form.querySelector('#plazo').value);
            const tipo = form.querySelector('#amortizacion').value;

            // Calcular amortización
            const tablaAmortizacion = calcularAmortizacion(monto, tasa, plazo, tipo);

            // Limpiar y actualizar la tabla de amortización
            const tbody = customElement.querySelector('table tbody');
            tbody.innerHTML = '';

            tablaAmortizacion.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.mes}</td>
                    <td>${formatNumber(row.saldoInicial)}</td>
                    <td>${formatNumber(row.cuota)}</td>
                    <td>${formatNumber(row.intereses)}</td>
                    <td>${formatNumber(row.amortizacion)}</td>
                    <td>${formatNumber(row.saldoRestante)}</td>
                `;
                tbody.appendChild(tr);
            });

            // Crear el objeto JSON
            const prestamoId = Date.now();
            const clientData = {
                nombre: nombre,
                documento: documento,
                prestamos: [
                    {
                        id: prestamoId,
                        monto: monto,
                        tasaInteres: tasa,
                        plazoMeses: plazo,
                        tipoAmortizacion: tipo === 'frances' ? "Francés" : "Americano",
                        tablaAmortizacion: tablaAmortizacion
                    }
                ]
            };

            // Enviar al servidor
            try {
                const response = await fetch('http://localhost:4000/clientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(clientData)
                });

                if (!response.ok) throw new Error('Error en la subida de datos');

                alert('¡Préstamo guardado correctamente!');
                form.reset();
            } catch (error) {
                console.error('Error al enviar datos:', error);
                alert('Error al enviar los datos: ' + error.message);
            }

            // Reset de estado
            isSubmitting = false;
            submitButton.disabled = false;
        });
    }
});

// Función para calcular la amortización
function calcularAmortizacion(monto, tasaAnual, plazo, tipo) {
    const tasaMensual = (tasaAnual / 100) / 12;
    let tablaAmortizacion = [];
    let saldo = monto;

    if (tipo === 'frances') {
        const cuotaMensual = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);

        for (let i = 1; i <= plazo; i++) {
            let interes = saldo * tasaMensual;
            let amortizacion = cuotaMensual - interes;
            saldo -= amortizacion;
            saldo = saldo < 0 ? 0 : saldo;

            tablaAmortizacion.push({
                mes: i,
                saldoInicial: monto - (cuotaMensual * (i - 1)),
                cuota: cuotaMensual,
                intereses: interes,
                amortizacion: amortizacion,
                saldoRestante: saldo
            });
        }
    } else if (tipo === 'americano') {
        let interesMensual = monto * tasaMensual;

        for (let i = 1; i <= plazo; i++) {
            if (i < plazo) {
                tablaAmortizacion.push({
                    mes: i,
                    saldoInicial: monto,
                    cuota: interesMensual,
                    intereses: interesMensual,
                    amortizacion: 0,
                    saldoRestante: monto
                });
            } else {
                let cuotaFinal = interesMensual + monto;
                tablaAmortizacion.push({
                    mes: i,
                    saldoInicial: monto,
                    cuota: cuotaFinal,
                    intereses: interesMensual,
                    amortizacion: monto,
                    saldoRestante: 0
                });
            }
        }
    }

    return tablaAmortizacion;
}

// Función para formatear los números correctamente
function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}
