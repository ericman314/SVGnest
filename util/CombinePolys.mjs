// NOTE FOR FUTURE TESTING:
// I've tested this manually on a single contiguous part. I randomly reversed the direction of some of the polylines, and in about a dozen of those instances, this function correctly returned a single polyline. The function has not been tested on:
// Multiple contiguous polylines
// Intersecting polylines
// Polylines where more than 2 endpoints share the same point (special case of intersecting polylines)
// Other parts/shapes

/**
 * Joins several polylines into one contiguous polyline
 * @param polys Polylines returned from dxf.Helper().toPolylines()
 * @returns A clone of the supplied polylines, with contiguous polylines joined together.
 */
export function CombinePolys(polys) {

  // TODO: Make deep clone more efficiently than this
  let ret = JSON.parse(JSON.stringify(polys))

  // Randomly reverse some polylines to test robustness
  // for (var i=0; i<ret.polylines.length; i++) {
  //   if (Math.random() < 0.5) {
  //     ret.polylines[i].vertices.reverse()
  //   }
  // }

  // We assume nothing. We just examine the two endpoints of each polyline, and if the points are equal (or very, very close) we stitch them together.

  // Remove duplicate vertices (sometimes it can happen)
  for (var i = ret.polylines.length-1; i >= 0; i--) {
    const pi = ret.polylines[i]
    for (var j = pi.vertices.length - 1; j >= 1; j--) {
      let ei0 = pi.vertices[j]
      let ei1 = pi.vertices[j - 1]
      if (nearlyEqual(ei0[0], ei1[0]) && nearlyEqual(ei0[1], ei1[1])) {
        pi.vertices.splice(j, 1)
      }
    }
    
    // If number of vertices is less than 2, remove the polyline
    if (pi.vertices.length < 2) {
      ret.polylines.splice(i, 1)
    }
  }

  // Traverse arrays in reverse order, always removing index j (which is larger than i), so that for-loop can proceed normally even when removing items from the array
  for (var i = ret.polylines.length - 2; i >= 0; i--) {
    for (var j = ret.polylines.length - 1; j > i; j--) {
      let pi = ret.polylines[i]
      let pj = ret.polylines[j]
      let ei0 = pi.vertices[0]
      let ein = pi.vertices[pi.vertices.length - 1]
      let ej0 = pj.vertices[0]
      let ejn = pj.vertices[pj.vertices.length - 1]
      if (nearlyEqual(ein[0], ej0[0]) && nearlyEqual(ein[1], ej0[1])) {
        // Tail of i connects to head of j. Append j in order onto i, then remove j.
        pi.vertices.splice(pi.vertices.length, 0, ...pj.vertices.slice(1))
        ret.polylines.splice(j, 1)
      }
      else if (nearlyEqual(ejn[0], ei0[0]) && nearlyEqual(ejn[1], ei0[1])) {
        // Tail of j connects to head of i. Prepend j in order in front of i, then remove j.
        pi.vertices.splice(0, 1, ...pj.vertices)
        ret.polylines.splice(j, 1)
      }
      else if (nearlyEqual(ei0[0], ej0[0]) && nearlyEqual(ei0[1], ej0[1])) {
        // Head of i connects to head of j. Reverse j in place and prepend in front of i, then remove j.
        pi.vertices.splice(0, 0, ...pj.vertices.slice(1).reverse()) // Note: reverses in place
        ret.polylines.splice(j, 1)
      }
      else if (nearlyEqual(ein[0], ejn[0]) && nearlyEqual(ein[1], ejn[1])) {
        // Tail of i connects to tail of j. Reverse j in place and append to i, then remove j.
        pi.vertices.splice(pi.vertices.length, 0, ...pj.vertices.reverse().slice(1)) // Note: reverses in place
        ret.polylines.splice(j, 1)
      }
    }
  }

  return ret
}

function nearlyEqual(a, b) {
  console.log(a, b)
  return Math.abs(a - b) < 1e-4
}