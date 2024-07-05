import { useState, useEffect } from "react";
import { getAllRMs, getWeight } from "../services/service";
import { Grid, Stack } from "@mui/material";
import Loading from "../components/Loading";
import { AllRMs, MovementRMWithDateString } from "../services/firebase-types";

const MovementRow = ({name, rms, myWeight}: {name: string, rms: MovementRMWithDateString[], myWeight: string}) => {
  return(
    <details>
    <summary>{name.toUpperCase()}</summary>
    {
      rms.map(({kgs, date}, index) => {
        const isLastRM = index === rms.length-1
        const PBW = ((parseFloat(kgs)*100)/parseFloat(myWeight)).toFixed(1)
        return (
          <Grid container key={index}>
            <Grid item xs={6}>
              {date}
            </Grid>
            <Grid item xs={3} style={{fontWeight: isLastRM ? 'bold': 'normal'}}>
              {kgs}kgs
            </Grid>
            {
              isLastRM && (
                <Grid item xs={3} style={{fontWeight: isLastRM ? 'bold': 'normal'}}>
                  {PBW}%
                </Grid>
              )
            }
          </Grid>
        )
      })
    }
    </details>
  )

}

const MyRMs = () => {
  const [allMovements, setAllMovements] = useState<AllRMs>()
  const [myWeight, setMyWeight] = useState<string>()
  useEffect(() => {
    async function fetch() {
      const response = await getAllRMs()
      setAllMovements(response)
      const w = await getWeight()
      setMyWeight(w.weight)
    }
    fetch()
  }, [])

  if(!allMovements || !myWeight) {
    return (
      <Loading/>
    )
  }

  return (
    <Stack direction={'column'} spacing={2}>
      {
        Object.entries(allMovements).map(([name, rms], index) => (
          <MovementRow key={index} name={name} rms={rms} myWeight={myWeight}/>
        ))
      }
      <div style={{fontWeight:'bold', textAlign:'right'}}>BW: {myWeight}kgs</div>
    </Stack>
  )
}

export default MyRMs