/* 
    Player (родительский класс игрока)
    
    constructor(x, y, isInerted, radius, speedVectorDirection, speedVectorLength)
    moveToWantedPoint(stepSize) - двигаемся к вычесленной точке wantedPoint
    resetToStartPoint() - вернуть текущие координаты на старт

    Pursuiter (класс преследователя):

    constructor(x, y, radius, speedVectorDirection, speedVectorLength)
    calculateNextPoint(escaperCoordinates, h) - расчёт сл точки

    Escaper (класс убегающего):

    constructor(x, y, isInerted, radius, speedVectorDirection, speedVectorLength)
    calculateNextPoint(PursuiterCoordinates, PursuiterSpeedVector, PursuiterRadius) - расчёт сл точки

    GameInterface (класс игры):

    constructor(inputStepSize, inputAccuracy, inputTime)
    nextStep() - сл шаг, запускает процесс решения на текущей итерации
    checkIsSolved() возвращает true, если игра закончена; в член класса записывает, кто победил
    startGameProcess() - итерационный процесс
    updateData(e) - обновление данных из инпутов
    rebootData() - перезагрузить данные перед запуском
    createPlayers() - первичное создание игроков
*/

class Player {

    
    constructor(x, y, isInerted, radius, speedVectorDirection, speedVectorLength) {
        if (isInerted) {
            this.radius = radius;
            this.maxAngle = speedVectorLength / radius;
        }
        else {
            this.radius = 0;
            this.maxAngle = 0;
        }

        this.currentCoordinates = [x, y];
        this.startCoordinates = [x, y];

        this.wantedPoint = [];

        this.speedVector = createVector(speedVectorDirection, speedVectorLength);
        this.startSpeedVector = createVector(speedVectorDirection, speedVectorLength);
    }

    moveToWantedPoint(stepSize) {
        //вектор от убегающего до желаемой точки
        var Jvector = [this.wantedPoint[0] - this.currentCoordinates[0], this.wantedPoint[1] - this.currentCoordinates[1]];

        if (this.radius == 0) {
            this.speedVector = turnVector(this.speedVector, findCorrectAngle(this.speedVector) -
                findCorrectAngle(Jvector))
        }
        else if (this.radius > 0) {
            var angleToWantedPoint = findCorrectAngle(this.speedVector) - findCorrectAngle(Jvector);

            if (angleToWantedPoint > Math.PI) angleToWantedPoint -= 2 * Math.PI;

            else if (angleToWantedPoint < -1 * Math.PI) angleToWantedPoint += 2 * Math.PI;

            if (Math.abs(angleToWantedPoint) < this.maxAngle * stepSize)
                this.speedVector = turnVector(this.speedVector, angleToWantedPoint);

            else this.speedVector = turnVector(this.speedVector, Math.sign(angleToWantedPoint) * degToRad(this.maxAngle));
        }

        this.currentCoordinates[0] += this.speedVector[0] * stepSize;
        this.currentCoordinates[1] += this.speedVector[1] * stepSize;
    }

    resetToStartPoint() {
        this.currentCoordinates[0] = this.startCoordinates[0];
        this.currentCoordinates[1] = this.startCoordinates[1];

        this.speedVector[0] = this.startSpeedVector[0];
        this.speedVector[1] = this.startSpeedVector[1];
    }
}

class Pursuiter extends Player {
    constructor(x, y, radius, speedVectorDirection, speedVectorLength) {

        super(x, y, true, radius, speedVectorDirection, speedVectorLength);

        this.FiAngle = findCorrectAngle(this.speedVector);
    }

    calculateNextPoint(escaperCoordinates, h) {
        var Lvector = [
            escaperCoordinates[0] - this.currentCoordinates[0],
            escaperCoordinates[1] - this.currentCoordinates[1]
        ];

        this.wantedPoint = [this.currentCoordinates[0] + Lvector[0], this.currentCoordinates[1] + Lvector[1]];
    }
}

class Evader extends Player {

    constructor(x, y, isInerted, radius, speedVectorDirection, speedVectorLength) {

        super(x, y, isInerted, radius, speedVectorDirection, speedVectorLength);

        this.wantedAngleToL = 0; //угол, который хотим поддерживать с вектором L

        this.numOfPoint = 0; //в какуй именно радиус стремиться
    }


    calculateNextPoint(PursuiterCoordinates, PursuiterSpeedVector, PursuiterRadius) {
        //вектор, направленный от преследующего к убегающему
        var Lvector = [
            this.currentCoordinates[0] - PursuiterCoordinates[0],
            this.currentCoordinates[1] - PursuiterCoordinates[1]
        ];

        this.wantedPoint = [];


        /*дальняя дистанция, идём по заданному курсу*/
        if (modOfVector(Lvector) > 10 / PursuiterRadius) {

            this.numOfPoint = 0;
            this.wantedPoint = [
                this.currentCoordinates[0] + this.speedVector[0],
                this.currentCoordinates[1] + this.speedVector[1]
            ];
        }

        //средняя дистанция
        else if ((modOfVector(Lvector) > (PursuiterRadius / 2) && modOfVector(Lvector) <= 10 / PursuiterRadius)) {

            this.numOfPoint = 0;
            this.wantedPoint = [this.currentCoordinates[0] + Lvector[0], this.currentCoordinates[1] + Lvector[1]];
        }

        //если находимся близко
        else if (modOfVector(Lvector) <= (PursuiterRadius / 2)) {
            //вектора от преследователя до цетров
            var buffVector1 = createVector(radToDeg(findCorrectAngle(PursuiterSpeedVector)) + 90, PursuiterRadius);
            var buffVector2 = createVector(radToDeg(findCorrectAngle(PursuiterSpeedVector)) - 90, PursuiterRadius);

            var radPoint1 = [PursuiterCoordinates[0] + buffVector1[0], PursuiterCoordinates[1] + buffVector1[1] * 1.8];
            var radPoint2 = [PursuiterCoordinates[0] + buffVector2[0], PursuiterCoordinates[1] + buffVector2[1] * 1.8];

            var toRad1 = modOfVector([radPoint1[0] - this.currentCoordinates[0],
            radPoint1[1] - this.currentCoordinates[1]
            ]);

            var toRad2 = modOfVector([radPoint2[0] - this.currentCoordinates[0],
            radPoint2[1] - this.currentCoordinates[1]
            ]);

            if ((toRad2 > toRad1) && this.numOfPoint == 0) {
                this.numOfPoint = 1;
            }
            else if ((toRad2 < toRad1) && this.numOfPoint == 0) {
                this.numOfPoint = 2;
            }

            if (this.numOfPoint == 1) this.wantedPoint = radPoint1;
            else if (this.numOfPoint == 2) this.wantedPoint = radPoint2;
        }
    }
}

class Game {

    constructor(inputStepSize, inputAccuracy, inputTime) {

        this.l_vector = [
            document.getElementById("Xe").value - document.getElementById("Xp").value,
            document.getElementById("Ye").value - document.getElementById("Yp").value
        ];

        this.createPlayers();

        this.stepSize = inputStepSize;
        this.accuracy = inputAccuracy;

        this.time = inputTime;
    }

    rebootData() {

        this.e_player.resetToStartPoint();
        this.p_player.resetToStartPoint();

        this.l_vector[0] = this.e_player.currentCoordinates[0] - this.p_player.currentCoordinates[0];
        this.l_vector[1] = this.e_player.currentCoordinates[1] - this.p_player.currentCoordinates[1];

        this.gameData = [];

        this.gameData["whoWon"] = "N";
        this.gameData["endTime"] = 0;

        this.gameData["escaperCoordinates"] = [];
        this.gameData["pursuiterCoordinates"] = [];

        this.gameData["alphaAngles"] = [];
        this.gameData["distance"] = [];

        this.gameData["min_X"] = this.e_player.currentCoordinates[0];
        this.gameData["max_X"] = this.e_player.currentCoordinates[0];
        this.gameData["min_Y"] = this.e_player.currentCoordinates[1];
        this.gameData["max_Y"] = this.e_player.currentCoordinates[1];

        this.dataToDrawGraphics = [];
        this.dataToDrawGraphics["Escaper"] = [];
        this.dataToDrawGraphics["Pursuiter"] = [];
    }

    checkIsSolved() {

        //догнал
        if (modOfVector(this.l_vector) <= this.accuracy) {
            this.gameData["whoWon"] = "P"
            return true;
        }

        //векторы к центрам
        var buffVector1 = createVector(radToDeg(findCorrectAngle(this.p_player.speedVector)) + 90, this.p_player.radius);
        var buffVector2 = createVector(radToDeg(findCorrectAngle(this.p_player.speedVector)) - 90, this.p_player.radius);

        //центры
        var radCenter1 = [
            this.p_player.currentCoordinates[0] + buffVector1[0],
            this.p_player.currentCoordinates[1] + buffVector1[1]
        ];
        var radCenter2 = [
            this.p_player.currentCoordinates[0] + buffVector2[0],
            this.p_player.currentCoordinates[1] + buffVector2[1]
        ];

        //вектор от убегающего к центру
        var vectorToFirstRadPoint = [
            radCenter1[0] - this.e_player.currentCoordinates[0], radCenter1[1] - this.e_player.currentCoordinates[1]
        ];
        var vectorToSecondRadPoint = [
            radCenter2[0] - this.e_player.currentCoordinates[0], radCenter2[1] - this.e_player.currentCoordinates[1]
        ];

        var isInFirstRad = modOfVector(vectorToFirstRadPoint) < this.p_player.radius * 0.8;
        var isInSeconsRad = modOfVector(vectorToSecondRadPoint) < this.p_player.radius * 0.8;

        if (isInFirstRad || isInSeconsRad) {
            this.gameData["whoWon"] = "E";
            return true;
        }

        return false;
    }

    createPlayers() {

        var pDirection;

        if (document.getElementById("manualPDirection").checked) {
            pDirection = document.getElementById("pursuiterVectorDirection").value * 1;
        }
        else {
            pDirection = radToDeg(findCorrectAngle(this.l_vector));
        }
        //объекты игроков
        this.p_player = new Pursuiter(
            document.getElementById("Xp").value * 1,
            document.getElementById("Yp").value * 1,
            document.getElementById('pursuiterRadius').value * 1,
            pDirection,
            document.getElementById("pursuiterVectorLength").value * 1);

        this.e_player = new Evader(
            document.getElementById("Xe").value * 1,
            document.getElementById("Ye").value * 1,
            document.getElementById("IsEscaperInerted").checked,
            document.getElementById("escaperRadius").value,
            document.getElementById("escaperVectorDirection").value * 1,
            document.getElementById("escaperVectorLength").value * 1);
    }

    startGameProcess() {

        this.rebootData();

        //console.log(this.gameData["endTime"]);
        for (var i = 0; i < (this.time / this.stepSize) - 1; i++) {

            //отслеживаемые точки - кратные 50ти
            if (i == (this.time / this.stepSize) - 2 || i % 50 == 0) {

                this.gameData["pursuiterCoordinates"].push({
                    "x": this.p_player.currentCoordinates[0],
                    "y": this.p_player.currentCoordinates[1]
                });

                this.gameData["escaperCoordinates"].push({
                    "x": this.e_player.currentCoordinates[0],
                    "y": this.e_player.currentCoordinates[1]
                });

                this.gameData["alphaAngles"].push(
                    (radToDeg(findCorrectAngle(this.p_player.speedVector)) - radToDeg(findCorrectAngle(this.l_vector))));

                this.gameData["distance"].push(modOfVector(this.l_vector));
            }

            //точки, по которым будет строиться график
            if (i == (this.time / this.stepSize) - 2 || i % 4 == 0 || i == 0) {

                this.dataToDrawGraphics["Pursuiter"].push({
                    "x": this.p_player.currentCoordinates[0],
                    "y": this.p_player.currentCoordinates[1]
                });

                this.dataToDrawGraphics["Escaper"].push({
                    "x": this.e_player.currentCoordinates[0],
                    "y": this.e_player.currentCoordinates[1]
                });
            }


            this.makeNextStep();

            this.gameData["min_X"] =
                Math.min(this.e_player.currentCoordinates[0], this.p_player.currentCoordinates[0], this.gameData["min_X"]);
            this.gameData["max_X"] =
                Math.max(this.e_player.currentCoordinates[0], this.p_player.currentCoordinates[0], this.gameData["max_X"]);

            this.gameData["min_Y"] =
                Math.min(this.e_player.currentCoordinates[1], this.p_player.currentCoordinates[1], this.gameData["min_Y"]);
            this.gameData["max_Y"] =
                Math.max(this.e_player.currentCoordinates[1], this.p_player.currentCoordinates[1], this.gameData["max_Y"]);

            this.gameData["endTime"] = (i + 1) / 100;


            if (this.checkIsSolved()) {
                this.gameData["pursuiterCoordinates"].push({
                    "x": this.p_player.currentCoordinates[0],
                    "y": this.p_player.currentCoordinates[1]
                });

                this.gameData["escaperCoordinates"].push({
                    "x": this.e_player.currentCoordinates[0],
                    "y": this.e_player.currentCoordinates[1]
                });

                this.dataToDrawGraphics["Pursuiter"].push({
                    "x": this.p_player.currentCoordinates[0],
                    "y": this.p_player.currentCoordinates[1]
                });

                this.dataToDrawGraphics["Escaper"].push({
                    "x": this.e_player.currentCoordinates[0],
                    "y": this.e_player.currentCoordinates[1]
                });

                this.gameData["alphaAngles"].push((radToDeg(findCorrectAngle(this.p_player.speedVector)) -
                    radToDeg(findCorrectAngle(this.l_vector))));

                this.gameData["distance"].push(modOfVector(this.l_vector));

                break;
            }
        }
    }

    makeNextStep() {
        this.e_player.calculateNextPoint(this.p_player.currentCoordinates, this.p_player.speedVector, this.p_player.radius);
        this.p_player.calculateNextPoint(this.e_player.currentCoordinates);

        this.e_player.moveToWantedPoint(this.stepSize);
        this.p_player.moveToWantedPoint(this.stepSize);
        this.l_vector = [this.e_player.currentCoordinates[0] - this.p_player.currentCoordinates[0],
        this.e_player.currentCoordinates[1] - this.p_player.currentCoordinates[1]
        ];
    }

    updateData(e) {
        var value_id = e.id;
        var value = e.value * 1;

        if (e.type == 'checkbox') value = e.checked;

        switch (value_id) {
            case "Xp":
                this.p_player.startCoordinates[0] = value;
                break;
            case "Yp":
                this.p_player.startCoordinates[1] = value;
                break;
            case "pursuiterVectorLength":
                var currentDir = radToDeg(findCorrectAngle(this.p_player.startSpeedVector));
                this.p_player.startSpeedVector = createVector(currentDir, value);
                return;
            case "pursuiterRadius":
                this.p_player.radius = value;
                this.p_player.maxAngle = modOfVector(this.p_player.startSpeedVector) / value;
                break;
            case "pursuiterVectorDirection":
                this.p_player.startSpeedVector = createVector(value, modOfVector(this.p_player.startSpeedVector));
                break;
            case "Xe":
                this.e_player.startCoordinates[0] = value;
                break;
            case "Ye":
                this.e_player.startCoordinates[1] = value;
                return;
            case "escaperVectorLength":
                var currentDir = radToDeg(findCorrectAngle(this.e_player.startSpeedVector));
                this.e_player.startSpeedVector = createVector(currentDir, value);
                break;
            case "escaperVectorDirection":
                this.e_player.startSpeedVector = createVector(value, modOfVector(this.e_player.startSpeedVector));
                break;
            case "escaperRadius":
                this.e_player.radius = value;
                this.e_player.maxAngle = modOfVector(this.e_player.startSpeedVector) / value;
                break;
            case "h":
                this.stepSize = value;
                break;
            case "accuracy":
                this.accuracy = value;
                break;
            case "time":
                this.time = value;
                break;
            case "IsEscaperInerted":
                this.e_player.radius = document.getElementById("escaperRadius").value * value;
                this.e_player.maxAngle = modOfVector(this.e_player.startSpeedVector) / this.e_player.radius * value;
                break;
            case "manualPDirection":
                var pDir;
                if (value) {
                    pDir = document.getElementById("pursuiterVectorDirection").value * 1;
                    this.p_player.startSpeedVector = createVector(pDir, modOfVector(this.p_player.startSpeedVector));
                }
                else {
                    var lVector = [];
                    lVector[0] = this.e_player.startCoordinates[0] - this.p_player.startCoordinates[0];
                    lVector[1] = this.e_player.startCoordinates[1] - this.p_player.startCoordinates[1];

                    pDir = radToDeg(findCorrectAngle(lVector));

                    this.p_player.startSpeedVector = createVector(pDir, modOfVector(this.p_player.startSpeedVector));
                }
                break;
        }
    }
}