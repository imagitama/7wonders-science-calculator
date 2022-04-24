import React, { useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import cogIconUrl from '../../assets/images/cog.png'
import compassIconUrl from '../../assets/images/compass.png'
import tabletIconUrl from '../../assets/images/tablet.png'
import wildIconUrl from '../../assets/images/wildcard.png'
import cloneIconUrl from '../../assets/images/clone.png'
import {
  incrementNumberCogs,
  decrementNumberCogs,
  incrementNumberCompasses,
  decrementNumberCompasses,
  incrementNumberTablets,
  decrementNumberTablets,
  incrementNumberWilds,
  decrementNumberWilds,
  incrementNumberClones,
  decrementNumberClones,
  selectNumberCogs,
  selectNumberCompasses,
  selectNumberTablets,
  selectNumberWilds,
  selectNumberClones,
} from './counterSlice';

interface Result {
  outputs: string[],
  score: number
}

export const getResult = (outputs: string[], numberCogs: number, numberCompasses: number, numberTablets: number): Result => {
  let score = 0
  let numberUniqueSymbols = 999

  if (numberCogs < numberUniqueSymbols) {
    numberUniqueSymbols = numberCogs
  }

  if (numberCompasses < numberUniqueSymbols) {
    numberUniqueSymbols = numberCompasses
  }

  if (numberTablets < numberUniqueSymbols) {
    numberUniqueSymbols = numberTablets
  }

  score += numberUniqueSymbols * 7

  outputs = [...outputs, `unique: ${numberUniqueSymbols}*7`]

  score += numberCogs * numberCogs

  outputs = [...outputs, `cogs: ${numberCogs}*${numberCogs}`]

  score += numberCompasses * numberCompasses

  outputs = [...outputs, `compass: ${numberCompasses}*${numberCompasses}`]

  score += numberTablets * numberTablets
  
  outputs = [...outputs, `tablet: ${numberTablets}*${numberTablets}`]

  // @ts-ignore
  if (window.DEBUG) {
    console.log(score, outputs)
  }

  return {
    outputs,
    score
  }
}

export const getResultsWithClones = (numberCogs: number, numberCompasses: number, numberTablets: number, numberClones: number): Result[] => {
  let highestNumber = 0
  let winningNames: string[] = []
  let outputs: string[] = []

  if (numberClones === 0) {
    return [getResult(['no clones'], numberCogs, numberCompasses, numberTablets)]
  }

  outputs = [...outputs, `clones: ${numberClones}`]

  if (numberCogs > highestNumber) {
    highestNumber = numberCogs
    winningNames = ['cog']
  } else if (highestNumber > 0 && numberCogs === highestNumber) {
    winningNames.push('cog')
  }

  if (numberCompasses > highestNumber) {
    highestNumber = numberCompasses
    winningNames = ['compass']
  } else if (highestNumber > 0 && numberCompasses === highestNumber) {
    winningNames.push('compass')
  }

  if (numberTablets > highestNumber) {
    highestNumber = numberTablets
    winningNames = ['tablet']
  } else if (highestNumber > 0 && numberTablets === highestNumber) {
    winningNames.push('tablet')
  }

  if (winningNames.length > 1) {
    outputs = [...outputs, `tied: ${winningNames.join(', ')}`]
  }

  const scores = winningNames.map(name => {
    switch (name) {
      case 'cog':
        return getResult([...outputs, `clone: cog`], numberCogs + numberClones, numberCompasses, numberTablets)
      case 'compass':
        return getResult([...outputs, `clone: compass`], numberCogs, numberCompasses + numberClones, numberTablets)
      case 'tablet':
        return getResult([...outputs, `clone: tablet`], numberCogs, numberCompasses, numberTablets + numberClones)
      default:
        throw new Error('Bad')
    }
  })

  return scores
}

export const getAllResults = (numberCogs: number, numberCompasses: number, numberTablets: number, numberWilds: number, numberClones: number): Result[] => {
  let results: Result[] = []

  switch (numberWilds) {
    case 0:
      results = results.concat(getResultsWithClones(numberCogs, numberCompasses, numberTablets, numberClones))
      break

    case 1:
      results = results.concat(getResultsWithClones(numberCogs + 1, numberCompasses, numberTablets, numberClones))
      results = results.concat(getResultsWithClones(numberCogs, numberCompasses + 1, numberTablets, numberClones))
      results = results.concat(getResultsWithClones(numberCogs, numberCompasses, numberTablets + 1, numberClones))
      break

    case 2:
      results = results.concat(getResultsWithClones(numberCogs + 2, numberCompasses, numberTablets, numberClones))
      results = results.concat(getResultsWithClones(numberCogs, numberCompasses + 2, numberTablets, numberClones))
      results = results.concat(getResultsWithClones(numberCogs, numberCompasses, numberTablets + 2, numberClones))

      results = results.concat(getResultsWithClones(numberCogs + 1, numberCompasses + 1, numberTablets, numberClones))
      results = results.concat(getResultsWithClones(numberCogs, numberCompasses + 1, numberTablets + 1, numberClones))
      results = results.concat(getResultsWithClones(numberCogs + 1, numberCompasses, numberTablets + 1, numberClones))
      break

    case 3:
        results = results.concat(getResultsWithClones(numberCogs + 3, numberCompasses, numberTablets, numberClones))
        results = results.concat(getResultsWithClones(numberCogs, numberCompasses + 3, numberTablets, numberClones))
        results = results.concat(getResultsWithClones(numberCogs, numberCompasses, numberTablets + 3, numberClones))
        
        results = results.concat(getResultsWithClones(numberCogs + 1, numberCompasses + 1, numberTablets + 1, numberClones))
  
        results = results.concat(getResultsWithClones(numberCogs + 2, numberCompasses + 1, numberTablets, numberClones))
        results = results.concat(getResultsWithClones(numberCogs + 1, numberCompasses + 2, numberTablets, numberClones))

        results = results.concat(getResultsWithClones(numberCogs, numberCompasses + 1, numberTablets + 2, numberClones))
        results = results.concat(getResultsWithClones(numberCogs, numberCompasses + 2, numberTablets + 1, numberClones))

        results = results.concat(getResultsWithClones(numberCogs + 1, numberCompasses, numberTablets + 2, numberClones))
        results = results.concat(getResultsWithClones(numberCogs + 2, numberCompasses, numberTablets + 1, numberClones))
        break

      default:
        throw new Error(`More than 3 is unsupported :(`)
  }

  return results
}

const Field = ({ iconUrl, value, onPlus, onMinus }: { iconUrl: string, value: number, onPlus: () => void, onMinus: () => void }) => 
  <div>
    <img src={iconUrl} width={100} alt="Field" /> x{value}
    <IconButton onClick={onPlus} aria-label="plus" color="primary">
      <AddBoxIcon />
    </IconButton>
    <IconButton onClick={onMinus} aria-label="minus" color="primary">
      <IndeterminateCheckBoxIcon />
    </IconButton>
  </div>

const Score = ({ score }: { score: number }) =>       <div style={{ fontSize: '200%', fontWeight: 'bold' }}>
{score}
</div>

const ResultOutput = ({ outputs }: { outputs: string[] }) => <div>{outputs.join(', ')}</div>

const BestScore = () => {
  const numberCogs = useAppSelector(selectNumberCogs)
  const numberCompasses = useAppSelector(selectNumberCompasses)
  const numberTablets = useAppSelector(selectNumberTablets)
  const numberWilds = useAppSelector(selectNumberWilds)
  const numberClones = useAppSelector(selectNumberClones)
  const [showAllResults, setShowAllResults] = useState(false)

  const toggleAllResults = () => setShowAllResults(currentVal => !currentVal)

  const results = getAllResults(numberCogs, numberCompasses, numberTablets, numberWilds, numberClones)

  const bestResult = results.length ? results.reduce((bestResultSoFar, result) => 
    result.score > bestResultSoFar.score ? 
      result : bestResultSoFar
    , results[0]) : { outputs: [], score: 0 }

    
  const resultsSortedByScore = results.sort((resultA, resultB) => resultB.score - resultA.score)

  return (
    <div>
      <Score score={bestResult.score} />
      <ResultOutput outputs={bestResult.outputs} />
      <hr />
      <Button onClick={toggleAllResults}>Toggle All Results</Button>
      {showAllResults ? <table>{resultsSortedByScore.map(result => <tr><td><Score score={result.score} /></td><td><ResultOutput outputs={result.outputs} /></td></tr>)}</table>
       : null}
    </div>
  )
}

export function Counter() {
  const numberCogs = useAppSelector(selectNumberCogs)
  const numberCompasses = useAppSelector(selectNumberCompasses)
  const numberTablets = useAppSelector(selectNumberTablets)
  const numberWilds = useAppSelector(selectNumberWilds)
  const numberClones = useAppSelector(selectNumberClones)
  const dispatch = useAppDispatch();

  return (
    <div>
      <Field iconUrl={compassIconUrl} value={numberCompasses} onPlus={() => dispatch(incrementNumberCompasses())} onMinus={() => dispatch(decrementNumberCompasses())} />
      <Field iconUrl={tabletIconUrl} value={numberTablets} onPlus={() => dispatch(incrementNumberTablets())} onMinus={() => dispatch(decrementNumberTablets())} />
      <Field iconUrl={cogIconUrl} value={numberCogs} onPlus={() => dispatch(incrementNumberCogs())} onMinus={() => dispatch(decrementNumberCogs())} />
      <Field iconUrl={wildIconUrl} value={numberWilds} onPlus={() => dispatch(incrementNumberWilds())} onMinus={() => dispatch(decrementNumberWilds())} />
      <Field iconUrl={cloneIconUrl} value={numberClones} onPlus={() => dispatch(incrementNumberClones())} onMinus={() => dispatch(decrementNumberClones())} />
      <BestScore />
      <hr />
      Steps:
      <ol>
        <li>decide your wild symbols (wonders/cards)</li>
        <li>copy all to highest symbol (Armada)<ul><li>ties: pick 1 for all</li></ul></li>
        <li>calculate unique sets and groups</li>
      </ol>
    </div>
  );
}
