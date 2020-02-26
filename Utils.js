class Utils {
  //переводы углов
  radToDeg(rad) {
    return (rad * 180) / Math.PI
  }
  degToRad(deg) {
    return (Math.PI * deg) / 180
  }
}

var utils = new Utils()