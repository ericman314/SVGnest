import { PolyNest } from './polynest.mjs'
import { CombinePolys } from './util/CombinePolys.mjs'
import { CheckIntersection } from './util/CheckIntersection.mjs'
import dxf from 'dxf'
import * as fs from 'fs'
import express from 'express'
import path from 'path';
const __dirname = path.resolve();


const app = express()

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/polytest.html')
})

app.get('/polytest', function (req, res) {

  fs.readFile('open-contours.dxf', (err, data) => {
    let polys = new dxf.Helper(data.toString()).toPolylines()
  
    let poly = CombinePolys(polys)

    // TODO: Check for open contours

    let result = CheckIntersection(poly)
  
    // s.addPoly(poly)

    res.json({ polys: polys, poly: poly })
  })

})

 
app.listen(3000)
