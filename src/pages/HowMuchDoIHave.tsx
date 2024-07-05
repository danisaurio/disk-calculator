import { Stack, TextField, Select, FormControl, InputLabel, MenuItem, SelectChangeEvent } from "@mui/material"
import { useState } from "react"
import { kgsToPounds, poundsToKgs } from "../utils";

const HowMuchDoIHave = () => {
  const [weight, setWeight] = useState('');
  const [barbell, setBarbell] = useState('15kgs');
  const [metric, setMetric] = useState('lbs');

  const getPlatesWeight = () =>{
    const weightNumber = parseFloat(weight)*2;
    const isPound = metric === 'lbs'

    return {
      kgs: isPound ? poundsToKgs(weightNumber): weightNumber,
      lbs: isPound ? weightNumber : kgsToPounds(weightNumber),
    }
  }

  const getBarbellWeight = () =>{
    if(barbell === '15kgs'){
      return {
        kgs:15,
        lbs:kgsToPounds(15)
      }
    }
    return {
      kgs:20,
      lbs:kgsToPounds(20)
    }
  }

  return (
  <Stack direction={'column'} spacing={2}>
    <div>On each side I have:</div>
    <Stack direction={'row'} spacing={2}>
      <TextField id="weight-input" type="number" label="Enter weight" variant="outlined" value={weight} onChange={(w)=>setWeight(w.currentTarget.value)} color="secondary" />
      <FormControl>
        <InputLabel id="metric-select-label">Metric</InputLabel>
        <Select
          labelId="metric-select-label"
          id="metric-select"
          value={metric}
          label="Age"
          onChange={(event: SelectChangeEvent) => {
            setMetric(event.target.value as string);
          }}
        >
          <MenuItem value={'kgs'}>kgs</MenuItem>
          <MenuItem value={'lbs'}>lbs</MenuItem>
        </Select>
      </FormControl>
    </Stack>
    <div>And my barbell is:</div>
    <Stack direction={'row'} spacing={2}>
      <FormControl fullWidth>
        <InputLabel id="barbell-select-label">Metric</InputLabel>
        <Select
          labelId="barbell-select-label"
          id="barbell-select"
          value={barbell}
          onChange={(event: SelectChangeEvent) => {
            setBarbell(event.target.value as string);
          }}
        >
          <MenuItem value={'15kgs'}>15kgs</MenuItem>
          <MenuItem value={'20kgs'}>20kgs</MenuItem>
        </Select>
      </FormControl>
    </Stack>
    {
      weight !== '' && (
        <Stack direction={'column'} spacing={2}>
          <div>I'm lifting:</div>
          <Stack>
            <div>{(getPlatesWeight().kgs + getBarbellWeight().kgs).toFixed(2)} kgs</div>
            <div>{(getPlatesWeight().lbs + getBarbellWeight().lbs).toFixed(2)} Lbs</div>
          </Stack>
        </Stack>
      )
    }
  </Stack>
  )
}

export default HowMuchDoIHave