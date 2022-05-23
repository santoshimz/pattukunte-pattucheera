import React from 'react';
import {
  InstantSearch,
  Configure,
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import withURLSync from './URLSync';
import './App.css';
import { useLocalStorage } from './useLocalStorage';
import AsyncSelect from 'react-select/async';
const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const App =  (props) => {
    const [currentIndexFromStorage, setCurrentIndexFromStorage] = useLocalStorage("currentIndex", 1);
    const [currentGuesses, setCurrentGuesses] = useLocalStorage("currentGuesses", "");
    const [gameStatus, setGameStatus] = useLocalStorage("gameStatus", "running");
    return (
        <>
        <div style={{display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginTop: '20px'}}>Pattukunte Pattucheera</div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <InstantSearch
                searchClient={searchClient}
                indexName="movies"
                searchState={props.searchState}
                createURL={props.createURL}
                onSearchStateChange={props.onSearchStateChange}
            >
                <Configure hitsPerPage={10} />
                <div className="searchbox-container" style={{marginBottom: '20px'}}>
                    <img alt='' src={`${currentIndexFromStorage.toString()}.png`} width="100%" height="100%" />
                </div>
                <SearchBox  
                    currentIndex={currentIndexFromStorage} 
                    setCurrentIndex={setCurrentIndexFromStorage} 
                    currentGuesses={currentGuesses} 
                    setCurrentGuesses={setCurrentGuesses}
                    gameStatus={gameStatus}
                    setGameStatus={setGameStatus} />
            </InstantSearch>
        </div>
        </>
)};



const SearchBox = ({currentIndex, setCurrentIndex, currentGuesses, setCurrentGuesses, gameStatus, setGameStatus}) => {
    const [inputValue, setValue] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState(null);
    const handleInputChange = value => {
        setValue(value);
    };
 
    const handleChange = value => {
        setSelectedValue(value.title);
        if (value.title === 'Paisa') {
            setGameStatus("completed");
        } else if (currentIndex === 5) {
            setGameStatus("failed");
        }
        else {
            setCurrentIndex(currentIndex +1);
            if(currentGuesses !== '') {
                setCurrentGuesses(currentGuesses+ ',' + value.title);
            } else {
                setCurrentGuesses(value.title);
            }
        }
    }
 
    const fetchData = async () => {
        const index = searchClient.initIndex('movies')
        const hits = await index.search(inputValue);
        return hits.hits;
    }
    const allGuesses = currentGuesses !== "" ?  currentGuesses.split(',') : [];
    
    return (
        <>
            <div className="searchbox-container" style={{marginBottom: '20px'}}>
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={e => e.title}
                getOptionValue={e => e.title}
                loadOptions={fetchData}
                onInputChange={handleInputChange}
                onChange={handleChange}
            />
            </div>
            <div className="searchbox-container" style={{display: 'flex', flexDirection: 'column'}}>
            {allGuesses.map((allGuess) => {
                return (
                    <div key={allGuess} style={{display: 'flex', flexDirection: 'row'}}>
                    <span role='img' aria-label='Error'>&#10060;</span><span key={allGuess} style={{marginLeft: '10px'}}>{allGuess}</span>
                    </div>
                )
            })}
            {gameStatus === "running" && <span style={{marginTop: '20px'}}>{`You got ${6 - currentIndex} guesses remaining`}</span>}
            {gameStatus === "completed" && <span style={{marginTop: '20px'}}>You got it - The answer was Paisa</span>}
            {gameStatus === "failed" && <span style={{marginTop: '20px'}}>The answer was Paisa</span>}
            </div>
         </>
    )
};

export default withURLSync(App);