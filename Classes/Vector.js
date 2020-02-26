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
      // console.log("by length and directions")
      this.length = options.length !== undefined ? options.length : 0
      this.direction = options.direction !== undefined ? options.direction : 0
      this.coordinates = this.getCoordinatesOfVector()
    }
  }

  getCoordinatesOfVector() {
    //получим положительный угол, не больше 360
    while (Math.abs(this.direction) >= 360 || this.direction < 0) {
      if (this.direction < 0) {
        this.direction += 360
      } else {
        this.direction -= 360
      }
    }
    if (this.direction <= 90) { //первая четверть
      return [Math.sin(utils.degToRad(90 - this.direction)) * this.length, Math.sin(utils.degToRad(this.direction)) * this.length]
    } else if (this.direction > 90 && this.direction <= 180) {//вторая четверть
      return [Math.sin(utils.degToRad(-90 - this.direction)) * this.length * (-1), Math.sin(utils.degToRad((180 - this.direction))) * this.length]
    } else if (this.direction > 180 && this.direction <= 270) {//третья четверть
      return [Math.sin(utils.degToRad(-90 - this.direction)) * this.length * (-1), Math.sin(utils.degToRad((this.direction - 180))) * this.length * (-1)]
    } else if (this.direction > 270) {//четвертая четверть
      return [Math.sin(utils.degToRad(90 - this.direction)) * this.length, Math.sin(utils.degToRad((360 - this.direction))) * this.length * (-1)]
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
      return utils.radToDeg(Math.asin(Math.abs(this.coordinates[1]) / this.length))
    } else if (this.coordinates[0] < 0 && this.coordinates[1] > 0) { //вторая четверть
      return utils.radToDeg(Math.PI - Math.sin(Math.abs(this.coordinates[1]) / this.length))
    } else if (this.coordinates[0] < 0 && this.coordinates[1] < 0) { //третья четверть
      return utils.radToDeg(Math.PI + Math.sin(Math.abs(this.coordinates[1]) / this.length))
    } else if (this.coordinates[0] > 0 && this.coordinates[1] < 0) { //четвёртая четверть
      return utils.radToDeg(2 * Math.PI - Math.sin(Math.abs(this.coordinates[1]) / this.length))
    } else if (this.coordinates[0] == 0 && this.coordinates[1] > 0) { // вверх
      return utils.radToDeg(Math.PI / 2)
    } else if (this.coordinates[0] == 0 && this.coordinates[1] < 0) { // вниз
      return utils.radToDeg(Math.PI * 3 / 2)
    } else if (this.coordinates[0] > 0 && this.coordinates[1] == 0) { // вправо
      return 0
    } else if (this.coordinates[0] < 0 && this.coordinates[1] == 0) { // влево
      return utils.radToDeg(Math.PI)
    } else {
      return 0
    }
  }

  //поворот вектора, угол в градусах
  turnVector(angle) {
    console.log(this.coordinates)
    let radAngle = utils.degToRad(angle)
    this.coordinates = [
      (this.coordinates[0] * Math.cos(radAngle) + this.coordinates[1] * Math.sin(radAngle)).toFixed(6), 
      (this.coordinates[1] * Math.cos(radAngle) - this.coordinates[0] * Math.sin(radAngle)).toFixed(6)
    ]
    this.direction = this.getDirectionOfVector()
    console.log(this.coordinates)
  }
}