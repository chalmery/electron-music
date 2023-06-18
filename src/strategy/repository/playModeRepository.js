import listLoop from "@/strategy/playmode/listLoop";
import random from "@/strategy/playmode/random";
import singleLoop from "@/strategy/playmode/singleLoop";
import PlayMode from "@/enums/playMode";


const playModeRepository = new Map();

playModeRepository.set(PlayMode.SINGLE_LOOP, singleLoop)
playModeRepository.set(PlayMode.LIST_LOOP, listLoop)
playModeRepository.set(PlayMode.RANDOM, random)

export default playModeRepository