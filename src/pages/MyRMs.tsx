import { useState, useEffect } from "react";
import { getAllRMs } from "../services/service";
import { CircularProgress, Grid, Stack } from "@mui/material";

const MovementRow = ({name, rms}: {name: string, rms: { kgs: string; date: string; }[]}) => {
  return(
    <details>
    <summary>{name.toUpperCase()}</summary>
    {
      rms.map(({kgs, date}, index) => (
        <Grid container key={index}>
          <Grid item xs={6}>
            {date}
          </Grid>
          <Grid item xs={6} style={{fontWeight: index === rms.length-1 ? 'bold': 'normal'}}>
            {kgs}kgs
          </Grid>
        </Grid>
      ))
    }

    </details>
  )

}

const MyRMs = () => {
  const [allMovements, setAllMovements] = useState<Record<string, { kgs: string; date: string; }[]>>()
  useEffect(() => {
    async function fetch() {
      const response = await getAllRMs()
      setAllMovements(response)
    }
    fetch()
  }, [])

  if(!allMovements){
    return <CircularProgress/>
  }

  return (
    <Stack direction={'column'} spacing={2}>
      {
        Object.entries(allMovements).map(([name, rms], index) => (
          <MovementRow key={index} name={name} rms={rms}/>
        ))
      }
    </Stack>
  )
}

export default MyRMs