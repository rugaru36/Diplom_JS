//возвращает вектор с таким направлением и длиной, угол в градусах
function createVector(angle, length) {
    //получим положительный угол, не больше 360
    while (Math.abs(angle) >= 360 || angle < 0) {
        if (angle < 0) angle += 360;
        else angle -= 360;
    }

    //первая четверть
    if (angle >= 0 && angle <= 90) {
        return [Math.sin(degToRad(90 - angle)) * length,
            Math.sin(degToRad(angle)) * length
        ];
    }
    //вторая четверть
    else if (angle > 90 && angle < 180) {
        return [Math.sin(degToRad(90 - (180 - angle))) * length * (-1),
            Math.sin(degToRad((180 - angle))) * length
        ];
    }
    //третья четверть
    else if (angle >= 180 && angle <= 270) {
        return [Math.sin(degToRad(90 - (angle - 180))) * length * (-1),
            Math.sin(degToRad((angle - 180))) * length * (-1)
        ];
    }
    //четвертая четверть
    else if (angle > 270 && angle < 360) {
        return [Math.sin(degToRad(90 - (360 - angle))) * length,
            Math.sin(degToRad((360 - angle))) * length * (-1)
        ];
    }
}


//переводы углов
function radToDeg(rad) {
    return (rad * 180) / Math.PI;
}
function degToRad(deg) {
    return (Math.PI * deg) / 180;
}


//модуль вектора
function modOfVector(vector) {
    return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
}

//поворот вектора, угол в радианах
function turnVector(vector, angle) {
    var resultVector = [];

    resultVector[0] = vector[0] * Math.cos(angle) + vector[1] * Math.sin(angle);
    resultVector[1] = vector[1] * Math.cos(angle) - vector[0] * Math.sin(angle);

    return resultVector;
}

//угол вектора в радианах
function findCorrectAngle(vector) {

    if (vector[0] > 0 && vector[1] > 0) { //первая четверть
        return Math.asin(Math.abs(vector[1]) / modOfVector(vector));
    }
    else if (vector[0] < 0 && vector[1] > 0) { //вторая четверть
        return (Math.PI - Math.asin(Math.abs(vector[1]) / modOfVector(vector)));
    }
    else if (vector[0] < 0 && vector[1] < 0) { //третья четверть
        return (Math.PI + Math.asin(Math.abs(vector[1]) / modOfVector(vector)));
    }
    else if (vector[0] > 0 && vector[1] < 0) { //четвёртая четверть
        return (2 * Math.PI - Math.asin(Math.abs(vector[1]) / modOfVector(vector)));
    }
    else if (vector[0] == 0 && vector[1] > 0) { // вверх
        return Math.PI / 2;
    }
    else if (vector[0] == 0 && vector[1] < 0) { // вниз
        return Math.PI * 3 / 2;
    }
    else if (vector[0] > 0 && vector[1] == 0) { // вправо
        return 0;
    }
    else if (vector[0] < 0 && vector[1] == 0) { // влево
        return Math.PI;
    }
    else return 0;
}