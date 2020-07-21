import React ,{useState, useEffect} from "react"
import {Line} from "react-charjs-2"

const LineGraph= ()=>{
  const [data ,setData] = useState({}) 

  //https://disease.sh/v3/covid-19/historical/all?lastdays=120

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
    .then(response=>response.json())
    .then(data=>{
      console.log(data)
    })
  },[])
  return(
    <div>
    /*<Line
        data
        options
     />*/
    <h1>I am Graph</h1>
    </div>
  )
}

export default LineGraph
