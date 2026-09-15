const shapeConfigs = {
    cuadrado: [{ id: 'lado', label: 'Lado' }],
    triangulo: [
        { id: 'ladoA', label: 'Lado A (Base)' },
        { id: 'ladoB', label: 'Lado B' },
        { id: 'ladoC', label: 'Lado C' }
    ],
    trapecio: [
        { id: 'baseMayor', label: 'Base Mayor' },
        { id: 'baseMenor', label: 'Base Menor' },
        { id: 'altura', label: 'Altura' }
    ],
    pentagono: [{ id: 'lado', label: 'Lado del Pentágono' }],
    circulo: [{ id: 'radio', label: 'Radio' }]
};

const select = document.getElementById('shape-select');
const dynamicInputs = document.getElementById('dynamic-inputs');
const calcBtn = document.getElementById('calc-btn');
const errorMsg = document.getElementById('error-message');
const resArea = document.getElementById('res-area');
const resPerimeter = document.getElementById('res-perimeter');
const canvas = document.getElementById('shapeCanvas');
const ctx = canvas.getContext('2d');

select.addEventListener('change', (e) => {
    const shape = e.target.value;
    const config = shapeConfigs[shape];
    
    dynamicInputs.innerHTML = '';
    errorMsg.textContent = '';
    limpiarResultados();

    config.forEach(inputData => {
        const group = document.createElement('div');
        group.className = 'input-group';
        
        const label = document.createElement('label');
        label.textContent = inputData.label;
        label.setAttribute('for', inputData.id);
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = inputData.id;
        input.placeholder = `Ingresa ${inputData.label.toLowerCase()}`;
        input.min = "0.1";
        input.step = "any";

        group.appendChild(label);
        group.appendChild(input);
        dynamicInputs.appendChild(group);
    });
});

function limpiarResultados() {
    resArea.textContent = '0.00';
    resPerimeter.textContent = '0.00';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

calcBtn.addEventListener('click', () => {
    const shape = select.value;
    errorMsg.textContent = '';
    
    if (!shape) {
        errorMsg.textContent = 'Por favor selecciona una figura.';
        return;
    }

    const inputs = Array.from(dynamicInputs.querySelectorAll('input'));
    const values = inputs.map(i => parseFloat(i.value));

    if (values.some(v => isNaN(v) || v <= 0)) {
        errorMsg.textContent = 'Por favor ingresa valores numéricos positivos en todos los campos.';
        return;
    }

    let area = 0;
    let perimeter = 0;
    let points = [];

    try {
        switch(shape) {
            case 'cuadrado':
                const l = values[0];
                area = Math.pow(l, 2);
                perimeter = l * 4;
                points = [
                    {x: 0, y: 0}, {x: l, y: 0}, 
                    {x: l, y: l}, {x: 0, y: l}
                ];
                break;

            case 'triangulo':
                const a = values[0], b = values[1], c = values[2];
                if (a + b <= c || a + c <= b || b + c <= a) {
                    throw new Error('Las medidas no forman un triángulo válido.');
                }
                perimeter = a + b + c;
                const s = perimeter / 2;
                area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
                
                const x_c = (Math.pow(a, 2) + Math.pow(c, 2) - Math.pow(b, 2)) / (2 * a);
                const y_c = Math.sqrt(Math.pow(c, 2) - Math.pow(x_c, 2));
                points = [
                    {x: 0, y: y_c},
                    {x: a, y: y_c},
                    {x: x_c, y: 0}
                ];
                break;

            case 'trapecio':
                const B = values[0];
                const baseMin = values[1];
                const h = values[2];
                
                if (baseMin >= B) throw new Error('La base mayor debe ser más grande que la menor.');
                
                const ladoInclinado = Math.sqrt(Math.pow(h, 2) + Math.pow((B - baseMin) / 2, 2));
                perimeter = B + baseMin + (2 * ladoInclinado);
                area = ((B + baseMin) * h) / 2;

                points = [
                    {x: 0, y: h}, 
                    {x: B, y: h}, 
                    {x: B - (B - baseMin)/2, y: 0}, 
                    {x: (B - baseMin)/2, y: 0}
                ];
                break;

            case 'pentagono':
                const ladoPent = values[0];
                perimeter = 5 * ladoPent;
                const apotema = ladoPent / (2 * Math.tan(Math.PI / 5));
                area = (perimeter * apotema) / 2;

                const R = ladoPent / (2 * Math.sin(Math.PI / 5));
                for(let i = 0; i < 5; i++) {
                    const angulo = -Math.PI / 2 + i * (2 * Math.PI / 5);
                    points.push({
                        x: R + R * Math.cos(angulo),
                        y: R + R * Math.sin(angulo)
                    });
                }
                break;

            case 'circulo':
                const r = values[0];
                area = Math.PI * Math.pow(r, 2);
                perimeter = 2 * Math.PI * r;
                points = { isCircle: true, r: r }; 
                break;
        }

        resArea.textContent = area.toFixed(2);
        resPerimeter.textContent = perimeter.toFixed(2);

        drawShape(points);

    } catch (err) {
        errorMsg.textContent = err.message;
        limpiarResultados();
    }
});

function drawShape(shapeData) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(20, 184, 166, 0.2)';
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 3;

    const padding = 40;
    const drawAreaW = canvas.width - padding * 2;
    const drawAreaH = canvas.height - padding * 2;

    ctx.beginPath();

    if (shapeData.isCircle) {
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(drawAreaW, drawAreaH) / 2, 0, Math.PI * 2);
    } else {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        
        shapeData.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });

        const shapeW = maxX - minX;
        const shapeH = maxY - minY;

        const scale = Math.min(drawAreaW / shapeW, drawAreaH / shapeH);

        shapeData.forEach((p, index) => {
            const drawX = (p.x - minX) * scale + (canvas.width - shapeW * scale) / 2;
            const drawY = (p.y - minY) * scale + (canvas.height - shapeH * scale) / 2;
            
            if (index === 0) ctx.moveTo(drawX, drawY);
            else ctx.lineTo(drawX, drawY);
        });
        ctx.closePath();
    }

    ctx.fill();
    ctx.stroke();
}
