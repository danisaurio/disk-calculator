import { Button, Stack, TextField } from "@mui/material"
import { useEffect, useState } from 'react';
import { updateWeight, getWeight } from "../services/service";

const MyWeight = () => {
  const [weight, setWeight]=useState<string>('');
  const [oldWeight, setOldWeight]=useState<{weight: string, date: string}>();
  const handleAddWeight = async() => {
    if(weight){
      await updateWeight({kgs: weight})
    }
  }
  useEffect(()=>{
    getWeight().then(a=> setOldWeight(a))
  }, [])
  return (
    <Stack direction={'column'} spacing={2}>
      <div>Current Weight: {oldWeight?.weight} kgs ({oldWeight?.date})</div>
      <TextField id="outlined-basic" type="number" label="Enter new weight" variant="outlined" value={weight} onChange={(w)=>setWeight(w.currentTarget.value)} color="secondary" />
      <Button onClick={handleAddWeight}>Submit</Button>
    </Stack>
  )
}

export default MyWeight