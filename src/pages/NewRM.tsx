import { useState, useEffect, SyntheticEvent } from "react";
import { addNewRM, getAllRMs } from "../services/service";
import { Stack, FormControl, Button, TextField, Autocomplete } from "@mui/material";
import Loading from "../components/Loading";
import SuccessSnackbar from "../components/Snackbar";

const NewRM = () => {
  const [allMovements, setAllMovements] = useState<Record<string, { kgs: string; date: string; }[]>>()
  const [selectedMovement, setSelectedMovement] = useState<string>()
  const [weight, setWeight]=useState<string>('');
  const [loading, setLoading]=useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar]=useState<boolean>(false);
console.log(selectedMovement)
  const handleAddWeight = async() => {
    setLoading(true)
    console.log(selectedMovement)
    if (weight && selectedMovement){
      // await addNewRM({kgs: weight, movement: selectedMovement})
      setOpenSnackBar(true)
    }
    setSelectedMovement(undefined)
    setWeight('')
    setLoading(false)
  }

  useEffect(() => {
    async function fetch() {
      const response = await getAllRMs()
      setAllMovements(response)
    }
    fetch()
  }, [])

  const handleAutocomplete = (_event: SyntheticEvent<Element, Event>, value: string | null) => {
    console.log({_event, value})
    if(value){
      setSelectedMovement(value);
    }
  }

  if(loading || !allMovements) {
    return (
      <Loading/>
    )
  }
  
  return (
    <Stack direction={'column'} spacing={2}>
      <Stack direction={'column'} spacing={2}>
        <FormControl fullWidth>
          <Autocomplete
            id="new-rm-autocomplete"
            options={allMovements ? Object.keys(allMovements) : []}
            value={selectedMovement ?? null}
            renderInput={(params) => <TextField {...params} label="New RM" />}
            onChange={handleAutocomplete}
            autoSelect
            freeSolo
          />
        </FormControl>

        {
          selectedMovement && allMovements[selectedMovement] && (
            <div style={{textAlign:'right'}}>Current {selectedMovement} RM: <span style={{fontWeight:'bold'}}>{allMovements[selectedMovement][allMovements[selectedMovement].length-1].kgs}kgs</span> <br/>({allMovements[selectedMovement][allMovements[selectedMovement].length-1].date})</div>
          )
        }
      </Stack>
      <Stack direction={'column'} spacing={2}>
        <TextField id="new-rm-kgs" type="number" label="Enter new weight (kgs)" variant="outlined" value={weight} onChange={(w)=>setWeight(w.currentTarget.value)} color="secondary" />
        <Button onClick={handleAddWeight} disabled={loading || weight === '' ||  !selectedMovement} variant="contained">Submit</Button>
      </Stack>
      <SuccessSnackbar open={openSnackBar} handleClose={() => setOpenSnackBar(false)}/>
    </Stack>
  )
}

export default NewRM