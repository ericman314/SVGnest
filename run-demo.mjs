// import SvgNest from './svgnest.mjs'
import * as fs from 'fs'

// let s = new SvgNest()


// fs.readFile('demo.svg', (err, data) => {
//   s.parsesvg(data.toString())
//   console.log(s)
// })

import dxf from 'dxf'


fs.readFile('rope-bracket.dxf', (err, data) => {

  let x = new dxf.Helper(data.toString())

  let p = x.toPolylines()

  for(var i=0; i<p.polylines.length; i++) {
    let pl = p.polylines[i]
    for(var j=0; j<pl.vertices.length; j++) {

      console.log(pl.vertices[j][0], pl.vertices[j][1])
    }
  }
})