class extend extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
         <h1>Simulación de Préstamo</h1>
    
    <form>
        <div class="form-group">
            <label for="nombre">Nombre del Cliente:</label>
            <input type="text" id="nombre" name="nombre" required>
        </div>

        <div class="form-group">
            <label for="documento">Documento de Identidad:</label>
            <input type="text" id="documento" name="documento" required>
        </div>

        <div class="form-group">
            <label for="monto">Monto del Préstamo:</label>
            <input type="number" id="monto" name="monto" required>
        </div>

        <div class="form-group">
            <label for="tasa">Tasa de Interés Anual (%):</label>
            <input type="number" id="tasa" name="tasa" step="0.01" required>
        </div>

        <div class="form-group">
            <label for="plazo">Plazo (Meses):</label>
            <input type="number" id="plazo" name="plazo" required>
        </div>

        <div class="form-group">
            <label for="amortizacion">Tipo de Amortización:</label>
            <select id="amortizacion" name="amortizacion" required>
                <option value="frances">Francés</option>
                <option value="americano">Americano</option>
            </select>
        </div>

        <button type="submit">Calcular</button>
    </form>

    <h2>Tabla de Amortización</h2>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Cuota</th>
                    <th>Saldo Inicial</th>
                    <th>Cuota Mensual</th>
                    <th>Intereses</th>
                    <th>Amortización</th>
                    <th>Saldo Restante</th>
                </tr>
            </thead>
            <tbody>
                <!-- Rows will be populated by JavaScript -->
            </tbody>
        </table>
    </div>

    <h2>Historial de Préstamos</h2>
    <div class="table-container">
        <!-- Historical data will be populated by JavaScript -->
    </div>
            
        `;
    }
}

customElements.define('extend-d', extend);
