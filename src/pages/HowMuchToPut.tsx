import { useEffect, useState } from "react"
import { getAllRMs } from "../services/service"
import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, styled } from "@mui/material"
import { kgsToPounds } from "../utils";
import { AllRMs, SelectedMovementRM } from "../services/firebase-types";
import Loading from "../components/Loading";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const HeaderItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: 'white',
}));
type PercentageData = {percentageData: {percentage: number, lbsBySide: string, kgsBySide: string}}

const PercentageRow = ({percentageData}: PercentageData) =>{
  return(
  <>
    <Grid item xs={3}>
      <Item>{percentageData.percentage}%</Item>
    </Grid>
    <Grid item xs={5}>
      <Item>{percentageData.lbsBySide} lbs</Item>
    </Grid>
    <Grid item xs={4}>
      <Item>{percentageData.kgsBySide} kgs</Item>
    </Grid>
  </>
  )
}

const HowMuchToPut = () => {
  const [allMovements, setAllMovements] = useState<AllRMs>()
  const [selectedMovement, setSelectedMovement] = useState<SelectedMovementRM>()
  const [barbell, setBarbell] = useState(15);

  useEffect(() => {
    async function fetch() {
      const response = await getAllRMs()
      setAllMovements(response)
    }
    fetch()
  }, [])

  const getPercentages = () =>{
    let max = 100
    const weight = parseFloat(selectedMovement?.kgs || '')
    const weightInPounds = kgsToPounds(weight);
    const barbelInPounds = kgsToPounds(barbell)
    const acc: {percentage: number, lbsBySide: string, kgsBySide: string}[] = []
    while (max >=45) {
      const percentagePounds = (weightInPounds/100)*max
      const percentageKgs = (weight/100)*max
      acc.push({percentage: max, lbsBySide: ((percentagePounds-barbelInPounds)/2).toFixed(2), kgsBySide: ((percentageKgs-barbell)/2).toFixed(2) })
      max -= 5
    }
    return acc
  }

  if(!allMovements){
    return <Loading/>
  }
  return (
    <Stack direction={'column'} spacing={2}>
      <Stack direction={'column'} spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="select-movement-input">Select movement</InputLabel>
          <Select
            labelId="select-movement-input"
            id="movement-select"
            value={selectedMovement?.name || ''}
            label="Select movement"
            onChange={(event: SelectChangeEvent) => {
              if(allMovements){
                const movementInfo = allMovements[event.target.value as string]
                setSelectedMovement({
                  name: event.target.value,
                  ...movementInfo[movementInfo.length-1]
                });
              }
            }}
          >
            {
              allMovements && Object.keys(allMovements).map((m, index)=><MenuItem key={index} value={m}>{m}</MenuItem>)
            }
          </Select>
        </FormControl>
        {
          selectedMovement && (
            <div>Current RM: <span style={{fontWeight:'bold'}}>{selectedMovement.kgs}kgs</span> ({selectedMovement.date})</div>
          )
        }
      </Stack>
      <div>And my barbell is:</div>
      <Stack direction={'row'} spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="metric-select-label">Metric</InputLabel>
          <Select
            labelId="metric-select-label"
            id="metric-select"
            value={barbell.toString()}
            label="Age"
            onChange={(event: SelectChangeEvent) => {
              setBarbell(parseInt(event.target.value));
            }}
          >
            <MenuItem value={15}>15kgs</MenuItem>
            <MenuItem value={20}>20kgs</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {
        selectedMovement && (
          <Grid container spacing={1}>
            <Grid container item spacing={1}>
              <Grid item xs={3}>
                <HeaderItem>%</HeaderItem>
              </Grid>
              <Grid item xs={5}>
                <HeaderItem>lbs per side</HeaderItem>
              </Grid>
              <Grid item xs={4}>
                <HeaderItem>kgs per side</HeaderItem>
              </Grid>
            </Grid>
            {
              getPercentages().map((p,index) => (
                <Grid container item spacing={1} key={index}>
                  <PercentageRow percentageData={p}/>
                </Grid>
              ))
            }
          </Grid>
        )
      }
    </Stack>
  )
}

export default HowMuchToPut