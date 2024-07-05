import { useState, useEffect, SyntheticEvent } from "react";
import { addNewRM, getAllRMs } from "../services/service";
import { Stack, FormControl, Button, TextField, Autocomplete } from "@mui/material";

const NewRM = () => {
  const [allMovements, setAllMovements] = useState<Record<string, { kgs: string; date: string; }[]>>()
  const [selectedMovement, setSelectedMovement] = useState<{name: string, rm: string, date: string}>()
  const [weight, setWeight]=useState<string>('');
  const [addNew, setAddNew]=useState<boolean>(false);
  const [selectedNewMovement, setSelectedNewMovement] = useState<string>()

  const handleAddWeight = async() => {
    if(addNew && selectedNewMovement){
      await addNewRM({kgs: weight, movement: selectedNewMovement})
    } else if (weight && selectedMovement){
      await addNewRM({kgs: weight, movement: selectedMovement.name})
    }
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
  return (
    <Stack direction={'column'} spacing={2}>
    <Stack direction={'column'} spacing={2}>
      {
        addNew ? (
            <TextField id="outlined-basic" type="number" label="Enter new weight" variant="outlined" value={weight} onChange={(w)=>setSelectedNewMovement(w.currentTarget.value)} color="secondary" />
        ) : (
          <FormControl fullWidth>
          <Autocomplete
            id="demo-simple-select"
            options={allMovements ? Object.keys(allMovements) : []}
            value={selectedMovement?.name ?? null}
            renderInput={(params) => <TextField {...params} label="New RM" />}
            onChange={handleAutocomplete}
          />
        </FormControl>
        )
      }
      <Button onClick={()=> setAddNew(!addNew)}>{addNew ? 'Add existing' : 'Add New?'}</Button>

      {
        selectedMovement && (
          <div>Current RM: {selectedMovement.rm}kgs ({selectedMovement.date})</div>
        )
      }
    </Stack>
    <Stack direction={'column'} spacing={2}>
      <TextField id="outlined-basic" type="number" label="Enter new weight" variant="outlined" value={weight} onChange={(w)=>setWeight(w.currentTarget.value)} color="secondary" />
      <Button onClick={handleAddWeight}>Submit</Button>
    </Stack>
    </Stack>
  )
}

export default NewRM