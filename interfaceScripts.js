//Запись старого значения на всякий пожарный
function setOldValue(idOfElement) {
    document.getElementById("hiddenOldValueBuff").value = document.getElementById(idOfElement).value;
}

function checkIsEscaperInerted(e) {
    if (e.checked) {
        document.getElementById("escaperRadiusDiv").style.display = "block";
    }
    else {
        document.getElementById("escaperRadiusDiv").style.display = "none";
    }
    GameObject.updateData(e);
}

function checkPDirection(e){
    if(e.checked){
        document.getElementById("pDirectionDiv").style.display = "block";
    }
    else{
        document.getElementById("pDirectionDiv").style.display = "none";   
    }
    GameObject.updateData(e);
}

//Проверка при изменении прямым вводом
function onChangeCheck(idOfElement) {

    var oldValue = document.getElementById("hiddenOldValueBuff").value;

    if (document.getElementById(idOfElement).hasAttribute("min")) {
        var min = document.getElementById(idOfElement).getAttribute("min") * 1;
    }

    if (document.getElementById(idOfElement).hasAttribute("max")) {
        var max = document.getElementById(idOfElement).getAttribute("max") * 1;
    }

    if (document.getElementById(idOfElement).value == "") {
        alert("Пустое поле!");
        document.getElementById(idOfElement).value = oldValue;
        return;
    }

    else if (max != null && document.getElementById(idOfElement).value > max) {
        alert("Больше максимума!");
        document.getElementById(idOfElement).value = oldValue;
        return;
    }

    else if (min != null && document.getElementById(idOfElement).value < min) {
        alert("Меньше минимума!");
        document.getElementById(idOfElement).value = oldValue;
        return;
    }
}

//изменение кнопкой
function onPlus(idOfElement) {

    var sizeOfStep;

    var maxValueExists = document.getElementById(idOfElement).hasAttribute("max");

    if (maxValueExists) max = document.getElementById(idOfElement).getAttribute("max") * 1;

    if (idOfElement == "pursuiterRadius" || idOfElement == "escaperRadius") sizeOfStep = 0.5;
    else if (idOfElement == "pursuiterVectorAngle" || idOfElement == "escaperVectorDirection" 
                                    || idOfElement == "pursuiterVectorDirection") sizeOfStep = 10;
    else if (idOfElement == "h") sizeOfStep = 0.01;
    else if (idOfElement == "accuracy") sizeOfStep = 0.05;
    else if (idOfElement == "speed") sizeOfStep = 0.5;
    else sizeOfStep = 1;

    var currentValue = document.getElementById(idOfElement).value * 1;

    if (maxValueExists && currentValue + sizeOfStep > max) {
        if (currentValue != max) {
            result = max;
            document.getElementById(idOfElement).value = result;
            GameObject.updateData(document.getElementById(idOfElement));
            return;
        }
        else return;
    }

    else {
        var result = currentValue + sizeOfStep;
        if (result % sizeOfStep != 0 && (sizeOfStep == 0.5 || sizeOfStep == 10)) {
            result -= (result - sizeOfStep);
        }
    }

    if (sizeOfStep >= 1 && Math.abs(result - Math.round(result)) < 0.01) {
        document.getElementById(idOfElement).value = result.toFixed();
        GameObject.updateData(document.getElementById(idOfElement));
        return;
    }
    else if (sizeOfStep == 0.5 || sizeOfStep == 0.1) {
        document.getElementById(idOfElement).value = result.toFixed(1);
        GameObject.updateData(document.getElementById(idOfElement));
        return;
    }

    document.getElementById(idOfElement).value = result.toFixed(2);
    GameObject.updateData(document.getElementById(idOfElement));
    
}

//изменение кнопкой
function onMinus(idOfElement) {

    var sizeOfStep;
    var minValueExists = document.getElementById(idOfElement).hasAttribute("min");

    if (minValueExists) min = document.getElementById(idOfElement).getAttribute("min") * 1;

    if (idOfElement == "pursuiterVectorAngle" || idOfElement == "escaperVectorDirection" 
            || idOfElement == "pursuiterVectorDirection") sizeOfStep = 10;
    else if (idOfElement == "pursuiterRadius" || idOfElement == "escaperRadius") sizeOfStep = 0.5;
    else if (idOfElement == "h") sizeOfStep = 0.01;
    else if (idOfElement == "accuracy") sizeOfStep = 0.05;
    else if (idOfElement == "speed") sizeOfStep = 0.5
    else sizeOfStep = 1;

    var currentValue = document.getElementById(idOfElement).value * 1;

    if (minValueExists && currentValue - sizeOfStep < min) {
        if (currentValue != min) {
            result = min;
            document.getElementById(idOfElement).value = result;
            GameObject.updateData(document.getElementById(idOfElement));
            return;
        }
        else return;
    }

    else {
        var result = currentValue - sizeOfStep;
        if (result % sizeOfStep != 0 && (sizeOfStep == 0.5 || sizeOfStep == 10)) {
            result -= (result - sizeOfStep);
        }
    }

    if (sizeOfStep >= 1 && Math.abs(result - Math.round(result)) < 0.01) {
        document.getElementById(idOfElement).value = result.toFixed();
        GameObject.updateData(document.getElementById(idOfElement));
        return;
    }
    else if (sizeOfStep == 0.5 || sizeOfStep == 0.1) {
        document.getElementById(idOfElement).value = result.toFixed(1);
        GameObject.updateData(document.getElementById(idOfElement));
        return;
    }
    else document.getElementById(idOfElement).value = result.toFixed(2);
    GameObject.updateData(document.getElementById(idOfElement));
    
}