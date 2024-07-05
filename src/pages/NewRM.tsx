import { useState, useEffect, SyntheticEvent } from "react";
import { addNewRM, getAllRMs } from "../services/service";
import { Stack, FormControl, Button, TextField, Autocomplete } from "@mui/material";
import Loading from "../components/Loading";
import SuccessSnackbar from "../components/Snackbar";

const NewRM = () => {
  const [allMovements, setAllMovements] = useState<Record<string, { kgs: string; date: string; }[]>>()
  const [selectedMovement, setSelectedMovement] = useState<{name: string, rm: string, date: string}>()
  const [selectedNewMovement, setSelectedNewMovement] = useState<string>()
  const [weight, setWeight]=useState<string>('');
  const [addNew, setAddNew]=useState<boolean>(false);
  const [loading, setLoading]=useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar]=useState<boolean>(false);

  const handleAddWeight = async() => {
    setLoading(true)
    if(addNew && selectedNewMovement){
      await addNewRM({kgs: weight, movement: selectedNewMovement})
      setOpenSnackBar(true)
      setSelectedNewMovement(undefined)
    } else if (weight && selectedMovement){
      await addNewRM({kgs: weight, movement: selectedMovement.name})
      setOpenSnackBar(true)
      setSelectedMovement(undefined)
    }
    setAddNew(false)
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
    if(allMovements && value){
      const movementInfo = allMovements[value]
      setSelectedMovement({
        name: value,
        rm: movementInfo[movementInfo.length-1].kgs,
        date: movementInfo[movementInfo.length-1].date,
      });
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
        {
          addNew ? (
              <TextField id="new-rm" type="number" label="Enter new RM" variant="outlined" value={weight} onChange={(w)=>setSelectedNewMovement(w.currentTarget.value)} color="secondary" />
          ) : (
            <FormControl fullWidth>
            <Autocomplete
              id="new-rm-autocomplete"
              options={allMovements ? Object.keys(allMovements) : []}
              value={selectedMovement?.name ?? null}
              renderInput={(params) => <TextField {...params} label="New RM" />}
              onChange={handleAutocomplete}
            />
          </FormControl>
          )
        }
        <Button onClick={()=> setAddNew(!addNew)} style={{justifyContent: 'right'}}>{addNew ? 'Add existing' : 'Add New?'}</Button>

        {
          selectedMovement && (
            <div style={{textAlign:'right'}}>Current {selectedMovement.name} RM: <span style={{fontWeight:'bold'}}>{selectedMovement.rm}kgs</span> <br/>({selectedMovement.date})</div>
          )
        }
      </Stack>
      <Stack direction={'column'} spacing={2}>
        <TextField id="new-rm-kgs" type="number" label="Enter new weight (kgs)" variant="outlined" value={weight} onChange={(w)=>setWeight(w.currentTarget.value)} color="secondary" />
        <Button onClick={handleAddWeight} variant="contained">Submit</Button>
      </Stack>
      <SuccessSnackbar open={openSnackBar} handleClose={() => setOpenSnackBar(false)}/>
    </Stack>
  )
}

export default NewRM