/**
 * @return {boolean}
 */
function TestaCPF(strCPF) {
    let cleanCPF = strCPF.replace('.', '').replace('.', '').replace('-','');
    console.log(cleanCPF);
    let Soma;
    let Resto;
    Soma = 0;

    if (cleanCPF === "00000000000" || cleanCPF === "11111111111" || cleanCPF === "22222222222" || cleanCPF === "33333333333" || cleanCPF === "44444444444" || cleanCPF === "55555555555" || cleanCPF === "66666666666" || cleanCPF === "77777777777" || cleanCPF === "88888888888" || cleanCPF === "99999999999")  {
        return false;
    }
    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) {
        Resto = 0;
    }
    if (Resto !== parseInt(cleanCPF.substring(9, 10))) {
        return false;
    }

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto === 10) || (Resto === 11)) {
        Resto = 0;
    }
    return Resto === parseInt(cleanCPF.substring(10, 11));

}

let strCPF = "099.920.924-83";
console.log(TestaCPF(strCPF));