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
  import {sortData} from "./util"
import './App.css';
import "leaflet/dist/leaflet.css"

function App() {

  const [countries ,setCountries] = useState([])
  const [country , setCountry] =  useState("Worldwide")
  const [countryInfo , setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:34.80764, lng: -40.4796})
  const [mapZoom,setMapZoom] = useState(3)
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
     <h1>Covid19 Tracker</h1>
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
      <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
      <InfoBox title="Recorved" cases={countryInfo.recovered} total={countryInfo.recovered} />
      <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total ={countryInfo.deaths} />
     </div>
     <Map center={mapCenter} zoom={mapZoom} />
    </div>  
    <Card className="app_right">
      <CardContent>
      <h3>Live cases by Countries</h3>
        <Table countries={tableData} />
        <h3>Worldwide new cases</h3>
        <LineGraph />
      </CardContent>
      {/*table*/}
       {/*Graph*/}    
    </Card>
     </div>
  );
}

export default App;
