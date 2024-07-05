import { Button, Stack, TextField } from "@mui/material"
import { useEffect, useState } from 'react';
import { updateWeight, getWeight } from "../services/service";
import SuccessSnackbar from "../components/Snackbar";
import Loading from "../components/Loading";
import { WeightWithDateString } from "../services/firebase-types";

const MyWeight = () => {
  const [weight, setWeight]=useState<string>('');
  const [oldWeight, setOldWeight]=useState<WeightWithDateString>();
  const [loading, setLoading]=useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar]=useState<boolean>(false);

  const handleAddWeight = async() => {
    setLoading(true)
    if(weight){
      await updateWeight({kgs: weight})
      setOpenSnackBar(true)
      setWeight('')
      setOldWeight({
        weight,
        date: 'Now'
      })
    }
    setLoading(false)
  }
  useEffect(()=>{
    getWeight().then(a=> setOldWeight(a))
  }, [])
  if(!oldWeight || loading) {
    return (
      <Loading/>
    )
  }
  return (
    <Stack direction={'column'} spacing={2}>
      <div>Current Weight: <span style={{fontWeight: 'bold'}}>{oldWeight?.weight} kgs</span> ({oldWeight?.date})</div>
      <TextField id="outlined-basic" type="number" label="Enter new weight" variant="outlined" value={weight} onChange={(w)=>setWeight(w.currentTarget.value)} color="secondary" />
      <Button onClick={handleAddWeight} variant={'contained'} disabled={loading || weight===''}>Submit</Button>
      <SuccessSnackbar open={openSnackBar} handleClose={() => setOpenSnackBar(false)}/>
    </Stack>
  )
}

export default MyWeight