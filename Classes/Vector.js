class Vector {
  constructor(options) {
    if (options === undefined) {
      this.coordinates = [0,0]
      this.length = 0
      this.direction = 0
      return
    } else if (options.coordinates !== undefined) {
      this.coordinates = options.coordinates
      this.length = this.getLengthOfVector()
      this.direction = this.getDirectionOfVector()
    } else {
      this.length = options.length !== undefined ? options.length : 0
      this.direction = options.direction !== undefined ? options.direction : 0
      this.coordinates = this.getCoordinatesOfVector()
    }
  }

  getCoordinatesOfVector() {
    this.direction = utils.mathUtils.getCorrectAngle(this.direction)
    
    if (this.direction <= 90) { //первая четверть
      return [Math.sin(utils.mathUtils.degToRad(90 - this.direction)) * this.length, Math.sin(utils.mathUtils.degToRad(this.direction)) * this.length]
    } else if (this.direction > 90 && this.direction <= 180) {//вторая четверть
      return [Math.sin(utils.mathUtils.degToRad(-90 - this.direction)) * this.length * (-1), Math.sin(utils.mathUtils.degToRad((180 - this.direction))) * this.length]
    } else if (this.direction > 180 && this.direction <= 270) {//третья четверть
      return [Math.sin(utils.mathUtils.degToRad(-90 - this.direction)) * this.length * (-1), Math.sin(utils.mathUtils.degToRad((this.direction - 180))) * this.length * (-1)]
    } else if (this.direction > 270) {//четвертая четверть
      return [Math.sin(utils.mathUtils.degToRad(90 - this.direction)) * this.length, Math.sin(utils.mathUtils.degToRad((360 - this.direction))) * this.length * (-1)]
    } else {
      return [0, 0]
    }
  }

  getLengthOfVector() {
    return Math.sqrt(Math.pow(this.coordinates[0], 2) + Math.pow(this.coordinates[1], 2))
  }

  // угол в градусах
  getDirectionOfVector() {
    if (this.coordinates[0] > 0 && this.coordinates[1] > 0) { //первая четверть
      return utils.mathUtils.radToDeg(Math.asin(Math.abs(this.coordinates[1]) / this.length))
    } else if (this.coordinates[0] < 0 && this.coordinates[1] > 0) { //вторая четверть
      return utils.mathUtils.radToDeg(Math.PI - Math.sin(Math.abs(this.coordinates[1]) / this.length))
    } else if (this.coordinates[0] < 0 && this.coordinates[1] < 0) { //третья четверть
      return utils.mathUtils.radToDeg(Math.PI + Math.sin(Math.abs(this.coordinates[1]) / this.length))
    } else if (this.coordinates[0] > 0 && this.coordinates[1] < 0) { //четвёртая четверть
      return utils.mathUtils.radToDeg(2 * Math.PI - Math.sin(Math.abs(this.coordinates[1]) / this.length))
    } else if (this.coordinates[0] == 0 && this.coordinates[1] > 0) { // вверх
      return utils.mathUtils.radToDeg(Math.PI / 2)
    } else if (this.coordinates[0] == 0 && this.coordinates[1] < 0) { // вниз
      return utils.mathUtils.radToDeg(Math.PI * 3 / 2)
    } else if (this.coordinates[0] > 0 && this.coordinates[1] == 0) { // вправо
      return 0
    } else if (this.coordinates[0] < 0 && this.coordinates[1] == 0) { // влево
      return utils.mathUtils.radToDeg(Math.PI)
    } else {
      return 0
    }
  }

  //поворот вектора, угол в градусах
  turnVector(angle) {
    let radAngle = utils.mathUtils.degToRad(utils.mathUtils.getCorrectAngle(angle))
    this.coordinates = [
      (+(this.coordinates[0]) * +(Math.cos(radAngle)) + +(this.coordinates[1]) * +(Math.sin(radAngle)).toFixed(6)), 
      (+(this.coordinates[1]) * +(Math.cos(radAngle)) - +(this.coordinates[0]) * +(Math.sin(radAngle)).toFixed(6))
    ]
    this.direction = this.getDirectionOfVector()
  }
}