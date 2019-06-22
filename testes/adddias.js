function addDias(data, dias) {
    let result = new Date(data);
    result.setDate(result.getDate() + dias);
    return result;
}

