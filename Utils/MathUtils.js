class MathUtils {
  radToDeg(rad) {
    return (rad * 180) / Math.PI
  }
  degToRad(deg) {
    return (Math.PI * deg) / 180
  }
  getCorrectAngle(degAngle) {
    let resultAngle = degAngle
    while(resultAngle >= 180) {
      resultAngle -= 360
    }
    while(resultAngle <= -180) {
      resultAngle += 360
    }
    return resultAngle
  }
  getDistanceBetweenPoints(point1, point2) {
    return Math.sqrt(Math.pow((point2[0] - point1[0]),2) + Math.pow((point2[1] - point1[1]),2))
  }
}

var mathUtils = new MathUtils()