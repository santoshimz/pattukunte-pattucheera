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
import range from 'lodash/range';
import Modal from 'react-modal';
import { customStyles } from './styles';
import { ALGOLIA_CLIENT, MOVIE_NAME, dayCount } from './constants';

const searchClient = algoliasearch(
    'latency',
    ALGOLIA_CLIENT
);


const App =  (props) => {
    const [currentIndexFromStorage, setCurrentIndexFromStorage] = useLocalStorage("currentIndex", 1);
    const [buttonLogic, setButtonLogic] = React.useState(false);
    const [currentIndexFromButton, setCurrentIndexFromButton] = React.useState(1);
    const [currentGuesses, setCurrentGuesses] = useLocalStorage("currentGuesses", "");
    const [gameStatus, setGameStatus] = useLocalStorage("gameStatus", "running");
    const [day, setDay] = useLocalStorage("day", 1);
    const [openStatsModal, setOpenStatsModal] = React.useState(false);
    const [movieName, setMovieName] = React.useState("");
    const initialStats = {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0
    };

    const [stats, setStats] = useLocalStorage("stats", JSON.stringify(initialStats));

    const statsObj = React.useMemo(() => {
        return typeof stats === "string" ? JSON.parse(stats) : stats;
    }, [stats]) 

    React.useEffect(() => {
        if (day === dayCount) {
            setGameStatus("running");
            setDay(dayCount + 1);
            setCurrentGuesses("");
            setCurrentIndexFromStorage(1);
            setMovieName(MOVIE_NAME);
        }
    }, [day, setCurrentGuesses, setCurrentIndexFromStorage, setDay, setGameStatus]);
    return (
        <div style={customStyles.backgroundStyle}>
        <div style={customStyles.headerStyle}>Pattukunte Pattucheera</div>
        <span style={customStyles.statsStyle} onClick={() => setOpenStatsModal(true)}>STATS</span>
        <Modal
            isOpen={openStatsModal}
            onRequestClose={() => setOpenStatsModal(false)}
            style={customStyles}
        >
           <div style={customStyles.spaceBetween}>
                <span style={{marginTop: '8px', fontSize: '16px'}}>Stats from 5/23/2022</span>
                <button className="btn" onClick={() => setOpenStatsModal(false)}><i className="fa fa-close"></i></button>
           </div>
           <h3>{`Played: ${statsObj.gamesPlayed}`}</h3>
           <h3>{`Won: ${statsObj.gamesWon}`}</h3>
           <h3>{`Current Streak: ${statsObj.currentStreak ?  statsObj.currentStreak : statsObj.gamesPlayed === statsObj.gamesWon ? statsObj.gamesPlayed : 0}`}</h3>
           <h3>{`Max Streak: ${statsObj.maxStreak ?  statsObj.maxStreak : statsObj.gamesPlayed === statsObj.gamesWon ? statsObj.gamesPlayed : 0}`}</h3>
      </Modal>
        <div style={customStyles.column}>
        <InstantSearch
                searchClient={searchClient}
                indexName="movies"
                searchState={props.searchState}
                createURL={props.createURL}
                onSearchStateChange={props.onSearchStateChange}
            >
                <Configure hitsPerPage={10} />
                <div className="searchbox-container" style={customStyles.marginBottom}>
                    <img alt='' src={buttonLogic ?  `${currentIndexFromButton.toString()}.png` : `${currentIndexFromStorage.toString()}.png`} width="100%" height="100%" />
                    <div className='searchbox-container' style={customStyles.marginTop}>
                        {range(0, currentIndexFromStorage).map((index) => {
                            return <button key={index} style={{...customStyles.marginLeft, ...customStyles.marginBottom}} onClick={() => {
                            setCurrentIndexFromButton(index+1);
                            setButtonLogic(true);
                            }}>{index+1}</button>
                        })}
                    </div>
                </div>
              
                <SearchBox  
                    currentIndex={currentIndexFromStorage} 
                    setCurrentIndex={setCurrentIndexFromStorage} 
                    currentGuesses={currentGuesses} 
                    setCurrentGuesses={setCurrentGuesses}
                    gameStatus={gameStatus}
                    setGameStatus={setGameStatus} 
                    day={day}
                    setDay={setDay}
                    setStats={setStats}
                    stats={stats}
                    gameStats={statsObj} 
                    movieName={movieName}/>
            </InstantSearch>
        </div>
        </div>
)};



const SearchBox = ({movieName, currentIndex, setCurrentIndex, currentGuesses, setCurrentGuesses, gameStatus, setGameStatus, stats, setStats,day, setDay, gameStats}) => {
    const [shareText, setShareText] = React.useState("SHARE")
    const [inputValue, setValue] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState(null);
    const handleInputChange = value => {
        setValue(value);
    };
 
    const handleChange = value => {
        setSelectedValue(value.title);
        if (value.title === movieName) {
            setGameStatus("completed");
            setStats(JSON.stringify({
                gamesPlayed: gameStats.gamesPlayed + 1,
                gamesWon: gameStats.gamesWon + 1,
                currentStreak: gameStats.currentStreak ?  gameStats.currentStreak + 1 : gameStats.gamesPlayed === gameStats.gamesWon ? gameStats.gamesWon + 1 : 1,
                maxStreak: gameStats.currentStreak ?  gameStats.currentStreak + 1 : gameStats.gamesPlayed === gameStats.gamesWon ? gameStats.gamesWon + 1 : 1,
            }))
        } else if (currentIndex === 5) {
            setGameStatus("failed");
            setStats(JSON.stringify({
                gamesPlayed: gameStats.gamesPlayed + 1,
                gamesWon: gameStats.gamesWon,
                maxStreak: gameStats.currentStreak ?  gameStats.currentStreak : 0,
                currentStreak: 0,
            }))
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

    const copyText = () =>  {   
        let str = `Pattukunte Pattucheera Day ${day}: ${currentIndex}/5\nhttps://pattukunte-pattucheera.netlify.app/\n#PattukuntePattuCheera`
        navigator.clipboard.writeText(str);
        setShareText("COPIED");
      }
    
    return (
        <>
            <div className="searchbox-container" style={customStyles.marginBottom}>
            {gameStatus === "running" &&
            <AsyncSelect
                placeholder='Enter a movie name'
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={e => e.title}
                getOptionValue={e => e.title}
                loadOptions={fetchData}
                onInputChange={handleInputChange}
                onChange={handleChange}
            />}
            </div>
            <div className="searchbox-container" style={customStyles.column}>
            {allGuesses.map((allGuess) => {
                return (
                    <div key={allGuess} style={customStyles.row}>
                    <span role='img' aria-label='Error'>&#10060;</span><span key={allGuess} style={{ ...customStyles.marginLeft, color: 'white'}}>{allGuess}</span>
                    </div>
                )
            })}
            {gameStatus === "running" && <span style={{ ...customStyles.marginTop, color: 'white'}}>{`You got ${6 - currentIndex} guesses remaining`}</span>}
            {gameStatus === "completed" && <span style={{...customStyles.marginTop, color: 'white'}}>{`You got it - The answer was ${movieName}`}</span>}
            {gameStatus === "failed" && <span style={{ ...customStyles.marginTop, color: 'white'}}>{`The answer was ${movieName}`}</span>}
            <div id='share' style={{ ...customStyles.row,  width: '1.2em', height: '1.2em'}}>
                {range(1, currentIndex).map((index) => {
                    return <img  key={index} style={customStyles.marginRight} src='https://abs-0.twimg.com/emoji/v2/svg/1f7e5.svg' alt='' />
                })} 
                  {gameStatus === "completed" && <img style={customStyles.marginRight} src='https://abs-0.twimg.com/emoji/v2/svg/1f7e9.svg' alt='' />}
            </div>
            <button style={customStyles.shareText} onClick={copyText}>{shareText}</button>
            <span style={{color: 'white'}}>Done with love by <a style={{color: 'purple'}} href='https://twitter.com/santoshimz' rel="noopener noreferrer" target='_blank'>santoshimz</a>. Reach out for maintaining project/questions</span>
            </div>
         </>
    )
};

export default withURLSync(App);