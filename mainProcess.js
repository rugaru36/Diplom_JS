var GameObject

window.onload=function(){
    GameObject = new Game(
        document.getElementById("h").value, 
        document.getElementById("accuracy").value, 
        document.getElementById('time').value)
}

//основная функция
function startSolutionProcess() {
    GameObject.startGameProcess()
    console.log(GameObject.gameData)
    outputData(
      GameObject.dataToDrawGraphics["Escaper"], 
      GameObject.dataToDrawGraphics["Pursuiter"],
      GameObject.gameData, 
      GameObject.gameData["endTime"] * 1000
    )
}

//корректность данных
function checkIfDataCorrect() {
    let step_is_more_than_accuracy = +document.getElementById('accuracy').value < +document.getElementById('h').value
    let P_not_faster_than_E = +document.getElementById('pursuiterVectorLength').value <= +document.getElementById('escaperVectorLength').value
    let P_Rad_is_not_more_than_E_Rad =
        (+document.getElementById('escaperRadius').value >= +document.getElementById('pursuiterRadius').value) &&
        document.getElementById("IsEscaperInerted").checked
    if (step_is_more_than_accuracy) {
        alert('Шаг должен быть меньше, чем точность!')
        return
    } else if (P_not_faster_than_E) {
        alert("Скорость преследующего должна быть выше скорости преследуемого")
        return
    } else if (P_Rad_is_not_more_than_E_Rad) {
        alert("Радиус поворота убегающего должен быть меньше радиуса поворота преследователя")
        return
    }
    //всё верно, начинаем решение
    startSolutionProcess()
}


//вывод графиков и результатов
function outputData(EscaperCoordinates, PursuiterCoordinates, controlData, time) {
  document.getElementById('result').innerHTML = ""
  document.getElementById('result').style = ""
  document.getElementById("graphics").innerHTML = ""

  if (document.getElementById('testModCheck').checked) {
      var durationOfAnimation = 0
      var timeToWait = 0
  } else {
      var durationOfAnimation = time / document.getElementById('speed').value
      var timeToWait = durationOfAnimation + 500
  }

  document.getElementById('goButton').disabled = true

  /*Округление*/
  let min_Y = Math.floor(controlData["min_Y"])
  let min_X = Math.floor(controlData["min_X"])
  let max_X = Math.ceil(controlData["max_X"])
  let max_Y = Math.ceil(controlData["max_Y"])


  //чтобы все четверти были на графике
  min_Y = min_Y > -1 ? -1 : min_Y - 1
  min_X = min_X > -1 ? -1 : min_X - 1
  
  max_Y = max_Y < 1 ? 1 : max_Y + 1
  max_X = max_X < 1 ? 1 : max_X + 1

  let height = screen.height - 100, // svg height - высота контейнера SVG
      xTicks = max_X - min_X, // число зарубок на оси х
      yTicks = max_Y - min_Y, // число зарубок на оси у
      padding = 10, // svg padding - отступы от границ SVG
      x_max = max_X, // x data max - макс коор-та x модельная
      y_max = max_Y, // y data max - макс коор-та у модельная
      x_min = min_X, // мин коор-та x модельная
      y_min = min_Y // мин коор-та y модельная

  let width = xTicks * height / yTicks > screen.width * (3 / 4) ? screen.width * (3 / 4) : xTicks * height / yTicks

  console.log({width: width, 
    height: height, 
    "screen.width * (3 / 4)": screen.width * (3 / 4), 
    "xTicks * height / yTicks": xTicks * height / yTicks,
    xTicks: xTicks,
    yTicks: yTicks,
    controlData  
  })

  while (width > screen.width - 40) {
    height -= 10
    width = xTicks * height / yTicks
  }

  while (height / width > 5) {
      width *= 2
  }
  while (width / height > 5) {
      height *= 2
  }
  let radOfPoints = 5
  let fatness = 4
  if (Math.max(xTicks, yTicks) > 30 && Math.max(xTicks, yTicks) < 50) {
    fatness = 3
  } else if (Math.max(xTicks, yTicks) >= 50) {
    fatness = 2
  }

  console.log({width: width, height: height})

  var svg = d3
      /*/////////СЮДЫ НАЗВАНИЕ КОНТЕЙНЕРА!!!!!////////////*/
      .select("#graphics")
      .append("div")
      .attr("class", "main")
      .append("div")
      .attr("class", "sidebar")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

  var xScale = d3
      .scale
      .linear()
      .domain([x_min, x_max])
      .range([padding, width - padding])

  var yScale = d3
      .scale
      .linear()
      .domain([y_min, y_max])
      .range([height - padding, padding])

  var vis1 = svg.append("svg:g")

  var rules1 = vis1.selectAll("g.rule")
      .data(xScale.ticks(xTicks))
      .enter().append("svg:g")
      .attr("class", "rule")

  rules1.append("svg:line")
      .attr("x1", xScale)
      .attr("x2", xScale)
      .attr("y1", padding)
      .attr("y2", height - padding)

  var vis2 = svg.append("svg:g")

  var rules2 = vis2.selectAll("g.rule")
      .data(yScale.ticks(yTicks))
      .enter().append("svg:g")
      .attr("class", "rule")

  rules2.append("svg:line")
      .attr("y1", yScale)
      .attr("y2", yScale)
      .attr("x1", padding)
      .attr("x2", width - padding)

  var xAxis = d3
      .svg
      .axis()
      .ticks(xTicks)
      .scale(xScale)

  var yAxis = d3
      .svg
      .axis()
      .ticks(yTicks)
      .orient("left")
      .scale(yScale)

  svg
      .append("g")
      .attr("transform", "translate(" + (0) + "," + (padding + (height - 2 * padding) * (y_max - 0) / (y_max - y_min)) + ")")
      .attr("class", "xaxis")
      .call(xAxis)

  svg
      .append("g")
      .attr("transform", "translate(" + (padding + (width - 2 * padding) * (0 - x_min) / (x_max - x_min)) + "," + (0) + ")")
      .attr("class", "yaxis")
      .call(yAxis)

  var line = d3
      .svg
      .line()
      .x(function(d) {
          return xScale(d.x)
      })
      .y(function(d) {
          return yScale(d.y)
      })
      .interpolate("linear")


  var path1 = svg
      .append("path")
      .attr("d", line(PursuiterCoordinates))
      .attr("stroke", "orange")
      .attr("stroke-width", fatness)
      .attr("fill", "none")

  var totalLength1 = path1.node().getTotalLength()

  //преследователь
  path1
      .attr("stroke-dasharray", totalLength1 + " " + totalLength1)
      .attr("stroke-dashoffset", totalLength1)
      .transition()
      .duration(durationOfAnimation)
      .ease("linear")
      .attr("stroke-dashoffset", 0)

  var path = svg
      .append("path")
      .attr("d", line(EscaperCoordinates))
      .attr("stroke", "blue")
      .attr("stroke-width", fatness)
      .attr("fill", "none")

  var totalLength = path.node().getTotalLength()
  var dashLen = 10
  var ddLen = dashLen * 2
  var darray = dashLen

  while (ddLen < totalLength) {
    darray += "," + dashLen + "," + dashLen
    ddLen += dashLen * 2
  }

  //убегающий.
  //закомментирован код сплошной линии
  path
      /*.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset",totalLength)
      .transition()
      .duration(durationOfAnimation)
      .ease("linear")
      .attr("stroke-dashoffset", 0)*/
      .attr("stroke-dasharray", darray + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(durationOfAnimation)
      .ease("linear")
      .attr("stroke-dashoffset", 0)

  setTimeout(function() {

    document.getElementById('result').style.border = "2px solid black"
    document.getElementById('result').style.padding = "5px"

    if (controlData["whoWon"] == "P") {
      document.getElementById('result').innerHTML = "<h5>Убегающий пойман</h5>"
    } else if (controlData["whoWon"] == "E") {
      document.getElementById('result').innerHTML = "<h5>Убегающему удалось попасть в область, недоступную преследователю</h5>"
    } else if (controlData["whoWon"] == "N") {
      document.getElementById('result').innerHTML = "<h5>Время вышло</h5>"
    }
    document.getElementById('result').innerHTML += "Итоговое время: " + controlData["endTime"]
    document.getElementById('goButton').disabled = false

    var circles1 = svg
        .append("g")
        .selectAll("circle")
        .data(controlData['pursuiterCoordinates'])
        .enter()
        .append("circle")
        .on("mouseenter", show_P)
        .on("mouseleave", hide_P)

    circles1
        .attr("cx", function(d) {
            return xScale(d.x)
        })
        .attr("cy", function(d) {
            return yScale(d.y)
        })
        .attr("r", radOfPoints)
        .attr("fill", "red")

    var circles2 = svg
        .append("g")
        .selectAll("circle")
        .data(controlData['escaperCoordinates'])
        .enter()
        .append("circle")
        .on("mouseenter", show_E)
        .on("mouseleave", hide_E)

    circles2
        .attr("cx", function(d) {
            return xScale(d.x)
        })
        .attr("cy", function(d) {
            return yScale(d.y)
        })
        .attr("r", radOfPoints)
        .attr("fill", "purple")
  }, timeToWait)

  //когда мышь наводится на точку преследователя
  function show_P(d, i) {
      var infostring = "<br><br><br><h3>Преследователь</h3><br><h4>Точка номер: " + i + "</h4><br>" +
          "Координаты: <strong>(" + controlData['pursuiterCoordinates'][i]["x"].toFixed(3) +
          " " + controlData['pursuiterCoordinates'][i]["y"].toFixed(3) + ")</strong>" +
          "<br><br>Угол отклонения: <strong>" + controlData['alphaAngles'][i] + "</strong>" +
          "<br><br>Расстояние: <strong>" + controlData['distance'][i].toFixed(5) + "</strong>"
      d3.select(this).attr({
          r: radOfPoints * 2
      })
      document.getElementById('infoOfPoints').innerHTML = infostring
  }

  //когда мышь уходит с точки преследователя
  function hide_P(d, i) {
      d3.select(this).attr({
          r: radOfPoints
      })
      document.getElementById('infoOfPoints').innerHTML = ''
  }

  //когда мышь наводится на точку убегающего
  function show_E(d, i) {
      var infostring = "<br><br><br><h3>Убегающий</h3><br><h4>Точка номер: " + i + "</h4><br>" +
          "Координаты: <strong>(" + controlData['escaperCoordinates'][i]["x"].toFixed(3) +
          " " + controlData['escaperCoordinates'][i]["y"].toFixed(3) + ")</strong>" +
          "<br><br>Расстояние: <strong>" + controlData['distance'][i].toFixed(5) + "</strong>"
      document.getElementById('infoOfPoints').innerHTML = infostring
      d3.select(this).attr({
          r: radOfPoints * 2
      })
  }


  //когда мышь уходит с точки убегающего
  function hide_E(d, i) {
      d3.select(this).attr({
          r: radOfPoints
      })
      document.getElementById('infoOfPoints').innerHTML = ''
  }

  EscaperCoordinates = []
  PursuiterCoordinates = []

  window.location = '#graphics'
}
