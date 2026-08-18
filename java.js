
function operacion(){
    
let resultadonum = document.getElementById("result-num");
let resultadoden = document.getElementById("result-den");
let numerador1 = Number(document.getElementById("num1").value);
let numerador2 = Number(document.getElementById("num2").value);
let denominador1 = Number(document.getElementById("den1").value);
let denominador2 = Number(document.getElementById("den2").value);
let signo = document.getElementById("operator").value;


if(numerador1 != "" && numerador2 != "" && denominador1 != "" && denominador2 != ""){

    if(signo === "+"){
        console.log("+");
        let mult1 = denominador1 * numerador2;
        let mult2 = denominador2 * numerador1;
        let numFinal = mult1 + mult2;
        let denFinal = denominador1 * denominador2;
        resultadonum.value = numFinal;
        resultadoden.value = denFinal;
    }else if(signo === "-"){
        console.log("-");
        let mult1 = denominador1 * numerador2;
        let mult2 = denominador2 * numerador1;
        let numFinal = mult2 - mult1;
        let denFinal = denominador1 * denominador2;
        resultadonum.value = numFinal;
        resultadoden.value = denFinal;
    }else if(signo === "*"){
        let denFinal = denominador1 * denominador2;
        let numFinal = numerador1 * numerador2;
        resultadonum.value = numFinal;
        resultadoden.value = denFinal;
    }else if(signo === "/"){
        let denFinal = denominador1 * numerador2;
        let numFinal = numerador1 * denominador2;
        resultadonum.value = numFinal;
        resultadoden.value = denFinal;
    }else{
        alert("ingrese el signo")
    }

}else{
alert("reyene todos los campos");
}
}
