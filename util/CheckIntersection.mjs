/**
 * Tests polylines for self-intersections and for intersections between polylines. 
 * @param polys Polyline(s) that have been combined. (Otherwise, they will fail this test.)
 * @returns The result of the test, and the location of intersections if any were found.
 */
export function CheckIntersection(polys) {

  // Randomly reverse some polylines to test robustness
  for (let i = 0; i < polys.polylines.length; i++) {
    if (Math.random() < 0.5) {
      polys.polylines[i].vertices.reverse()
    }
  }

  const intersections = []

  
  for (let i = 0; i < polys.polylines.length; i++) {
    const pi = polys.polylines[i]
    for (let j = 0; j <= i; j++) {
      const pj = polys.polylines[j]
      for (let k = 0; k < pi.vertices.length-1; k++) {
        // Since the contours _should_ wrap around to the beginning, we don't add lines between finish (n-1) and start (0), so no need to check those line segments.
        const pix0 = pi.vertices[k][0]
        const pix1 = pi.vertices[k + 1][0]
        const piy0 = pi.vertices[k][1]
        const piy1 = pi.vertices[k + 1][1]
        for (let l = 0; l < pj.vertices.length-1; l++) {
          if (i === j && l >= k) {
            // If this is the same poly (i === j) this prevents double-checking same pair of segments
            // console.log(`break: Checking poly ${i} segment ${k} and poly ${j} segment ${l}`)
            break
          }
          const pjx0 = pj.vertices[l][0]
          const pjx1 = pj.vertices[l + 1][0]
          const pjy0 = pj.vertices[l][1]
          const pjy1 = pj.vertices[l + 1][1]

          // Check for intersection between the line segments defined by (pix0, piy0) -> (pix1, piy1) and (pjx0, pjy0) -> (pjx1, pjy1)

          // If we're in the same poly (i === j), then don't test adjacent segments (they always intersect end-to-end)
          if (i === j && (k === l + 1 || l === k + 1) {
            // These segments are supposed to intersect
            // console.log(`continue: Checking poly ${i} segment ${k} and poly ${j} segment ${l}`)
            continue
          }

          let isect = _intersect(pix0, piy0, pix1, piy1, pjx0, pjy0, pjx1, pjy1)
          if (isect) {
            console.log(`Possible intersection: poly ${i} segment ${k} and poly ${j} segment ${l}. (${pix0}, ${piy0}) --> (${pix1}, ${piy1}) and (${pjx0}, ${pjy0}) --> (${pjx1}, ${pjy1})`, )
            // TODO: Robust check for intersection
            intersections.push(isect)
          }
        }
      }
      console.log(i, j)
    }
  }

  if(intersections.length > 0) {
    return { result: "failed", intersections }
  }
  else {
    return { result: "passed" }
  }
}

function _intersect(pix0, piy0, pix1, piy1, pjx0, pjy0, pjx1, pjy1) {
  // First check bounding box
  if (Math.min(pix0, pix1) > Math.max(pjx0, pjx1) || Math.min(pjx0, pjx1) > Math.max(pix0, pix1)) {
    return
  }
  if (Math.min(piy0, piy1) > Math.max(pjy0, pjy1) || Math.min(pjy0, pjy1) > Math.max(piy0, piy1)) {
    return
  }
  return true
  console.log("These points might intersect: ", pix0, piy0, pix1, piy1, pjx0, pjy0, pjx1, pjy1)
}