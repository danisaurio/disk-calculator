import { Stack, FormControl, Button, Autocomplete, TextField } from "@mui/material"
import SuccessSnackbar from "./Snackbar"
import { useState, useEffect, SyntheticEvent, useMemo } from "react"
import { addNewRM, createNewRMDoc, getAllRMs } from "../services/service"
import Loading from "./Loading"

const PRPercentageCalculator = ({weight}:{weight:string}) => {
  const [allMovements, setAllMovements] = useState<Record<string, { kgs: string; date: string; }[]>>()
  const [selectedMovement, setSelectedMovement] = useState<string>()
  const [loading, setLoading]=useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar]=useState<boolean>(false);

  const handleAddWeight = async() => {
    setLoading(true)
    if (weight && selectedMovement){
      if(allMovements && allMovements[selectedMovement]){
        await addNewRM({kgs: weight, movement: selectedMovement})
      } else  {
        await createNewRMDoc({kgs: weight, movement: selectedMovement})
      }
      setOpenSnackBar(true)
    }
    setSelectedMovement(undefined)
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
    if(value){
      setSelectedMovement(value);
    }
  }

  const calculatePercentage = useMemo(()=>{
    if(allMovements && selectedMovement){
      if(allMovements[selectedMovement]){
        return ((parseFloat(weight)*100)/parseFloat(allMovements[selectedMovement][allMovements[selectedMovement].length-1].kgs))
      }
      return 100
    }
    return 0
  },[allMovements, selectedMovement, weight])

  if(loading || !allMovements) {
    return (
      <Loading/>
    )
  }
  if(!weight){
    return
  }
  return (
    <>
      <Stack direction={'column'} spacing={2}>
        <FormControl fullWidth>
          <Autocomplete
            id="select movement-autocomplete"
            options={allMovements ? Object.keys(allMovements) : []}
            value={selectedMovement ?? null}
            renderInput={(params) => <TextField {...params} label="Movement" />}
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
        {
          selectedMovement && !allMovements[selectedMovement] && (
            <div>That's a new movement!</div>
          )
        }
        {
          selectedMovement && (
            <div>That is <span style={{fontWeight: 'bold'}}>{calculatePercentage.toFixed(2)}%</span> from your current RM</div>
          )
        }
        {
          calculatePercentage > 100 && (
            <>
              <div style={{fontWeight: 'bold'}}>That's a new RM!</div>
              <Button onClick={handleAddWeight} disabled={loading || !selectedMovement} variant="contained">Add?</Button>
            </>
          )
        }
      </Stack>
      <SuccessSnackbar open={openSnackBar} handleClose={() => setOpenSnackBar(false)}/>
    </>
  )
}

export default PRPercentageCalculator;