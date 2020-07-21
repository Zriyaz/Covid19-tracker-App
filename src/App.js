import React , {useState,useEffect} from 'react';
import {
  FormControl, 
  MenuItem,
  Select,
  Card,
  CardContent
  } from "@material-ui/core"

  import InfoBox from "./InfoBox"
  import Map from "./Map"
  import Table from "./Table"
  import LineGraph from "./LineGraph"
  import {sortData , prettyPrintState} from "./util"
  
import './App.css';
import "./Map"
import "leaflet/dist/leaflet.css"

function App() {

  const [countries ,setCountries] = useState([])
  const [country , setCountry] =  useState("Worldwide")
  const [countryInfo , setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:34.80764, lng: -40.4796})
  const [mapZoom,setMapZoom] = useState(3)
  const [mapCountries ,setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=> response.json())
    .then(data=>{
      setCountryInfo(data)
    })
  },[])

  useEffect(()=>{
    const getContriesData = async () =>{
     await fetch('https://disease.sh/v3/covid-19/countries')
     .then((response) => response.json())
     .then((data) => {
       const countries =  data.map((country) =>(
         {
           name:country.country,
           value : country.countryInfo.iso2,
         }
       ))
       const sortedData=sortData(data)
       setTableData(sortedData)
       setMapCountries(data)
       setCountries(countries)
     })
    }

    getContriesData()
  },[])
  const onCountryChange = async (e)=>{
    const countryCode = e.target.value
    setCountry(countryCode)

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response =>response.json())
    .then(data=>{
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)
    })
  }
  console.log(countryInfo)
  return (
    <div className="App">
     <div className="app_left">
      <div className="app_header">
     <h1>COVID-19 TRACKER</h1>
      <FormControl className="app_dropdown">
        <Select 
          onChange ={onCountryChange}
          variant="outlined" value={country}>
        <MenuItem value="Worldwide">Worldwide</MenuItem>
        {
          countries.map(country=>(
             <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
     </div>
     <div className="app_status">
      <InfoBox 
      isRed
      active={casesType ==="cases"}
       onClick={e=>setCasesType("cases")}
       title="Coronavirus Cases" 
       cases={prettyPrintState(countryInfo.todayCases)} 
       total={prettyPrintState(countryInfo.cases)} />

      <InfoBox 
        active={casesType==="recovered"}
        onClick={e=>setCasesType("recovered")}
        title="Recovered" 
        cases={prettyPrintState(countryInfo.recovered)} 
        total={prettyPrintState(countryInfo.recovered)} />

      <InfoBox 
        isRed 
        active={casesType ==="deaths"}
       onClick={e=>setCasesType("deaths")}
       title="Deaths" 
       cases={prettyPrintState(countryInfo.todayDeaths)} 
       total ={prettyPrintState(countryInfo.deaths)} />
     </div>
     <Map 
       casesType={casesType}
       center={mapCenter} 
       zoom={mapZoom} 
       countries={mapCountries} />
    </div>  
    <Card className="app_right">
      <CardContent>
      <h3 className="app_graphTitle">Live Cases by Countries</h3>
        <Table countries={tableData} />
        <h3>Worldwide new {casesType} </h3>
        <LineGraph className="app_graph" casesType={casesType} />
      </CardContent> 
    </Card>
     </div>
  );
}

export default App;
